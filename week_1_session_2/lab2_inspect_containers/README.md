# Lab 2: Inspect Containers

View detailed container configuration and settings.

## Objective

Learn to use `docker inspect` to view container details like IP addresses, port mappings, and environment variables.

---

## Steps

### 1. Basic Inspect

View complete container configuration:

```bash
docker inspect my-nginx
```

**Expected output:**
```json
[
    {
        "Id": "a8f3d9e2c1b4...",
        "Created": "2024-11-13T10:30:00.000000000Z",
        "State": {
            "Status": "running",
            "Running": true,
            ...
        },
        "NetworkSettings": {
            "IPAddress": "172.17.0.2",
            "Ports": {
                "80/tcp": [
                    {
                        "HostIp": "0.0.0.0",
                        "HostPort": "8080"
                    }
                ]
            }
        },
        ...
    }
]
```

You'll see hundreds of lines of JSON with all container details.

---

### 2. Get Specific Information

Extract just the IP address:

```bash
docker inspect -f '{{.NetworkSettings.IPAddress}}' my-nginx
```

**Expected output:**
```
172.17.0.2
```

---

### 3. Get Port Mappings

```bash
docker inspect -f '{{.NetworkSettings.Ports}}' my-nginx
```

**Expected output:**
```
map[80/tcp:[{0.0.0.0 8080}]]
```

Shows port 80 in container maps to port 8080 on host.

---

### 4. Get Container State

```bash
docker inspect -f '{{.State.Status}}' my-nginx
```

**Expected output:**
```
running
```

---

### 5. Multiple Containers

You can inspect multiple at once:

```bash
docker inspect my-nginx my-nginx2 my-nginx3
```

---

## Useful Format Templates

**Get container name and IP:**
```bash
docker inspect -f '{{.Name}} - {{.NetworkSettings.IPAddress}}' my-nginx
```

**Get status and restart count:**
```bash
docker inspect -f 'Status: {{.State.Status}} | Restarts: {{.RestartCount}}' my-nginx
```

**Get image name:**
```bash
docker inspect -f '{{.Config.Image}}' my-nginx
```

---

## Key Takeaways

✅ `docker inspect` shows complete container configuration  
✅ Use `-f` flag to extract specific fields  
✅ Format: `{{.Path.To.Field}}`  
✅ Useful for debugging network and configuration issues  

---

## Common Fields

- `.State.Status` - running, exited, paused
- `.NetworkSettings.IPAddress` - Container IP
- `.NetworkSettings.Ports` - Port mappings
- `.Config.Env` - Environment variables
- `.Mounts` - Volume mounts
- `.RestartCount` - How many times restarted

---

## Next Lab

[Lab 3: Container Logs](../lab3_container_logs/) - View container output and debug issues.
