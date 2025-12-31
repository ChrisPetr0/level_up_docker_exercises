# Lab 2: Layer Caching

Understand Docker's layer caching and optimize build times.

## Objective

See how instruction order affects build speed. Learn to optimize Dockerfiles for fast rebuilds.

---

## The Problem

Poor Dockerfile order causes `npm install` to re-run on every code change, wasting minutes per build.

**Bad Order:**
```dockerfile
COPY . .           # Copy everything (code + package.json)
RUN npm install    # Re-runs when any file changes!
```

**Good Order:**
```dockerfile
COPY package.json .   # Copy dependencies first
RUN npm install       # Only re-runs when dependencies change
COPY app.js .        # Copy code last
```

**Result:** Rebuilds go from 60 seconds to 5 seconds!

---

## Lab Files

This lab includes pre-made files demonstrating bad vs. good layer caching:

- `app.js` - Simple Express application
- `package.json` - Node.js dependencies
- `Dockerfile.bad` - Inefficient layer order
- `Dockerfile.good` - Optimized layer order

---

## Steps

### 1. Navigate to Lab Directory

```bash
cd ~/level_up_curriculum/labs/student_materials/week_2_session_3/lab2_layer_caching
ls -la  # Verify files are present
```

---

### 2. Review Bad Dockerfile

View `Dockerfile.bad`:
```bash
cat Dockerfile.bad
```

Notice the inefficient order - it copies everything before npm install!

**Build initial version:**
```bash
docker build -f Dockerfile.bad -t caching:bad-v1 .
```

Takes 30-60 seconds.

**Make a code change:**
```bash
sed -i 's/Hello from Layer Caching Demo!/Version 2!/' app.js
# Or manually edit app.js
```

**Rebuild:**
```bash
docker build -f Dockerfile.bad -t caching:bad-v2 .
```

**Watch the output:**
```
Step 3/6 : COPY . .
 ---> abc123def456   ⬅️ File changed
Step 4/6 : RUN npm install
 ---> Running in xyz789...   ⬅️ Re-runs npm install! (60 seconds wasted)
```

Takes another 30-60 seconds because npm install re-runs.

---

### 3. Review Good Dockerfile

View `Dockerfile.good`:
```bash
cat Dockerfile.good
```

Notice the optimized order - dependencies first, code last!

**Build initial version:**
```bash
docker build -f Dockerfile.good -t caching:good-v1 .
```

Takes 30-60 seconds.

**Make same code change:**
```bash
sed -i 's/Hello from Layer Caching Demo!/Version 2!/' app.js
```

**Rebuild:**
```bash
docker build -f Dockerfile.good -t caching:good-v2 .
```

**Watch the output:**
```
Step 3/7 : COPY package.json .
 ---> Using cache   ⬅️ Cached!
Step 4/7 : RUN npm install
 ---> Using cache   ⬅️ Cached! (Saved 60 seconds!)
Step 5/7 : COPY app.js .
 ---> abc123def456   ⬅️ Only this layer rebuilds
```

Takes only 5 seconds! npm install was cached.

---

## Comparing the Results

**Bad order (copy everything first):**
- Initial build: 60 seconds
- Rebuild after code change: 60 seconds
- npm install re-runs every time

**Good order (copy dependencies first):**
- Initial build: 60 seconds
- Rebuild after code change: 5 seconds
- npm install cached

**Time saved: 10-20x faster rebuilds!**

---

## How Layer Caching Works

**Docker caches each layer:**
1. Checks if instruction + files changed
2. If unchanged → use cached layer
3. If changed → rebuild from that point down

**Invalidation:**
- Changing a file invalidates that layer
- All subsequent layers also invalidate
- Previous layers remain cached

**Optimization strategy:**
- Put stable things first (base image, dependencies)
- Put changing things last (application code)

---

## Real-World Example

**Typical development workflow:**
- Edit code 50 times per day
- Dependencies change 2 times per week

**Without optimization:**
- 50 builds × 60 seconds = 50 minutes wasted per day!

**With optimization:**
- 50 builds × 5 seconds = 4 minutes per day
- **Saved: 46 minutes per day**

---

## Key Takeaways

✅ Layer order drastically affects build time  
✅ Copy dependencies before code  
✅ Stable instructions first, changing instructions last  
✅ Cache invalidates from change point downward  
✅ Proper order = 10-20x faster rebuilds  

---

## Best Practices

```dockerfile
# 1. Base image (rarely changes)
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy dependency files (changes occasionally)
COPY package*.json ./

# 4. Install dependencies (slow, want to cache)
RUN npm install

# 5. Copy code (changes frequently)
COPY . .

# 6. Runtime config
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Quick Test

Want to see caching in action?

```bash
# Build twice without changes
docker build -t test:v1 .
docker build -t test:v2 .  # Should be instant (all cached)

# Make a code change
echo "// comment" >> app.js
docker build -t test:v3 .  # Only affected layers rebuild
```

---

## Next Lab

[Lab 3: Base Images](../lab3_base_images/) - Compare Alpine, Slim, and Full base images.
