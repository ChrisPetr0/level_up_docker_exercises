# Lab 2: Health Checks and Resource Limits

## Objective

Deploy a Flask application with health checks and resource limits to understand service monitoring and resource management in Docker Swarm.

---

## Steps

### 1. Initialize Swarm (if not already active)

```bash
docker swarm init
```

---

### 2. Build the Application Image

```bash
docker build -t health-app .
```

**Expected output:**
```
Successfully built abc123def456
Successfully tagged health-app:latest
```

---

### 3. Deploy Service with Health Checks and Resource Limits

```bash
docker service create \
  --name health-svc \
  --replicas 3 \
  -p 5000:5000 \
  --limit-cpu 0.5 \
  --limit-memory 128M \
  --reserve-cpu 0.25 \
  --reserve-memory 64M \
  health-app
```

**Resource parameters explained:**
- `--limit-cpu 0.5`: Maximum 50% of one CPU core per container
- `--limit-memory 128M`: Maximum 128MB RAM per container
- `--reserve-cpu 0.25`: Reserve 25% of one CPU core (guaranteed minimum)
- `--reserve-memory 64M`: Reserve 64MB RAM (guaranteed minimum)

---

### 4. Monitor Service Status

```bash
docker service ps health-svc
```

**Expected output:**
```
ID             NAME            IMAGE         NODE      DESIRED STATE   CURRENT STATE
xyz789abc123   health-svc.1    health-app    node1     Running         Running 30 seconds ago
def456ghi789   health-svc.2    health-app    node1     Running         Running 30 seconds ago
jkl012mno345   health-svc.3    health-app    node1     Running         Running 30 seconds ago
```

Check service details:
```bash
docker service inspect health-svc --pretty
```

---

### 5. Check Health Status

Get a container ID:
```bash
docker ps | grep health-svc
```

Inspect health status:
```bash
docker inspect <container-id> | grep -A 10 Health
```

**Expected output:**
```json
"Health": {
    "Status": "healthy",
    "FailingStreak": 0,
    "Log": [
        {
            "Start": "2024-01-15T10:30:00Z",
            "End": "2024-01-15T10:30:01Z",
            "ExitCode": 0,
            "Output": "healthy"
        }
    ]
}
```

Watch health checks in real-time (checks run every 10 seconds):
```bash
watch -n 2 'docker service ps health-svc'
```

---

### 6. View Service Logs

```bash
docker service logs health-svc
```

**Expected output:**
```
health-svc.1@node1    | * Running on http://0.0.0.0:5000
health-svc.2@node1    | * Running on http://0.0.0.0:5000
health-svc.3@node1    | * Running on http://0.0.0.0:5000
```

---

### 7. Test the Application

Test main endpoint:
```bash
curl http://localhost:5000
```

**Expected output:**
```json
{
  "status": "healthy",
  "container": "health-svc.1.xyz789abc123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Test health endpoint:
```bash
curl http://localhost:5000/health
```

**Expected output:**
```json
{
  "status": "ok"
}
```

---

### 8. Cleanup

```bash
docker service rm health-svc
docker rmi health-app
docker swarm leave --force
```

---

## Expected Outputs

### Service Creation
```
ID: abc123def456
Name: health-svc
Replicas: 3/3 running
Resources: CPU 0.25-0.5, Memory 64M-128M
```

### Health Check Status
```
Status: healthy
FailingStreak: 0
Last check: passed (0 seconds ago)
```

### Application Response
```json
{
  "status": "healthy",
  "container": "health-svc.1.xyz789abc123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Health Check Parameters Explained

The Flask app in this lab has a built-in health check with these parameters:
- `--interval=10s`: Check every 10 seconds (default: 30s)
- `--timeout=3s`: Wait max 3 seconds for response (default: 30s)
- `--retries=3`: Need 3 consecutive failures before marking unhealthy (default: 3)
- `--start-period=5s`: Give container 5 seconds to start before health checks count (default: 0s)

**Tuning considerations:**
- **Faster intervals (10s):** Detect failures quicker but use more resources
- **Slower intervals (30s+):** Less overhead but slower failure detection
- **More retries:** Reduce false positives from temporary issues
- **Start period:** Allows slow-starting apps to initialize without being marked unhealthy

---

## Key Takeaways

- **Health Checks:** Swarm monitors container health automatically at configured intervals
- **Auto-Recovery:** Unhealthy containers are automatically restarted by Swarm
- **Resource Limits:** Prevent containers from consuming excessive CPU or memory
- **Resource Reservations:** Guarantee minimum resources for each container
- **Monitoring:** View health status through service ps, inspect, and logs
- **Faster Detection:** 10-second intervals detect failures 3x faster than default 30-second intervals
- **Production Balance:** Balance detection speed with overhead based on application needs
- **Graceful Handling:** Start period prevents health check failures during slow application startup

---

## Quick Reference

```bash
# Deploy with health checks and limits
docker service create \
  --name <name> \
  --replicas <count> \
  -p <port:port> \
  --limit-cpu <value> \
  --limit-memory <value> \
  --reserve-cpu <value> \
  --reserve-memory <value> \
  <image>

# Monitor health
docker service ps <service-name>
docker inspect <container-id> | grep -A 10 Health

# View logs
docker service logs <service-name>

# Watch real-time updates
watch -n 2 'docker service ps <service-name>'
```

---

## Next Lab

Proceed to **Lab 3: Complete Stack Deployment** to deploy multi-service applications with overlay networks and placement constraints.
