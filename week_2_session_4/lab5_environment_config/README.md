# Lab 5: Environment Variables for Configuration

Use environment variables to run the same image in different modes without rebuilding.

## Objective

Demonstrate the 12-Factor App principle: same image, different configurations for dev/staging/production.

---

## Files Provided

In this lab directory:
- `app.js` - Node.js app that changes behavior based on `NODE_ENV`
- `package.json` - Dependencies
- `Dockerfile` - Builds the image

---

## Steps

### 1. Review the Application Code

**Look at `app.js`:**
```javascript
const APP_NAME = process.env.APP_NAME || 'My App';
const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'development') {
    // Blue background, verbose logging
} else if (NODE_ENV === 'production') {
    // Purple background, minimal logging
}
```

**Key point:** Same code, different behavior based on environment variables.

---

### 2. Build the Image

```bash
docker build -t config-demo .
```

**This is the ONLY build** - we'll use this same image for dev and prod!

---

### 3. Create Network and Redis

```bash
docker network create config-net
docker run -d --name redis --network config-net redis:alpine
```

---

### 4. Run in DEVELOPMENT Mode

```bash
docker run -d --name app-dev \
  --network config-net \
  -p 3001:3000 \
  -e NODE_ENV=development \
  -e APP_NAME="Dev Environment" \
  -e REDIS_HOST=redis \
  config-demo
```

**Test it:**
```
http://localhost:3001
```

**Expected:**
- Blue gradient background
- Title: "Dev Environment"
- Detailed logging in `docker logs app-dev`

---

### 5. Run in PRODUCTION Mode

```bash
docker run -d --name app-prod \
  --network config-net \
  -p 3002:3000 \
  -e NODE_ENV=production \
  -e APP_NAME="Prod Environment" \
  -e REDIS_HOST=redis \
  config-demo
```

**Test it:**
```
http://localhost:3002
```

**Expected:**
- Purple gradient background
- Title: "Prod Environment"
- Minimal logging in `docker logs app-prod`

---

### 6. Compare the Two Environments

**Development (localhost:3001):**
```bash
curl http://localhost:3001
docker logs app-dev
```

**Production (localhost:3002):**
```bash
curl http://localhost:3002
docker logs app-prod
```

**Same Docker image, different configurations!**

---

### 7. Verify Same Image

```bash
docker ps --format "table {{.Names}}\t{{.Image}}"
```

**Expected output:**
```
NAMES      IMAGE
app-prod   config-demo
app-dev    config-demo
redis      redis:alpine
```

Both use `config-demo` - the exact same image!

---

### 8. Check Environment Variables

```bash
docker exec app-dev env | grep NODE_ENV
docker exec app-prod env | grep NODE_ENV
```

**Expected output:**
```
NODE_ENV=development
NODE_ENV=production
```

---

## The 12-Factor App Pattern

**Traditional approach (wrong):**
```bash
docker build -t myapp:dev -f Dockerfile.dev .    # Dev build
docker build -t myapp:prod -f Dockerfile.prod .  # Prod build
```

**Problems:**
- Two images to maintain
- Differences can cause bugs
- Rebuild needed for config changes

**12-Factor approach (right):**
```bash
docker build -t myapp:v1 .                       # Single build

docker run -e NODE_ENV=development myapp:v1      # Dev config
docker run -e NODE_ENV=staging myapp:v1          # Staging config
docker run -e NODE_ENV=production myapp:v1       # Prod config
```

**Benefits:**
- One image for all environments
- Test the exact image you'll deploy
- Change configs without rebuilding
- Faster deployments

---

## Common Environment Variables

**Application settings:**
```bash
-e NODE_ENV=production
-e APP_NAME="My App"
-e LOG_LEVEL=info
-e PORT=3000
```

**Database connections:**
```bash
-e DB_HOST=postgres
-e DB_PORT=5432
-e DB_NAME=mydb
-e DB_USER=admin
-e DB_PASSWORD=secret123  # Use secrets in production!
```

**Feature flags:**
```bash
-e ENABLE_FEATURE_X=true
-e ENABLE_DEBUG=false
```

**API keys and secrets:**
```bash
-e API_KEY=xyz123
-e JWT_SECRET=secret456
```

---

## Environment Variables in Dockerfile

**Set defaults in Dockerfile:**
```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info
```

**Override at runtime:**
```bash
docker run -e NODE_ENV=development -e LOG_LEVEL=debug myapp
```

Runtime values override Dockerfile defaults.

---

## Key Takeaways

✅ Same image for dev/staging/production  
✅ Environment variables configure behavior  
✅ No rebuild needed for config changes  
✅ Test exactly what you'll deploy  
✅ 12-Factor App methodology  
✅ Use `-e` flag to set variables  
✅ Dockerfile sets defaults, runtime overrides  

---

## Security Best Practice

**Don't hardcode secrets in Dockerfile:**
```dockerfile
# BAD - visible in image!
ENV DB_PASSWORD=secret123
```

**Pass secrets at runtime:**
```bash
# Better
docker run -e DB_PASSWORD=secret123 myapp

# Best - use Docker secrets (Swarm) or secrets manager
docker secret create db_password password.txt
docker service create --secret db_password myapp
```

---

## Cleanup

```bash
docker stop app-dev app-prod redis
docker rm app-dev app-prod redis
docker network rm config-net
docker rmi config-demo
```

---

## Quick Reference

```bash
# Set single variable
docker run -e KEY=value image

# Set multiple variables
docker run -e KEY1=val1 -e KEY2=val2 image

# Load from file
docker run --env-file .env image

# Check variables in container
docker exec container env

# Override Dockerfile ENV
docker run -e NODE_ENV=dev image  # Overrides Dockerfile ENV
```

---

## Next Lab

[Lab 6: Backup & Restore](../lab6_backup_restore/) - Learn to backup and restore volume data.
