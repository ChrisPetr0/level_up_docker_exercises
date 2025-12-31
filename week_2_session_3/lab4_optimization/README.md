# Lab 4: Dockerfile Optimization

Learn production best practices including security hardening, size optimization, and proper dependency management.

## Objective

Transform a basic Dockerfile into a production-grade image with security and optimization techniques.

---

## Lab Files

This lab includes pre-made files demonstrating optimization techniques:

- `app.js` - Express application with environment config
- `package.json` - Dependencies (including dev dependencies)
- `.dockerignore` - Files to exclude from build context
- `Dockerfile.unoptimized` - Basic Dockerfile with issues
- `Dockerfile.optimized` - Production-grade optimized Dockerfile

---

## Steps

### 1. Navigate to Lab Directory

```bash
cd ~/level_up_curriculum/labs/student_materials/week_2_session_3/lab4_optimization
ls -la  # Verify all files are present
```

---

### 2. Review Unoptimized Dockerfile

View `Dockerfile.unoptimized`:
```bash
cat Dockerfile.unoptimized
```

**Problems:**
- ❌ Copies everything (including unnecessary files)
- ❌ Installs dev dependencies
- ❌ Doesn't clean npm cache
- ❌ Runs as root user
- ❌ No NODE_ENV set

**Build and check:**
```bash
docker build -f Dockerfile.unoptimized -t myapp:unoptimized .
docker images | grep myapp
```

---

### 3. Review .dockerignore

View `.dockerignore`:
```bash
cat .dockerignore
```

**Benefit:** Reduces build context, faster builds, prevents copying unnecessary files

---

### 4. Review Optimized Dockerfile

View `Dockerfile.optimized`:
```bash
cat Dockerfile.optimized
```

Notice all the production best practices included!

---

### 5. Build and Compare

```bash
docker build -f Dockerfile.optimized -t myapp:optimized .
docker images | grep myapp
```

**Compare sizes:**
```
myapp  unoptimized  180MB
myapp  optimized    145MB
```

**Savings:** ~20-25% smaller

---

### 6. Test Optimized Version

```bash
docker run -d -p 3000:3000 --name myapp-opt myapp:optimized
curl http://localhost:3000
```

**Check it's running as non-root:**
```bash
docker exec myapp-opt whoami
# Output: nodejs (not root!)
```

---

## Key Optimizations Explained

### 1. Use npm ci Instead of npm install

**npm install:**
- Reads package.json and package-lock.json
- Updates lock file if needed
- Slower

**npm ci (clean install):**
- Requires package-lock.json
- Installs exact versions
- Faster and more reliable
- Perfect for production builds

```dockerfile
RUN npm ci --only=production
```

---

### 2. Production Dependencies Only

**Development dependencies include:**
- Testing frameworks (jest, mocha)
- Dev tools (nodemon, webpack-dev-server)
- Linters (eslint)
- Not needed in production!

```dockerfile
RUN npm ci --only=production
```

**Savings:** 30-50% fewer packages

---

### 3. Clean npm Cache

npm caches downloaded packages. Clean it to reduce image size:

```dockerfile
RUN npm ci --only=production && \
    npm cache clean --force
```

**Note:** Use `&&` to combine commands in one RUN layer.

---

### 4. Non-Root User (Security)

**Problem:** Running as root is a security risk.

**Solution:** Create and use a non-root user.

```dockerfile
# Create user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set ownership
COPY --chown=nodejs:nodejs app.js .

# Switch to user
USER nodejs
```

**Security benefit:** If container is compromised, attacker has limited privileges.

---

### 5. Set NODE_ENV=production

```dockerfile
ENV NODE_ENV=production
```

**Benefits:**
- Express runs in production mode (faster)
- Disables debugging features
- Better error handling
- npm installs only production deps

---

### 6. Use .dockerignore

Exclude unnecessary files from build context:

```
node_modules
.git
*.md
.env
```

**Benefits:**
- Faster builds
- Smaller context
- Won't copy secrets accidentally

---

## Production Dockerfile Template

```dockerfile
FROM node:18-alpine

# Production environment
ENV NODE_ENV=production

# Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Application code
COPY --chown=nodejs:nodejs . .

# Switch to non-root
USER nodejs

EXPOSE 3000

# Use node directly (not npm)
CMD ["node", "app.js"]
```

---

## Key Takeaways

✅ Use `npm ci --only=production` for production builds  
✅ Clean npm cache to reduce size  
✅ Run as non-root user for security  
✅ Set `NODE_ENV=production`  
✅ Use `.dockerignore` to exclude unnecessary files  
✅ Use `node` directly instead of `npm start`  
✅ Combine commands with `&&` to reduce layers  

---

## Additional Optimizations

**Use node directly instead of npm:**
```dockerfile
# Instead of:
CMD ["npm", "start"]

# Use:
CMD ["node", "app.js"]
```

**Reason:** Avoids npm overhead, better signal handling.

**Health check:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"
```

---

## Cleanup

```bash
docker stop myapp-opt
docker rm myapp-opt
```

---

## Next Lab

[Lab 5: Multi-Stage Builds](../lab5_multistage/) - Advanced optimization for dramatically smaller images.
