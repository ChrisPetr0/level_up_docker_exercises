# Lab 1: First Docker Compose File

Create your first multi-container application using Docker Compose.

## Objective

Learn Docker Compose basics by building a Node.js visit counter with Redis backend.

---

## What You'll Build

A simple visit counter with two containers:
- **Node.js + Express** - Web application
- **Redis** - In-memory database for counter
- Connected via automatic DNS

```
┌──────────────┐
│  Node.js App │ :8080
└──────┬───────┘
       │ DNS: 'redis'
       ↓
┌──────────────┐
│    Redis     │ :6379
└──────────────┘
```

---

## Files Provided

In this lab directory:
- `docker-compose.yml` - Multi-container orchestration
- `Dockerfile` - Node.js app build instructions
- `app.js` - Express server with Redis client
- `package.json` - Node.js dependencies

---

## Steps

### 1. Navigate to Lab Directory

```bash
cd ~/level_up_curriculum/labs/week_3_session_5/lab1_first_compose
```

Or create your own:
```bash
mkdir ~/compose-demo
cd ~/compose-demo
```

---

### 2. Review the Compose File

**Look at `docker-compose.yml`:**

```yaml
services:
  web:
    build: .
    ports:
      - "8080:3000"
    volumes:
      - ./app.js:/app/app.js:ro
    environment:
      - REDIS_HOST=redis
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
```

**Key points:**
- `services:` - Define containers
- `build: .` - Build from local Dockerfile
- `image:` - Use pre-built image
- `depends_on:` - Start order (Redis first)
- Service name `redis` becomes DNS hostname

---

### 3. Validate the Compose File

```bash
docker compose config
```

Checks for syntax errors and shows resolved configuration.

---

### 4. Start the Application

```bash
docker compose up --build -d
```

**What this does:**
- `--build` - Build images before starting
- `-d` - Detached mode (runs in background)

**Expected output:**
```
[+] Building 30.5s
 => [web] FROM node:18-alpine
 => [web] COPY package.json .
 => [web] RUN npm install
[+] Running 2/2
 ✔ Container lab1-redis-1  Started
 ✔ Container lab1-web-1    Started
```

---

### 5. Verify Services are Running

```bash
docker compose ps
```

**Expected output:**
```
NAME           IMAGE              STATUS    PORTS
lab1-redis-1   redis:7-alpine     Up        6379/tcp
lab1-web-1     lab1-web           Up        0.0.0.0:8080->3000/tcp
```

Both should show `Up`.

---

### 6. View Logs

```bash
docker compose logs
```

**Look for:**
```
redis-1  | * Ready to accept connections
web-1    | Server running on port 3000
web-1    | Connected to Redis at redis
```

---

### 7. Test the Application

**Open browser:**
```
http://localhost:8080
```

**Expected:**
- Visit counter (starts at 1)
- Refresh page - counter increments!

**Or use curl:**
```bash
curl http://localhost:8080
# Visit 1

curl http://localhost:8080
# Visit 2
```

---

### 8. Test Service DNS

```bash
docker compose exec web sh
```

**Inside the container:**
```bash
# Test DNS resolution
ping -c 2 redis

# Check Redis connection
apk add --no-cache redis
redis-cli -h redis ping
# Output: PONG

# Check counter value
redis-cli -h redis GET visits

exit
```

The hostname `redis` resolves to the Redis container!

---

### 9. View Real-Time Logs

```bash
docker compose logs -f
```

Refresh browser multiple times and watch logs update. Press `Ctrl+C` to exit.

---

### 10. Edit Code (Live Reload)

The compose file has a bind mount:
```yaml
volumes:
  - ./app.js:/app/app.js:ro
```

**Edit `app.js`:**
```bash
sed -i 's/Docker Compose Counter/My Amazing Counter/g' app.js
```

**Restart web service:**
```bash
docker compose restart web
```

**Refresh browser** - changes appear! Counter persists because Redis is still running.

---

### 11. Stop the Application

```bash
docker compose down
```

**Expected output:**
```
[+] Running 3/3
 ✔ Container lab1-web-1    Removed
 ✔ Container lab1-redis-1  Removed
 ✔ Network lab1_default    Removed
```

---

## Understanding the Compose File

**Service definition:**
```yaml
web:                    # Service name (becomes DNS hostname)
  build: .             # Build from ./Dockerfile
  ports:
    - "8080:3000"      # host:container
  environment:
    - KEY=value        # Environment variable
  depends_on:
    - redis            # Start after redis
```

**Networks:**
- Compose creates a network automatically
- All services join this network
- Services reach each other by name

**Volumes:**
```yaml
volumes:
  - ./app.js:/app/app.js:ro    # Bind mount (ro=read-only)
```

---

## Compose vs Docker Commands

**Docker commands (Week 2):**
```bash
docker network create app-net
docker run -d --name redis --network app-net redis:7-alpine
docker build -t web-app .
docker run -d --name web --network app-net -p 8080:3000 -e REDIS_HOST=redis web-app
```

**Compose (Week 3):**
```bash
docker compose up -d
```

One command does everything!

---

## Key Takeaways

✅ Compose orchestrates multiple containers  
✅ `docker-compose.yml` defines entire application  
✅ Services communicate via automatic DNS  
✅ `docker compose up -d` starts everything  
✅ `docker compose down` stops and removes  
✅ Bind mounts enable live development  
✅ One command replaces many docker run commands  

---

## Common Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Restart service
docker compose restart web

# Execute command
docker compose exec web sh

# Build images
docker compose build

# View running services
docker compose ps
```

---

## Troubleshooting

**Port already in use:**
```yaml
ports:
  - "8081:3000"  # Use different host port
```

**Container won't start:**
```bash
docker compose logs service-name
```

**Rebuild after changes:**
```bash
docker compose up --build -d
```

---

## Cleanup

```bash
docker compose down
```

---

## Next Lab

[Lab 2: WordPress + MySQL](../lab2_wordpress_mysql/) - Deploy a production-ready CMS stack.
