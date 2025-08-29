const https = require('https');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const querystring = require('querystring');
const { Upload } = require('@aws-sdk/lib-storage');

const aMonth = 2624016000;
const aWeek = 604800000;

const cacheDurations = {
  '/api/public/vessel/244110828/positions?fromDate=&untilDate=&size=2500': 60 * 1000 * 60 * 12, // half day
  '/api/public/vessel/hostName/maps.lunaverde.nl': aWeek, // 7 days
  '/api/public/vessel/04ZJT6/positions/portugal': aMonth, // approximately a month
};

async function readFromS3(s3Client, s3BucketName, objectKey) {
  console.log("Read from s3: " + objectKey);
  try {
    const command = new GetObjectCommand({
      Bucket: s3BucketName,
      Key: objectKey
    });
    const { Body, LastModified } = await s3Client.send(command);
    let data = '';
    for await (const chunk of Body) {
      data += chunk.toString();
    }
    return { data, LastModified };
  } catch (error) {
    console.error("s3 error: " + error);
    // If the object doesn't exist or any other error occurs, return null
    return null;
  }
}

async function readFromAPI(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function writeToS3(s3Client, s3BucketName, objectKey, data) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: s3BucketName,
      Key: objectKey,
      Body: data
    }
  });

  try {
    await upload.done();
  } catch (err) {
    console.error('Error uploading to S3:', err);
    if (err.httpStatusCode) console.log("ROOT:" + err.httpStatusCode);
    if (err.$metadata.httpStatusCode) console.log("METADATA" + err.$metadata.httpStatusCode);
    if (err.httpStatusCode && err.httpStatusCode === 409) {
      console.error('Conflict error: The object may already exist or there may be a configuration conflict.');
    }
    throw err;
  }
}

function getCacheDuration(path) {
  for (const [route, duration] of Object.entries(cacheDurations)) {
    if (path.startsWith(route)) {
      return duration;
    }
  }
  // Default cache duration is 15 minutes
  return 15 * 60 * 1000;
}

const handleApi = async (s3Client,s3BucketName, apiBackendURL, req, res) => {
  const { method, path, query } = req;
  const apiPath = "/api" + path;

  if (method !== 'GET') {
    return res.status(400).json({ message: 'Request method not supported' });
  }


  let objectKey = apiPath.startsWith('/') ? apiPath.slice(1) : apiPath;
  objectKey = `${objectKey}/data.json`;
  if (query) {
    const queryString = querystring.stringify(query);
    objectKey += `?${queryString}`;
  }

  let data;

  try {
    const s3Result = await readFromS3(s3Client,s3BucketName, objectKey);
    if (s3Result && s3Result.data && s3Result.LastModified) {
      const { data: s3Data, LastModified: lastModified } = s3Result;
      const cacheDuration = getCacheDuration(apiPath);

      // Calculate the time difference between the current time and last modified time of the object
      const lastModifiedTime = new Date(lastModified).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastModifiedTime;

      data = s3Data;
      if (timeDifference <= cacheDuration) {
        console.log("Return from cache");
        // Object found in S3 and not older than 5 minutes, return data
        return res.status(200).send(data);
      }
    }
  } catch (err) {
    console.error(err);

  }
  let apiData;

  try {
    const apiUrl = `${apiBackendURL}${apiPath}?${querystring.stringify(query)}`;
    
    apiData = await readFromAPI(apiUrl);

    // If status is given, its always not a 200
    if (apiData && apiData.data && apiData.statusCode && apiData.statusCode >= 200 && apiData.statusCode < 300) {
      // Write data to S3 for future use
      console.log("write to s3: " + objectKey);
      await writeToS3(s3Client, s3BucketName, objectKey, apiData.data);

      console.log("Return from API");
      return res.status(apiData.statusCode).send(apiData.data);
    }
  } catch (err) {
    console.log("Could not read from api: " + err)
  }

  // Outdated cache on read from API error
  if (data) {
    if(apiData && apiData.statusCode) {
      console.log("Api gave error, statuscode: " + apiData.statusCode)
    }
    console.log("Return outdated cache");
    return res.status(200).send(data);
  }

  // If no cache available, and the api failed, lets just show it.
  if (apiData && apiData.statusCode ) { 
    if(apiData.data) {
      console.log("No cache, api failed, show with data")
      return res.status(apiData.statusCode).send(apiData.data)
    }
    console.log("No cache, api failed, show without data")
    return res.status(apiData.statusCode).send()
  }

  console.error("Internal server error 500");
  return res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = {
    handleApi
};
