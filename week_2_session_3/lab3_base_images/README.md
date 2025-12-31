# Lab 3: Base Images

Compare Alpine, Slim, and Full base images to understand size vs functionality trade-offs.

## Objective

Build the same app with three different base images and compare sizes, compatibility, and use cases.

---

## The Three Base Image Types

| Type | Size | Base OS | Best For |
|------|------|---------|----------|
| **Alpine** | ~143MB | Alpine Linux | Production, size matters |
| **Slim** | ~189MB | Debian minimal | Most apps, balanced |
| **Full** | ~945MB | Debian full | Development, complex builds |

---

## Lab Files

This lab includes pre-made files for comparing base images:

- `app.js` - Simple Express application
- `package.json` - Node.js dependencies
- `Dockerfile.alpine` - Using Alpine base image
- `Dockerfile.slim` - Using Slim base image
- `Dockerfile.full` - Using Full base image

---

## Steps

### 1. Navigate to Lab Directory

```bash
cd ~/level_up_curriculum/labs/student_materials/week_2_session_3/lab3_base_images
ls -la  # Verify all files are present
```

---

### 2. Review the Three Dockerfiles

View each Dockerfile to see they're identical except for the FROM line:

```bash
cat Dockerfile.alpine
cat Dockerfile.slim
cat Dockerfile.full
```

**Note:** The Dockerfiles are identical except for the base image!

---

### 3. Build All Three Versions

```bash
docker build -f Dockerfile.alpine -t myapp:alpine .
docker build -f Dockerfile.slim -t myapp:slim .
docker build -f Dockerfile.full -t myapp:full .
```

---

### 4. Compare Sizes

```bash
docker images | grep myapp
```

**Expected output:**
```
REPOSITORY   TAG      IMAGE ID       CREATED          SIZE
myapp        full     a1b2c3d4e5f6   2 minutes ago    945MB
myapp        slim     b2c3d4e5f6a7   3 minutes ago    189MB
myapp        alpine   c3d4e5f6a7b8   4 minutes ago    143MB
```

**Size comparison:**
- Alpine: 143MB (baseline)
- Slim: 189MB (+32% larger)
- Full: 945MB (+561% larger, 6.6x bigger!)

---

### 5. Test All Three Work

```bash
# Run all three on different ports
docker run -d -p 3001:3000 --name app-alpine myapp:alpine
docker run -d -p 3002:3000 --name app-slim myapp:slim
docker run -d -p 3003:3000 --name app-full myapp:full
```

**Test each:**
```bash
curl http://localhost:3001    # Alpine works
curl http://localhost:3002    # Slim works
curl http://localhost:3003    # Full works
```

For this simple app, all three function identically!

---

### 6. Explore What's Inside

**Alpine - Minimal:**
```bash
docker exec app-alpine sh -c "which bash"     # Not found (uses sh)
docker exec app-alpine sh -c "which gcc"      # Not found
docker exec app-alpine sh -c "apk --version"  # Alpine package manager
```

**Slim - Balanced:**
```bash
docker exec app-slim bash -c "which bash"    # Found
docker exec app-slim bash -c "which gcc"     # Not found
docker exec app-slim bash -c "apt --version" # Debian package manager
```

**Full - Everything:**
```bash
docker exec app-full bash -c "which bash"    # Found
docker exec app-full bash -c "which gcc"     # Found!
docker exec app-full bash -c "which python3" # Found!
```

---

## Detailed Comparison

### Alpine (node:18-alpine)

**Pros:**
- Smallest size (~143MB)
- Fast downloads and deploys
- Security-focused (minimal attack surface)
- Perfect for production

**Cons:**
- Uses musl libc (not glibc)
- Some npm packages with native code may fail
- Uses `sh` not `bash`
- Smaller community support

**Best for:**
- Simple Node.js apps
- Production deployments
- Microservices
- When size matters

---

### Slim (node:18-slim)

**Pros:**
- Good size (~189MB)
- Standard glibc (better compatibility)
- Has bash
- Good for most apps

**Cons:**
- Larger than Alpine
- Doesn't include build tools
- May need to install extras

**Best for:**
- Most Node.js applications
- When you want balance
- Apps with native dependencies
- General purpose

---

### Full (node:18)

**Pros:**
- Everything included
- Build tools (gcc, g++, make)
- Python for node-gyp
- Best compatibility

**Cons:**
- Very large (~945MB)
- Slower downloads
- Unnecessary tools in production
- Larger attack surface

**Best for:**
- Development environments
- Complex native builds
- Debugging
- When size doesn't matter

---

## When to Use Each

**Production:**
- Try Alpine first
- Fall back to Slim if issues
- Avoid Full

**Development:**
- Use Full or Slim
- More tools available
- Easier debugging

**CI/CD:**
- Alpine for faster pipelines
- Slim if Alpine has issues

---

## Key Takeaways

✅ Alpine = Smallest, production-ready  
✅ Slim = Balanced, good compatibility  
✅ Full = Largest, development/debugging  
✅ Try Alpine first, fall back to Slim if needed  
✅ For simple apps, all three work identically  
✅ Size difference: 6x between Alpine and Full  

---

## Common Issues

**Alpine compatibility problems:**
```dockerfile
# If native deps fail on Alpine, switch to Slim
FROM node:18-slim
```

**Need build tools temporarily:**
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache python3 make g++
RUN npm install
RUN apk del python3 make g++  # Remove after install
```

**Best of both worlds:**
```dockerfile
# Multi-stage: Build with Full, run with Alpine
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["npm", "start"]
```

---

## Cleanup

```bash
docker stop app-alpine app-slim app-full
docker rm app-alpine app-slim app-full
```

---

## Next Lab

[Lab 4: Optimization](../lab4_optimization/) - Production best practices and security hardening.
