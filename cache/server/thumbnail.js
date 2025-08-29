const { GetObjectCommand } = require('@aws-sdk/client-s3');

// UUID regular expression
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


const getThumbnail = (s3Client) => async (req, res) => {
  const { uuid } = req.params;
  const { size = "1000x1000" } = req.params;

  // Check if the UUID is in the correct format
  if (!uuidRegex.test(uuid)) {
    return res.status(400).send('Invalid UUID format.');
  }

  try {
    const bucketName = 'fmv';
    const key = `markers/thumbnails/${size}/${uuid}`;

    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const response = await s3Client.send(command);

    res.setHeader('Content-Length', response.ContentLength);
    res.setHeader('Content-Type', response.ContentType);

    const bodyStream = response.Body;
    bodyStream.pipe(res);
  } catch (error) {
    if(error.$metadata && error.$metadata.httpStatusCode) {
        res.status(error.$metadata.httpStatusCode).send('Error retrieving the file.');
        return;
    }
    console.error('Error getting object from S3:', error);
    res.status(500).send('Error retrieving the file.');
  }
};


const getMarkerImage = (s3Client) => async (req, res) => {
  const { uuid } = req.params;

  // Check if the UUID is in the correct format
  if (!uuidRegex.test(uuid)) {
    return res.status(400).send('Invalid UUID format.');
  }

  try {
    const bucketName = 'fmv';
    const key = `markers/${uuid}`;

    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const response = await s3Client.send(command);

    res.setHeader('Content-Length', response.ContentLength);
    res.setHeader('Content-Type', response.ContentType);

    const bodyStream = response.Body;
    bodyStream.pipe(res);
  } catch (error) {
    if(error.$metadata && error.$metadata.httpStatusCode) {
        res.status(error.$metadata.httpStatusCode).send('Error retrieving the file.');
        return;
    }
    console.error('Error getting object from S3:', error);
    res.status(500).send('Error retrieving the file.');
  }
};


module.exports = {
  getThumbnail,
  getMarkerImage
};
