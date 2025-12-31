const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

// Redis connection
const redisHost = process.env.REDIS_HOST || 'localhost';
const client = redis.createClient({
  socket: {
    host: redisHost,
    port: 6379
  }
});

client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.log('Connected to Redis'));

// Connect to Redis
(async () => {
  await client.connect();
})();

app.get('/', async (req, res) => {
  try {
    // Increment visit counter
    const visits = await client.incr('visits');
    
    // Get current timestamp
    const timestamp = new Date().toLocaleString();
    
    // HTML response with beautiful gradient
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Docker Compose Counter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 40px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            backdrop-filter: blur(10px);
            min-width: 400px;
        }
        h1 { margin: 0; font-size: 3em; }
        .counter { font-size: 4em; margin: 30px 0; font-weight: bold; }
        p { font-size: 1.2em; margin: 10px 0; }
        .emoji { font-size: 4em; margin: 20px 0; }
        .info { 
            font-size: 0.9em; 
            opacity: 0.8; 
            margin-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.3);
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🐳</div>
        <h1>Docker Compose Counter</h1>
        <div class="counter">${visits}</div>
        <p>Total Visits</p>
        <p><small>Last visit: ${timestamp}</small></p>
        <div class="info">
            <p><strong>Multi-Container Magic! ✨</strong></p>
            <p>Node.js + Express + Redis</p>
            <p>Connected via service name: <code>redis</code></p>
        </div>
    </div>
</body>
</html>
    `;
    
    res.send(html);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Counter app listening on port ${port}`);
  console.log(`Connecting to Redis at: ${redisHost}`);
});
