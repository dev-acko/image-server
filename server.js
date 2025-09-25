// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // optional

const app = express();
const PORT = process.env.PORT || 8000;
const IMAGE_DIR = path.resolve(process.env.IMAGE_DIR || path.join(__dirname, 'images'));

// Ensure images folder exists
if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

// Optional: allow cross-origin requests (useful for embedding from other origins)
app.use(cors());

// Serve images at /image/<filename>
app.use('/image', express.static(IMAGE_DIR, {
  extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'json'],
  index: false,
  setHeaders: (res, filePath) => {
    // cache for 1 day
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

app.get('/', (req, res) => {
  res.send(`
    <h3>Image server</h3>
    <p>Place images in <code>${IMAGE_DIR}</code> and fetch them at <code>/image/sample_image.svg</code>.</p>
    <h4>When consuming the image in app/bff please use the vpn client address not localhost. </h4>
    <h5>Eg. - http://191.177.214.217:8000/image/fasting.svg </h5>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log(`Serving images from: ${IMAGE_DIR}`);
});
