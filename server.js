/**
 * server.js — Máy chủ tĩnh nội bộ phục vụ đồ án Ốc Xanh
 * Sử dụng thư viện có sẵn của Node.js (không cần cài thêm npm packages)
 * Cổng mặc định: 3000 (tránh xung đột với cổng 8080 của NVIDIA Broadcast)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  // Chuẩn hóa URL
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Bảo vệ không cho duyệt ngược ngoài thư mục
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${reqPath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('====================================================');
  console.log(`  ỐC XANH SHOP — SERVER ĐÃ SẴN SÀNG!`);
  console.log(`  -> Trang chủ khách hàng : http://localhost:${PORT}/index.html`);
  console.log(`  -> Trang quản trị Admin : http://localhost:${PORT}/admin.html`);
  console.log(`  -> Trang đăng nhập      : http://localhost:${PORT}/login.html`);
  console.log('====================================================');
});

