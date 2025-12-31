# Lab 3: Custom Network DNS Resolution

Prove that custom networks provide automatic DNS - containers find each other by name!

## Objective

Learn that custom networks enable DNS resolution, allowing containers to communicate by name instead of IP addresses.

---

## Steps

### 1. Create a Custom Network

```bash
docker network create app-network
```

**Verify it exists:**
```bash
docker network ls | grep app-network
```

---

### 2. Run Redis with a Specific Name

```bash
docker run -d --name redis --network app-network redis:alpine
```

**Key points:**
- `--name redis` - Container name (becomes DNS hostname)
- `--network app-network` - Connects to our custom network
- No `-p` flag - not published to host!

---

### 3. Test DNS Resolution with Ping

```bash
docker run --rm --network app-network alpine ping -c 3 redis
```

**Expected output:**
```
PING redis (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.123 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.089 ms
64 bytes from 172.18.0.2: seq=2 ttl=64 time=0.095 ms
```

**🎉 DNS works!** The hostname `redis` resolved to an IP address automatically.

---

### 4. Test from Container NOT on the Network

```bash
docker run --rm alpine ping -c 2 redis
```

**Expected output:**
```
ping: bad address 'redis'
```

**This proves network isolation!** Containers outside the network can't resolve or reach containers inside it.

---

### 5. Connect to Redis Using Hostname

```bash
docker run --rm --network app-network redis:alpine redis-cli -h redis ping
```

**Expected output:**
```
PONG
```

**What happened:**
- Created temporary container with redis-cli
- Connected to Redis using hostname `redis`
- Sent PING command
- Got PONG response

No IP addresses needed!

---

### 6. Inspect the Network

```bash
docker network inspect app-network
```

Look for the `Containers` section:

```json
"Containers": {
    "abc123...": {
        "Name": "redis",
        "IPv4Address": "172.18.0.2/16",
        ...
    }
}
```

**Better format:**
```bash
docker network inspect app-network --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'
```

**Expected output:**
```
redis: 172.18.0.2/16
```

---

### 7. Add Another Container

```bash
docker run -d --name webapp --network app-network nginx:alpine
```

**Verify both containers:**
```bash
docker network inspect app-network --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'
```

**Expected output:**
```
redis: 172.18.0.2/16
webapp: 172.18.0.3/16
```

**Test DNS between them:**
```bash
docker exec webapp ping -c 2 redis
docker exec redis ping -c 2 webapp
```

Both work! They can find each other by name.

---

## How DNS Works in Custom Networks

**Custom network (like app-network):**
- ✅ Automatic DNS resolution
- ✅ Use container names as hostnames
- ✅ Network isolation

**Default bridge network:**
- ❌ No DNS resolution
- ❌ Must use IP addresses or `--link` (deprecated)
- ❌ Not recommended

**Always use custom networks for multi-container apps!**

---

## Production Pattern

```bash
# Create network
docker network create prod-network

# Database (internal only, no -p flag)
docker run -d --name postgres \
  --network prod-network \
  postgres:15

# API (internal only, connects to 'postgres' by name)
docker run -d --name api \
  --network prod-network \
  -e DB_HOST=postgres \
  my-api

# Frontend (externally accessible)
docker run -d --name frontend \
  --network prod-network \
  -p 80:80 \
  -e API_HOST=api \
  my-frontend
```

**Security:**
- Only frontend is published with `-p`
- Database and API are internal
- Containers communicate by name
- Network isolation protects internal services

---

## Key Takeaways

✅ Custom networks provide automatic DNS  
✅ Use container names as hostnames  
✅ Network isolation for security  
✅ No port publishing needed for internal communication  
✅ Always use custom networks (not default bridge)  
✅ Containers can join multiple networks  

---

## Network Types

**Bridge (custom):**
- User-created networks
- DNS resolution
- Network isolation
- **Use this for apps**

**Bridge (default):**
- Docker's default network
- No DNS
- Legacy, avoid

**Host:**
- Container uses host's network
- No isolation
- Special use cases only

**None:**
- No networking
- Completely isolated

---

## Cleanup

```bash
docker stop redis webapp
docker rm redis webapp
docker network rm app-network
```

---

## Quick Reference

```bash
# Create network
docker network create mynet

# Run container on network
docker run -d --name app --network mynet image

# Connect existing container
docker network connect mynet container-name

# Disconnect container
docker network disconnect mynet container-name

# Inspect network
docker network inspect mynet

# List networks
docker network ls

# Remove network
docker network rm mynet
```

---

## Next Lab

[Lab 4: Multi-Container App](../lab4_multi_container_app/) - Build a real webapp that uses Redis via DNS.
