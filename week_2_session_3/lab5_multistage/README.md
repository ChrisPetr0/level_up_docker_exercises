# Lab 5: Multi-Stage Builds

Learn advanced optimization using multi-stage builds to create dramatically smaller production images.

## Objective

Separate build and runtime environments to reduce final image size by 90%+ for compiled languages.

---

## What Are Multi-Stage Builds?

**The Problem:**

Traditional Dockerfile includes everything needed to build AND run:

```dockerfile
FROM golang:1.21           # 800MB (includes compiler)
COPY . .
RUN go build -o app
CMD ["./app"]              # Final image: 800MB
```

**Final image includes:**
- ✓ Compiled binary (10MB) - needed
- ✗ Go compiler (300MB) - NOT needed
- ✗ Build tools (100MB) - NOT needed
- ✗ Source code (10MB) - NOT needed

---

**The Solution:**

Multi-stage build separates concerns:

```dockerfile
# Stage 1: Build
FROM golang:1.21 AS builder
COPY . .
RUN go build -o app

# Stage 2: Runtime
FROM alpine:3.18
COPY --from=builder /app/app .
CMD ["./app"]              # Final image: 15MB
```

**Final image includes:**
- ✓ Compiled binary (10MB) - needed
- ✓ Alpine base (5MB) - needed
- ✗ Everything else - LEFT BEHIND

**Result: 800MB → 15MB (98% smaller!)**

---

## Lab Files

This lab includes pre-made files demonstrating multi-stage builds:

- `main.go` - Simple Go web server
- `Dockerfile.single` - Single-stage build (includes everything)
- `Dockerfile.multistage` - Multi-stage build (optimized)

---

## Steps

### 1. Navigate to Lab Directory

```bash
cd ~/level_up_curriculum/labs/student_materials/week_2_session_3/lab5_multistage
ls -la  # Verify all files are present
```

---

### 2. Review Single-Stage Dockerfile

View `Dockerfile.single`:
```bash
cat Dockerfile.single
```

Notice it includes the full Go build environment in the final image.

**Build and check size:**
```bash
docker build -f Dockerfile.single -t goapp:single .
docker images | grep goapp
```

**Expected size:** ~300-400MB

---

### 3. Review Multi-Stage Dockerfile

View `Dockerfile.multistage`:
```bash
cat Dockerfile.multistage
```

Notice how it separates the build stage from the runtime stage!

**Build and compare:**
```bash
docker build -f Dockerfile.multistage -t goapp:multistage .
docker images | grep goapp
```

**Expected output:**
```
goapp  single      350MB
goapp  multistage   12MB
```

**Reduction: 97% smaller!**

---

### 4. Test Both Versions

```bash
# Single-stage
docker run -d -p 8080:8080 --name go-single goapp:single

# Multi-stage
docker run -d -p 8081:8080 --name go-multi goapp:multistage
```

**Test both:**
```bash
curl http://localhost:8080    # Single-stage works
curl http://localhost:8081    # Multi-stage works
```

Both function identically, but multi-stage is 30x smaller!

---

### 5. Inspect What's Inside

**Single-stage (includes everything):**
```bash
docker exec go-single ls /usr/local/go
# Output: Full Go installation
```

**Multi-stage (binary only):**
```bash
docker exec go-multi ls /usr/local/go
# Output: No such file (Go was left in build stage!)
```

---

## Node.js Multi-Stage Example

Multi-stage isn't just for compiled languages. Use it to separate build and runtime for Node.js:

Create `Dockerfile.multistage.node`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine
ENV NODE_ENV=production
RUN addgroup -g 1001 nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 3000
CMD ["node", "app.js"]
```

**Benefits:**
- Separate build and runtime dependencies
- Cleaner final image
- Better caching

---

## Understanding the Syntax

### AS keyword - Name the stage

```dockerfile
FROM golang:1.21 AS builder
#                    ^^^^^^ Stage name
```

### COPY --from - Copy from previous stage

```dockerfile
COPY --from=builder /app/server .
#            ^^^^^^^ Stage name
#                    ^^^^^^^^^^^ Source path in build stage
#                                ^ Destination in current stage
```

### Can have multiple stages

```dockerfile
# Stage 1: Dependencies
FROM node:18 AS deps
RUN npm install

# Stage 2: Build
FROM node:18 AS builder
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Stage 3: Runtime
FROM node:18-alpine
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
```

---

## When to Use Multi-Stage Builds

**Perfect for:**
- Compiled languages (Go, Rust, C++)
- Frontend builds (React, Vue, Angular)
- Apps with build steps
- When build tools are large

**Example use cases:**

**Go applications:**
- Build stage: golang:1.21 (800MB)
- Runtime stage: alpine (5MB)
- Result: 15MB vs 800MB

**React applications:**
- Build stage: node:18 (compile to static files)
- Runtime stage: nginx:alpine (serve static files)
- Result: 25MB vs 1GB

**Python with compiled deps:**
- Build stage: python:3.11 (compile wheels)
- Runtime stage: python:3.11-slim (just runtime)
- Result: 150MB vs 900MB

---

## Key Takeaways

✅ Multi-stage builds separate build and runtime  
✅ Final image only contains what's needed to run  
✅ Can reduce size by 90%+ for compiled languages  
✅ Use `AS` to name stages  
✅ Use `COPY --from=stage` to copy between stages  
✅ Each FROM starts a new stage  
✅ Only the last stage becomes the final image  

---

## Best Practices

**1. Name your stages:**
```dockerfile
FROM golang:1.21 AS builder  # Not just "FROM golang:1.21"
```

**2. Use minimal runtime images:**
```dockerfile
FROM alpine:3.18        # Not "FROM ubuntu"
FROM node:18-alpine    # Not "FROM node:18"
```

**3. Order stages properly:**
- Dependencies first
- Build second
- Runtime last

**4. Copy only what's needed:**
```dockerfile
COPY --from=builder /app/binary .    # Just the binary
# Not: COPY --from=builder /app .    # Everything
```

---

## Cleanup

```bash
docker stop go-single go-multi
docker rm go-single go-multi
```

---

## Congratulations!

You've completed Week 2 Session 3! You now know:

✅ How to write Dockerfiles  
✅ How layer caching works  
✅ How to choose base images  
✅ Production optimization techniques  
✅ Multi-stage builds for dramatic size reduction  

**Next:** Week 2 Session 4 - Data Persistence and Networking
