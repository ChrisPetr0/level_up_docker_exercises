# Lab 4: Execute Commands in Containers

Run commands inside a running container.

## Objective

Learn to use `docker exec` to execute commands and get a shell inside containers.

---

## Steps

### 1. Execute a Single Command

Run a command inside the container:

```bash
docker exec my-nginx ls /usr/share/nginx/html
```

**Expected output:**
```
50x.html
index.html
```

These are the HTML files nginx serves.

---

### 2. Get an Interactive Shell

Open a bash shell inside the container:

```bash
docker exec -it my-nginx bash
```

**Expected output:**
```
root@a8f3d9e2c1b4:/#
```

You're now "inside" the container!
- `-i` = Interactive (keep STDIN open)
- `-t` = TTY (allocate a terminal)

---

### 3. Explore Inside the Container

From inside the container shell, try these:

**Check current directory:**
```bash
pwd
```
Output: `/`

**See running processes:**
```bash
ps aux
```

**Check OS version:**
```bash
cat /etc/os-release
```

**View nginx config:**
```bash
cat /etc/nginx/nginx.conf
```

**Exit the container shell:**
```bash
exit
```

You're back on your host machine.

---

### 4. View Nginx HTML Files

```bash
docker exec my-nginx cat /usr/share/nginx/html/index.html
```

You'll see the HTML of the default nginx welcome page.

---

### 5. Run Commands as Different User

nginx worker processes run as the `nginx` user:

```bash
docker exec -u nginx my-nginx whoami
```

**Expected output:**
```
nginx
```

---

### 6. Execute Multiple Commands

Use bash -c to run multiple commands:

```bash
docker exec my-nginx bash -c "cd /usr/share/nginx/html && ls -la"
```

---

## Common Use Cases

**Check if a file exists:**
```bash
docker exec my-nginx ls /etc/nginx/conf.d/default.conf
```

**Test network connectivity:**
```bash
docker exec my-nginx ping -c 3 google.com
```

**Check environment variables:**
```bash
docker exec my-nginx env
```

**Find nginx version:**
```bash
docker exec my-nginx nginx -v
```

---

## docker exec vs docker run

**docker exec:**
- Runs commands in **existing** running container
- Container must already be running
- Use for debugging, maintenance, inspection

**docker run:**
- Creates a **new** container
- Starts the container
- Use to start applications

---

## Key Takeaways

✅ `docker exec <name> <command>` runs commands in running containers  
✅ `-it` gives you an interactive shell  
✅ `-u` specifies which user to run as  
✅ Great for debugging and exploring containers  
✅ Container must be running (not stopped)  

---

## Troubleshooting

**Error: container is not running**
```bash
docker start my-nginx
# Then try docker exec again
```

**bash not found?**
```bash
# Some images use sh instead
docker exec -it my-nginx sh
```

---

## Next Lab

[Lab 5: Container Lifecycle](../lab5_container_lifecycle/) - Stop, start, and restart containers.
