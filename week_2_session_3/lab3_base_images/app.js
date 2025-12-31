const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Base Image Comparison Demo!');
});

app.get('/info', (req, res) => {
  res.json({
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: process.memoryUsage()
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
