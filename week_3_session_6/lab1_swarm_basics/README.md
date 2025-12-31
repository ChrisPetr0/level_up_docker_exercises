# Lab 1: Docker Swarm Basics

## Objective

Initialize Docker Swarm, deploy services, scale replicas, and perform rolling updates while understanding load balancing behavior.

---

## Steps

### 1. Initialize Swarm

```bash
docker swarm init
```

View cluster nodes:
```bash
docker node ls
```

Verify Swarm is active:
```bash
docker info | grep Swarm
```

**Expected output:**
```
Swarm: active
```

---

### 2. Deploy Nginx Service

Deploy with 3 replicas (each shows its container hostname):
```bash
docker service create \
  --name web \
  --replicas 3 \
  -p 8080:80 \
  nginx sh -c 'echo "<h1>Served by container: $(hostname)</h1><p>Timestamp: $(date)</p>" > /usr/share/nginx/html/index.html && exec nginx -g "daemon off;"'
```

List services:
```bash
docker service ls
```

**Expected output:**
```
ID             NAME      MODE         REPLICAS   IMAGE          PORTS
abc123def456   web       replicated   3/3        nginx:latest   *:8080->80/tcp
```

See where replicas are running:
```bash
docker service ps web
```

---

### 3. Test Load Balancing

Use curl to demonstrate load balancing (each request may hit a different container):
```bash
curl http://localhost:8080
curl http://localhost:8080
curl http://localhost:8080
curl http://localhost:8080
curl http://localhost:8080
```

**Expected behavior:** You'll see different container IDs in the responses, demonstrating Swarm's load balancing.

**Why use curl instead of browser refresh?**
- Browsers cache connections and reuse the same TCP connection (HTTP keep-alive)
- This makes the browser stick to one container
- Curl creates a new connection each time, demonstrating load balancing
- To see load balancing in browser: open multiple private/incognito windows

Alternative continuous testing:
```bash
watch -n 1 curl -s http://localhost:8080
```

---

### 4. Scale the Service

Scale up to 5 replicas:
```bash
docker service scale web=5
```

View updated replicas:
```bash
docker service ps web
```

**Expected output:**
```
ID             NAME      IMAGE          NODE       DESIRED STATE   CURRENT STATE
xyz789abc123   web.1     nginx:latest   node1      Running         Running 2 minutes ago
def456ghi789   web.2     nginx:latest   node1      Running         Running 2 minutes ago
jkl012mno345   web.3     nginx:latest   node1      Running         Running 2 minutes ago
pqr678stu901   web.4     nginx:latest   node1      Running         Running 5 seconds ago
vwx234yz5678   web.5     nginx:latest   node1      Running         Running 5 seconds ago
```

---

### 5. Perform Rolling Update

Update to nginx:alpine version:
```bash
docker service update --image nginx:alpine web
```

Monitor update progress:
```bash
docker service ps web
```

**Expected behavior:**
- Swarm updates containers one at a time
- Old containers are stopped after new ones are running
- Zero downtime during update
- Load balancer continues distributing traffic

---

### 6. Cleanup

Remove service:
```bash
docker service rm web
```

Leave Swarm:
```bash
docker swarm leave --force
```

---

## Expected Outputs

### Service Creation
```
ID: abc123def456
Name: web
Replicas: 3/3 running
Ports: *:8080->80/tcp
```

### Load Balancing Test
```
<h1>Served by container: web.1.xyz789abc123</h1>
<h1>Served by container: web.3.jkl012mno345</h1>
<h1>Served by container: web.2.def456ghi789</h1>
```

### Scaling
```
web scaled to 5
overall progress: 5 out of 5 tasks
```

### Rolling Update
```
web
overall progress: 5 out of 5 tasks
verify: Service converged
```

---

## Key Takeaways

- **Swarm Init:** Single node becomes manager and worker
- **Service Model:** Deploy applications as services with desired replica count
- **Ingress Routing Mesh:** Swarm distributes requests across all replicas automatically
- **Load Balancing:** Each new connection is balanced to a different replica
- **Browser Behavior:** HTTP keep-alive reuses connections, so browser refresh sticks to one container
- **Production Reality:** Real users come from different IPs and connections, providing natural distribution
- **Scaling:** Easily increase or decrease replicas with a single command
- **Rolling Updates:** Zero-downtime deployments by updating replicas incrementally
- **Health Monitoring:** Swarm automatically restarts failed containers

---

## Quick Reference

```bash
# Initialize Swarm
docker swarm init

# Create service
docker service create --name <name> --replicas <count> -p <port:port> <image>

# List services
docker service ls

# View service replicas
docker service ps <service-name>

# Scale service
docker service scale <service-name>=<count>

# Update service
docker service update --image <new-image> <service-name>

# Remove service
docker service rm <service-name>

# Leave Swarm
docker swarm leave --force
```

---

## Next Lab

Proceed to **Lab 2: Health Checks and Resource Limits** to learn how to monitor service health and control resource usage.
