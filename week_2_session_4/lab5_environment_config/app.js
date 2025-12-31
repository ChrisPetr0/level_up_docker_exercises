const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

// Read from environment variables
const redisHost = process.env.REDIS_HOST || 'localhost';
const appEnv = process.env.NODE_ENV || 'development';
const appName = process.env.APP_NAME || 'Config Demo';

console.log(`=== Configuration ===`);
console.log(`App Name: ${appName}`);
console.log(`Environment: ${appEnv}`);
console.log(`Redis Host: ${redisHost}`);

const client = redis.createClient({
  socket: { host: redisHost, port: 6379 }
});

client.on('error', (err) => console.error('Redis Error:', err));
client.connect();

app.get('/', async (req, res) => {
  try {
    const visits = await client.incr('visits');
    
    const bgColor = appEnv === 'production' 
      ? 'linear-gradient(135deg, #c850c0 0%, #4158d0 100%)'
      : 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)';
    
    res.send(`
      <html>
        <head><title>${appName}</title></head>
        <body style="font-family: Arial; max-width: 700px; margin: 50px auto; 
                     background: ${bgColor}; color: white; padding: 30px;">
          <h1>🐳 ${appName}</h1>
          <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 10px;">
            <div style="font-size: 64px; text-align: center; color: #ffd700;">${visits}</div>
            <h3>Configuration:</h3>
            <p><strong>APP_NAME:</strong> ${appName}</p>
            <p><strong>NODE_ENV:</strong> ${appEnv}</p>
            <p><strong>REDIS_HOST:</strong> ${redisHost}</p>
          </div>
          <h3>🎯 Key Learning</h3>
          <ul>
            <li>Same image, different configuration</li>
            <li>No rebuild needed - just change -e flags</li>
            <li>Production vs Development modes</li>
          </ul>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`${appName} running on port ${port}`);
});
