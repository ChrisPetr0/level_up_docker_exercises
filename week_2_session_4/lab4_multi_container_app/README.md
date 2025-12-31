# Lab 4: Multi-Container Web Application

Build a real Node.js webapp that connects to Redis using custom network DNS.

## Objective

Apply everything learned: Dockerfile, volumes, networks, DNS, environment variables.

---

## Files Provided

In this lab directory:
- `app.js` - Node.js Express app with Redis client
- `package.json` - Dependencies (express, redis)
- `Dockerfile` - Builds the app image

---

## Steps

### 1. Review the Application Code

**Look at `app.js`:**
```javascript
const express = require('express');
const redis = require('redis');

const app = express();
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

const client = redis.createClient({
    socket: { host: REDIS_HOST, port: 6379 }
});
// ... visit counter logic
```

**Key points:**
- Reads `REDIS_HOST` from environment variable
- Connects to Redis using hostname (not IP)
- Increments visit counter on each request

---

### 2. Build the Webapp Image

```bash
docker build -t visit-counter .
```

**Expected output:**
```
[+] Building 30.5s (10/10) FINISHED
 => [1/5] FROM docker.io/library/node:18-alpine
 => [2/5] WORKDIR /app
 => [3/5] COPY package*.json ./
 => [4/5] RUN npm install
 => [5/5] COPY app.js .
```

**Verify image exists:**
```bash
docker images | grep visit-counter
```

---

### 3. Create the Network

```bash
docker network create app-network
```

---

### 4. Run Redis (NO Port Publishing!)

```bash
docker run -d --name redis --network app-network redis:alpine
```

**Note:** No `-p` flag! Redis is internal-only, accessible only via the network.

---

### 5. Run the Webapp

```bash
docker run -d --name webapp \
  --network app-network \
  -p 3000:3000 \
  -e REDIS_HOST=redis \
  visit-counter
```

**What this does:**
- `--network app-network` - Joins the network
- `-p 3000:3000` - Published to host (externally accessible)
- `-e REDIS_HOST=redis` - Tells app to connect to container named `redis`

**Check both containers:**
```bash
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE           STATUS         PORTS                    NAMES
abc123...      visit-counter   Up 5 seconds   0.0.0.0:3000->3000/tcp  webapp
def456...      redis:alpine    Up 10 seconds  6379/tcp                redis
```

---

### 6. Test the Application

**Open browser:**
```
http://localhost:3000
```

**Expected output:**
```
Visit Counter
This page has been visited X times!
```

**Refresh multiple times** - watch the counter increment!

**Or use curl:**
```bash
curl http://localhost:3000
# Visit 1

curl http://localhost:3000
# Visit 2

curl http://localhost:3000
# Visit 3
```

---

### 7. View Application Logs

```bash
docker logs webapp
```

**Expected output:**
```
Connected to Redis at redis:6379
Server running on port 3000
```

See how it connected to `redis` by name!

---

### 8. Verify Network Configuration

```bash
docker network inspect app-network --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'
```

**Expected output:**
```
redis: 172.18.0.2/16
webapp: 172.18.0.3/16
```

Both containers are on the same network.

---

### 9. Test DNS from Inside Webapp

```bash
docker exec webapp ping -c 2 redis
```

**Expected output:**
```
PING redis (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.089 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.095 ms
```

DNS resolution works!

---

### 10. Check Redis Data

```bash
docker exec redis redis-cli GET visit_count
```

**Expected output:**
```
"5"
```

(Or however many times you visited the page)

---

## How It All Works Together

```
┌─────────────────────────────────────────┐
│         app-network                     │
│                                         │
│  ┌──────────┐         ┌─────────────┐  │
│  │  webapp  │────────>│    redis    │  │
│  │  :3000   │  DNS    │   :6379     │  │
│  └────┬─────┘ "redis" └─────────────┘  │
│       │ (-p 3000:3000)                  │
└───────┼─────────────────────────────────┘
        │
   Browser Access
   localhost:3000
```

**Key architecture:**
- Webapp is publicly accessible via `-p 3000:3000`
- Redis is internal-only (no `-p` flag)
- Webapp finds Redis using DNS name `redis`
- Environment variable `REDIS_HOST=redis` configures connection

---

## Key Takeaways

✅ Built custom image with Dockerfile  
✅ Used custom network for container communication  
✅ DNS resolution connects webapp to Redis by name  
✅ Environment variables configure connections  
✅ Only webapp is publicly accessible (security)  
✅ Redis is internal-only (no port publishing)  
✅ Real-world production pattern  

---

## Challenge: Add Persistence

Right now, if you restart Redis, the counter resets. Fix this!

**Solution:**

```bash
# Stop and remove Redis
docker stop redis
docker rm redis

# Create volume
docker volume create redis-data

# Run Redis with volume
docker run -d --name redis \
  --network app-network \
  -v redis-data:/data \
  redis:alpine redis-server --appendonly yes
```

**Test:**
- Visit the page a few times
- Restart Redis: `docker restart redis`
- Refresh page - counter persists!

---

## Cleanup

```bash
docker stop webapp redis
docker rm webapp redis
docker network rm app-network
docker rmi visit-counter

# If you did the challenge:
docker volume rm redis-data
```

---

## Quick Reference

```bash
# Build image
docker build -t name .

# Create network
docker network create net

# Run containers on network
docker run -d --name db --network net postgres
docker run -d --name app --network net -p 80:80 -e DB_HOST=db my-app

# Check network
docker network inspect net
```

---

## Next Lab

[Lab 5: Environment Config](../lab5_environment_config/) - Use the same image for dev and production.
