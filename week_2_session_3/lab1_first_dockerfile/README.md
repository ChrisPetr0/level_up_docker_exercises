# Lab 1: First Dockerfile

Build your first custom Docker image for a Node.js application.

## Objective

Learn to write a Dockerfile, build an image, and run a container from your custom image.

---

## Lab Files

This lab includes pre-made application files so you can focus on learning Docker, not Node.js syntax:

- `app.js` - Simple Express web server
- `package.json` - Node.js dependencies

**Review the files:**
```bash
cat app.js
cat package.json
```

**Important note in app.js:** The server binds to `0.0.0.0` (not `localhost`) - this is required for container networking to work properly.

---

## Steps

### 1. Verify You're in the Lab Directory

```bash
cd ~/level_up_curriculum/labs/student_materials/week_2_session_3/lab1_first_dockerfile
pwd  # Verify you're in the right place
ls -la  # Should see: app.js, package.json
```

---

### 2. Create Dockerfile

Create a file named `Dockerfile` (no extension):

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY app.js .
EXPOSE 3000
CMD ["npm", "start"]
```

**What each line does:**
- `FROM` - Start from Node.js 18 Alpine image
- `WORKDIR` - Set working directory to /app
- `COPY package.json` - Copy dependencies file
- `RUN npm install` - Install dependencies
- `COPY app.js` - Copy application code
- `EXPOSE 3000` - Document that app uses port 3000
- `CMD` - Command to run when container starts

---

### 3. Build the Image

```bash
docker build -t my-node-app:v1 .
```

**What this does:**
- `docker build` - Build an image
- `-t my-node-app:v1` - Tag it as "my-node-app" version "v1"
- `.` - Use current directory as build context

**Expected output:**
```
[+] Building 45.3s (10/10) FINISHED
 => [1/6] FROM docker.io/library/node:18-alpine
 => [2/6] WORKDIR /app
 => [3/6] COPY package.json .
 => [4/6] RUN npm install
 => [5/6] COPY app.js .
 => [6/6] exporting to image
```

First build takes 30-60 seconds (downloads packages).

---

### 4. Verify Image Exists

```bash
docker images | grep my-node-app
```

**Expected output:**
```
my-node-app   v1    a1b2c3d4e5f6   1 minute ago   150MB
```

---

### 5. Run Container from Your Image

```bash
docker run -d -p 3000:3000 --name my-app my-node-app:v1
```

**Verify it's running:**
```bash
docker ps | grep my-app
```

---

### 6. Test the Application

**Browser:**
```
http://localhost:3000
```

You should see: "Hello from Docker!"

**Health check:**
```
http://localhost:3000/health
```

**Command line:**
```bash
curl http://localhost:3000
curl http://localhost:3000/health
```

---

### 7. View Container Logs

```bash
docker logs my-app
```

**Expected output:**
```
> my-node-app@1.0.0 start
> node app.js

Server running on port 3000
```

---

### 8. Make a Change and Rebuild

Edit `app.js` - change the message:
```javascript
res.send('<h1>Hello from Docker v2!</h1><p>I rebuilt the image!</p>');
```

**Rebuild:**
```bash
docker build -t my-node-app:v2 .
```

Notice it's faster! Docker cached the `npm install` layer.

**Run new version:**
```bash
docker stop my-app
docker rm my-app
docker run -d -p 3000:3000 --name my-app my-node-app:v2
```

Refresh browser - see the new message!

---

## Understanding the Build Process

**Build Context:**
- Docker sends all files in current directory to daemon
- Use `.dockerignore` to exclude files

**Layers:**
- Each instruction creates a layer
- Layers are cached
- If nothing changed, Docker reuses cached layer

**Image vs Container:**
- Image = Blueprint (immutable)
- Container = Running instance (from image)

---

## Key Takeaways

✅ Dockerfile defines how to build an image  
✅ Each instruction creates a layer  
✅ `docker build -t name:tag .` builds the image  
✅ Order matters for caching  
✅ Copy dependencies before code for better caching  
✅ Images are immutable - rebuild to make changes  

---

## Common Issues

**Build context too large:**
```bash
# Create .dockerignore
echo "node_modules" > .dockerignore
echo ".git" >> .dockerignore
```

**Port already in use:**
```bash
# Use different port
docker run -d -p 3001:3000 --name my-app my-node-app:v1
```

**Can't find file:**
```bash
# Check you're in the right directory
pwd
ls -la
```

---

## Quick Reference

```bash
# Build image
docker build -t name:tag .

# Build without cache
docker build --no-cache -t name:tag .

# List images
docker images

# Remove image
docker rmi name:tag

# View build history
docker history name:tag
```

---

## Next Lab

[Lab 2: Layer Caching](../lab2_layer_caching/) - Optimize builds with proper instruction order.
