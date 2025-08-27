const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
var expressStaticGzip = require("express-static-gzip");

const { handleApi } = require('./server/api');
const { getThumbnail, getMarkerImage } = require('./server/thumbnail');

const app = express();
const port = 5000;


// Other code for handleRequest function and related utility functions
const apiBackendURL = process.env.API_BACKEND_URL || '';
const s3Endpoint = process.env.S3_ENDPOINT || '';
const s3AccessKey = process.env.S3_ACCESS_KEY || '';
const s3SecretKey = process.env.S3_SECRET_KEY || '';
const s3BucketName = process.env.S3_BUCKET_NAME || '';
const s3Region = process.env.S3_REGION || '';

const s3Client = new S3Client({
  region: s3Region,
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey
  },
  endpoint: s3Endpoint,
  forcePathStyle: true
});


// Security headers
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31449600; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' analytics.bestanden.online 'unsafe-inline'; connect-src 'self' followmyvessel.eu.auth0.com *.partypieps.nl partypieps.nl *.followmyvessel.com followmyvessel.com *.arnovanrossum.nl; img-src 'self' data: *");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin');
  res.setHeader('Feature-Policy', "microphone 'none'; geolocation 'none'; camera 'none'");
  res.setHeader('Permissions-Policy', 'microphone=(); geolocation=(); camera=()');
  next();
});

// Gzip compression
app.use(compression());

// Path to the Angular build output
const angularDistPath = path.join(__dirname, 'dist', 'vesselmanager', 'browser');

app.use('/', expressStaticGzip(angularDistPath, {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  setHeaders: function (res, path) {
    if (path.endsWith('.html') || path.endsWith('.json')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    } else if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'max-age=31449600'); // one year
    } else {
      res.setHeader('Cache-Control', 'max-age=86400'); // one day
    }
  }
}));

const cacheMiddleware = (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
  next();
};

const corsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET'); 
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
};

// API middleware
// followmyvessel.com/api is never ending here, its routed by traefik.
app.use('/api', async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET'); 
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    await handleApi(s3Client, s3BucketName, apiBackendURL, req, res);
});

app.options('/marker/:uuid', corsMiddleware, (req, res) => {
  res.sendStatus(200);
});

app.options('/marker/:uuid/thumbnail', corsMiddleware, (req, res) => {
  res.sendStatus(200);
});
app.get('/marker/:uuid', corsMiddleware, cacheMiddleware, getMarkerImage(s3Client));
app.get('/marker/:uuid/thumbnail', corsMiddleware, cacheMiddleware, getThumbnail(s3Client));
app.get('/marker/:uuid/thumbnail/:size', corsMiddleware, cacheMiddleware, getThumbnail(s3Client));

app.all('/{*any}', (req, res, next) => {
// Fallback for SPA (to index.html)
// app.get('*', (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
