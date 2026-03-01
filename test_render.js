const { execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
    
    // SPA fallback
    if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, 'dist', 'index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    // Try to hit the endpoint to ensure it works
    try {
      const resp = await fetch(`http://localhost:${PORT}/`);
      const text = await resp.text();
      console.log("Response starts with:", text.substring(0, 50));
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
});
