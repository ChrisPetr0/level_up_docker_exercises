# Lab 3: Complete Stack Deployment

## Objective

Deploy a multi-service application using Docker Stack with overlay networks, placement constraints, and the Swarm Visualizer to understand complete application orchestration.

---

## Steps

### 1. Initialize Swarm (if not already active)

```bash
docker swarm init
```

---

### 2. Build the API Image

Docker Stack doesn't support building images during deployment, so build first:

```bash
docker build -t myapp-api .
```

**Expected output:**
```
Successfully built abc123def456
Successfully tagged myapp-api:latest
```

**Note:** If you make changes to `api.py`, rebuild and force update:
```bash
docker build -t myapp-api .
docker service update --image myapp-api:latest myapp_api --force
```

---

### 3. Deploy the Stack

```bash
docker stack deploy -c stack.yml myapp
```

**Expected output:**
```
Creating network myapp_frontend
Creating network myapp_backend
Creating service myapp_web
Creating service myapp_api
Creating service myapp_redis
Creating service myapp_visualizer
```

---

### 4. Verify Deployment

List services in stack:
```bash
docker stack services myapp
```

**Expected output:**
```
ID             NAME                MODE         REPLICAS   IMAGE                             PORTS
abc123def456   myapp_api           replicated   2/2        myapp-api:latest                  *:8000->5000/tcp
def456ghi789   myapp_redis         replicated   1/1        redis:alpine
jkl012mno345   myapp_visualizer    replicated   1/1        dockersamples/visualizer:latest   *:8081->8080/tcp
pqr678stu901   myapp_web           replicated   3/3        nginx:alpine                      *:8080->80/tcp
```

View all tasks (containers):
```bash
docker stack ps myapp
```

---

### 5. Access the Swarm Visualizer

Open browser to: **http://localhost:8081**

**Expected view:**
- Visual representation of all services
- Container distribution across nodes
- Service health status
- Real-time updates as services scale or update

---

### 6. Test Services

Test web service:
```bash
curl http://localhost:8080
```

**Expected output:**
```html
<!DOCTYPE html>
<html>
<head><title>Welcome to nginx!</title></head>
...
```

Test API service (shows container info and visit counter):
```bash
curl http://localhost:8000
```

**Expected output:**
```json
{
  "message": "Hello from Swarm!",
  "container_id": "myapp_api.1.xyz789abc123",
  "hostname": "xyz789abc123",
  "visits": 1
}
```

Test health endpoint:
```bash
curl http://localhost:8000/health
```

**Expected output:**
```json
{
  "status": "healthy",
  "redis": "connected"
}
```

Test visit counter (refresh multiple times):
```bash
curl http://localhost:8000
curl http://localhost:8000
curl http://localhost:8000
```

**Expected behavior:** The `visits` count increments with each request, demonstrating Redis persistence across containers.

---

### 7. Scale a Service

Scale web service to 5 replicas:
```bash
docker service scale myapp_web=5
```

Refresh visualizer at **http://localhost:8081** to see changes in real-time.

Check specific service:
```bash
docker service ps myapp_web
```

---

### 8. View Network Details

List networks:
```bash
docker network ls | grep myapp
```

**Expected output:**
```
abc123def456   myapp_frontend   overlay   swarm
def456ghi789   myapp_backend    overlay   swarm
```

Inspect frontend network:
```bash
docker network inspect myapp_frontend
```

Inspect backend network:
```bash
docker network inspect myapp_backend
```

---

### 9. View Service Logs

```bash
docker service logs myapp_api
docker service logs myapp_visualizer
```

**Expected output from API:**
```
myapp_api.1@node1    | * Running on http://0.0.0.0:5000
myapp_api.2@node1    | * Running on http://0.0.0.0:5000
myapp_api.1@node1    | 10.0.0.2 - - [15/Jan/2024 10:30:00] "GET / HTTP/1.1" 200 -
```

---

### 10. Cleanup

```bash
docker stack rm myapp
docker swarm leave --force
```

---

## Architecture Overview

```
┌─────────────────┐
│   Visualizer    │ :8081 (manager only, Docker socket access)
└─────────────────┘

Frontend Network
├── Web (nginx)     :8080 → 3 replicas
└── API (python)    :8000 → 2 replicas ─┐
                                         │
Backend Network                          │
├── API (python)    :8000 → 2 replicas ◄─┘ (bridges both networks)
│   └─► Redis (visit counter storage)
└── Redis           → 1 replica (manager only)
```

**Data Flow:**
1. External requests → Web (nginx) or API (python)
2. API → Redis (over backend network for visit counter)
3. Web cannot access Redis (frontend network only)
4. Visualizer reads Docker socket to display cluster state

---

## Expected Outputs

### Stack Deployment
```
Creating network myapp_frontend
Creating network myapp_backend
Creating service myapp_web (3 replicas)
Creating service myapp_api (2 replicas)
Creating service myapp_redis (1 replica)
Creating service myapp_visualizer (1 replica)
```

### API Response
```json
{
  "message": "Hello from Swarm!",
  "container_id": "myapp_api.1.xyz789abc123",
  "hostname": "xyz789abc123",
  "visits": 5
}
```

### Visualizer
- Real-time visual display of all services
- Shows container distribution
- Updates automatically as services change

---

## Key Takeaways

- **Docker Stack:** Deploy multi-service applications from Compose files
- **Overlay Networks:** Enable service communication across cluster nodes
- **Network Isolation:** Web service cannot access Redis (frontend only), API bridges both networks
- **Service Discovery:** Services find each other by name (e.g., `redis://redis:6379`)
- **Placement Constraints:** Control which nodes run which services (manager vs. worker)
- **Stateful Services:** Redis maintains visit counter across API container restarts
- **Zero-Downtime Updates:** Update config enables rolling updates with no downtime
- **Health Checks:** Swarm monitors all services and auto-restarts failures
- **Visualizer:** Provides real-time cluster view for monitoring and troubleshooting
- **Load Balancing:** Ingress routing mesh distributes traffic across all replicas
- **Resource Management:** CPU/memory limits and reservations prevent resource contention

---

## Production Considerations

- **Build images before deployment:** Stack doesn't build images automatically
- **Image registry:** Use Docker Hub or private registry for multi-node deployments
- **Secrets management:** Use Docker secrets for sensitive data (not environment variables)
- **Volume drivers:** Use volume drivers for shared storage across nodes
- **Monitoring:** Integrate with Prometheus/Grafana for production monitoring
- **Logging:** Use centralized logging (ELK, Splunk) for multi-container logs
- **Backup:** Regularly backup Redis data and stack configuration files

---

## Quick Reference

```bash
# Deploy stack
docker stack deploy -c <compose-file> <stack-name>

# List stacks
docker stack ls

# List services in stack
docker stack services <stack-name>

# View all tasks
docker stack ps <stack-name>

# Remove stack
docker stack rm <stack-name>

# Scale service
docker service scale <service-name>=<count>

# Update service (force)
docker service update --image <image> <service-name> --force

# View logs
docker service logs <service-name>

# Inspect networks
docker network inspect <network-name>
```

---

## Congratulations!

You've completed Week 3 Session 6. You now understand Docker Swarm orchestration, including service deployment, scaling, health checks, and multi-service application stacks with overlay networks.

**Next Steps:** Proceed to Week 4 where you'll deploy Docker applications to AWS using both Docker Swarm and Amazon ECS.
