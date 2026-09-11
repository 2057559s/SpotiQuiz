const https = require('https');
const fs = require('fs');
const { createServer } = require('http');

// Read the certificate and key
const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};

// Create a simple redirect server on HTTP port 3001 to HTTPS
const httpServer = createServer((req, res) => {
  // Redirect HTTP to HTTPS
  const host = req.headers.host.split(':')[0];
  res.writeHead(301, {
    'Location': `https://${host}:3443${req.url}`
  });
  res.end();
});

// Import Next.js handler
const { nextApp } = require('./next-handler.js');

// Create HTTPS server with Next.js handler
const httpsServer = https.createServer(options, nextApp);

// Start both servers
const HTTP_PORT = 3001;
const HTTPS_PORT = 3443;

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP redirect server running on http://localhost:${HTTP_PORT}`);
});

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close();
  httpsServer.close();
  process.exit(0);
});
