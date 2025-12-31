# Lab 6: Volume Mounts

Mount local files into containers for live development.

## Objective

Learn to mount host directories into containers so file changes sync instantly.

---

## Steps

### 1. Create a Website Directory

```bash
mkdir ~/my-website
cd ~/my-website
```

---

### 2. Create Custom HTML File

```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>My Docker Website</title>
    <style>
        body { font-family: Arial; margin: 50px; background: #f0f0f0; }
        h1 { color: #0066cc; }
        .container { background: white; padding: 30px; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello from Docker!</h1>
        <p>This is my custom HTML served by nginx.</p>
        <p>I can edit this file and see changes instantly!</p>
    </div>
</body>
</html>
EOF
```

**Verify:**
```bash
cat index.html
```

---

### 3. Stop and Remove Old Container

```bash
docker stop my-nginx
docker rm my-nginx
```

---

### 4. Run with Volume Mount

**Linux/Mac:**
```bash
docker run -d -p 8080:80 --name my-nginx \
  -v $(pwd):/usr/share/nginx/html \
  nginx
```

**Windows PowerShell:**
```bash
docker run -d -p 8080:80 --name my-nginx `
  -v ${PWD}:/usr/share/nginx/html `
  nginx
```

**Windows CMD:**
```bash
docker run -d -p 8080:80 --name my-nginx ^
  -v %cd%:/usr/share/nginx/html ^
  nginx
```

**What this does:**
- `-v` = Volume mount
- `$(pwd)` = Your current directory (`~/my-website`)
- `:/usr/share/nginx/html` = Where nginx looks for files
- Your local directory replaces nginx's default HTML directory

---

### 5. View Your Custom Page

Open browser:
```
http://localhost:8080
```

You should see your custom HTML with blue heading and white box!

---

### 6. Live Editing - The Magic

Keep your browser open. Edit index.html:

```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Updated Page</title>
</head>
<body>
    <h1>I JUST EDITED THIS!</h1>
    <p>And I didn't restart the container!</p>
</body>
</html>
EOF
```

**Refresh your browser** - Changes appear immediately!

No container restart needed. This is the power of volume mounts.

---

### 7. Verify Mount Inside Container

```bash
docker exec -it my-nginx bash
```

**Inside container:**
```bash
ls /usr/share/nginx/html
cat /usr/share/nginx/html/index.html
exit
```

You see YOUR file from your host machine!

---

### 8. Add More Files

```bash
cat > about.html << 'EOF'
<!DOCTYPE html>
<html>
<body>
    <h1>About Page</h1>
    <p>This is served from a Docker container!</p>
    <p><a href="index.html">Back to Home</a></p>
</body>
</html>
EOF
```

**Access immediately:**
```
http://localhost:8080/about.html
```

Works right away - no restart needed!

---

## Volume Mount Format

```
-v HOST_PATH:CONTAINER_PATH
```

**Examples:**
```bash
# Mount current directory
-v $(pwd):/usr/share/nginx/html

# Mount specific directory
-v /home/user/website:/usr/share/nginx/html

# Mount single file
-v $(pwd)/index.html:/usr/share/nginx/html/index.html

# Read-only mount
-v $(pwd):/usr/share/nginx/html:ro
```

---

## Key Takeaways

✅ Volume mounts sync files between host and container  
✅ Changes appear instantly (no restart needed)  
✅ Format: `-v HOST:CONTAINER`  
✅ Use `$(pwd)` for current directory  
✅ Perfect for development workflows  
✅ Changes sync both ways (host ↔ container)  

---

## Common Issues

**Path doesn't exist:**
```bash
# Create it first
mkdir -p ~/my-website
```

**Windows path issues:**
```bash
# Use forward slashes
-v C:/Users/name/website:/usr/share/nginx/html
```

**Changes don't show:**
```bash
# Hard refresh browser: Ctrl+Shift+R
# Or check mount with: docker inspect my-nginx
```

---

## Next Lab

[Lab 7: Multiple Containers](../lab7_multiple_containers/) - Run several containers at once.
