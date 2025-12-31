const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

const redisHost = process.env.REDIS_HOST || 'redis';

const client = redis.createClient({
  socket: { host: redisHost, port: 6379 }
});

client.on('error', (err) => console.error('Redis Error:', err));
client.connect();

app.get('/', async (req, res) => {
  try {
    const visits = await client.incr('visits');
    res.send(`
      <html>
        <head><title>Visit Counter</title></head>
        <body style="font-family: Arial; max-width: 600px; margin: 50px auto; text-align: center;">
          <h1>🐳 Multi-Container App</h1>
          <div style="font-size: 72px; color: #667eea; margin: 40px 0;">${visits}</div>
          <p>This webapp talks to Redis using DNS!</p>
          <p>Connection: <code>redis://${redisHost}:6379</code></p>
          <p><small>Refresh to increment counter</small></p>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}`);
  console.log(`Connected to Redis at: ${redisHost}:6379`);
});
