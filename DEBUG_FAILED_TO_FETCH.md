# Failed to Fetch - Debugging Guide

## What Does "Failed to Fetch" Mean?
The frontend tried to connect to the backend API (`http://localhost:1337`) but couldn't reach it. This usually means:
1. **Strapi backend isn't running** ❌
2. **Wrong API URL configured** ❌  
3. **Port 1337 is blocked** ❌
4. **Network connectivity issue** ❌
5. **CORS misconfiguration** ❌

## Step 1: Check if Strapi Backend is Running

### On Windows (PowerShell):
```powershell
cd "c:\Users\asus\OneDrive\Desktop\New folder\digivents\backend"
npm run develop
```

You should see output like:
```
[2026-03-15 10:30:45] info Creating or updating the admin user...
[2026-03-15 10:30:45] info Admin panel will be available at http://localhost:1337/admin
[2026-03-15 10:30:45] info Server has started successfully
```

**Look for: "Server has started successfully"**

### Check if running on correct port:
```powershell
netstat -ano | findstr :1337
```

Should show something like:
```
TCP    127.0.0.1:1337    0.0.0.0:0    LISTENING
```

## Step 2: Check Frontend Console

1. **Open browser** where you see the error
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. **Submit the contact form**
5. Look for messages like:

**Expected (working)**:
```
[API Config] Using API URL: http://localhost:1337
[API] Fetching: http://localhost:1337/api/contacts
[Contact API] Raw formData: {...}
[API] Success: /contacts {...}
```

**Broken (what you're seeing)**:
```
[API Config] Using API URL: http://localhost:1337
[API] Fetching: http://localhost:1337/api/contacts
[API Error] Failed to fetch http://localhost:1337/api/contacts:
TypeError: Failed to fetch
```

## Step 3: Test Backend Directly

### Using PowerShell:
```powershell
# Test if backend is responding
$headers = @{'Content-Type' = 'application/json'}
$body = @{
    data = @{
        firstName = "Test"
        lastName = "User"
        email = "test@example.com"
        subject = "Test"
        message = "Test message"
    }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:1337/api/contacts" `
  -Method POST `
  -Headers $headers `
  -Body $body -Verbose
```

**Expected response**: HTTP 201 or 400 with error details (NOT "Failed to fetch")

### Using curl (if installed):
```bash
curl -X POST http://localhost:1337/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "firstName": "Test",
      "lastName": "User", 
      "email": "test@example.com",
      "subject": "Test",
      "message": "Test"
    }
  }' -v
```

## Step 4: Check Firewall/Network

### Windows Firewall:
1. Open **Windows Defender Firewall** → **Allow an app through firewall**
2. Look for **Node.js** or apps with port **1337**
3. Make sure both Private and Public are checked

### Port Conflict:
```powershell
# Find what's using port 1337
Get-NetTCPConnection -LocalPort 1337 -ErrorAction SilentlyContinue
```

## Step 5: Check Environment Variables

### Frontend .env file should have:
```
# c:\Users\asus\OneDrive\Desktop\New folder\digivents\frontend\.env
REACT_APP_API_URL=http://localhost:1337
```

Or leave it blank to use default `http://localhost:1337`

### Backend .env file should have:
```
# c:\Users\asus\OneDrive\Desktop\New folder\digivents\backend\.env
HOST=localhost
PORT=1337
```

## Quick Fixes

### Fix 1: Start the Backend
```powershell
cd "c:\Users\asus\OneDrive\Desktop\New folder\digivents\backend"
npm run develop
```

Wait for: **"Server has started successfully"**

Then try the form again.

### Fix 2: Kill process on port 1337
If something else is using port 1337:

```powershell
# Find process using port 1337
$process = Get-NetTCPConnection -LocalPort 1337 | Select-Object OwningProcess
$pid = $process.OwningProcess

# Kill it
Stop-Process -Id $pid -Force

# Then restart Strapi
cd "c:\Users\asus\OneDrive\Desktop\New folder\digivents\backend"
npm run develop
```

### Fix 3: Change Strapi Port
If port 1337 is in use, use a different port:

```powershell
cd "c:\Users\asus\OneDrive\Desktop\New folder\digivents\backend"
PORT=1338 npm run develop
```

Then update frontend to use `http://localhost:1338` in `.env`

### Fix 4: Try Different Network
- If on VPN, try disabling it
- Try mobile hotspot instead of WiFi
- Try wired ethernet if available

## Network Tab Debugging

1. **F12** → **Network** tab
2. **Submit form**
3. Find the POST request to `/api/contacts`
4. You should see:
   - **Status**: Should show a status code (200, 201, 400, 403, etc.)
   - **NOT** showing up at all = Backend not running
   - **Type**: `fetch`
   - **Response**: Should have data or error message

**If request doesn't appear**: Backend isn't running or wrong URL

## Full Test Checklist

- [ ] Is Strapi terminal showing "Server has started successfully"?
- [ ] Can you see `[API Config] Using API URL:` in browser console?
- [ ] Does `http://localhost:1337` work in browser (should show Strapi page)?
- [ ] Is firewall blocking port 1337?
- [ ] Is another app using port 1337?
- [ ] Did you fill all form fields before submitting?
- [ ] Is there a `.env` file in frontend with correct API URL?

## Still Broken?

**Screenshot the browser console on error and check for**:
1. Exact error message
2. All `[API]` or `[Contact API]` prefixed logs
3. The URL it's trying to reach

**Common Solutions**:
```
Error: Failed to fetch
→ Backend not running, start with: npm run develop

Error: CORS error
→ Check backend/config/middlewares.js CORS config

Error: API error: 403
→ Public role missing permissions in Strapi Admin

Error: API error: 400
→ Form data invalid, check browser console for details
```

## Commands to Run (In Order)

```powershell
# 1. Check if Node.js is installed
node --version

# 2. Install dependencies if needed
cd "c:\Users\asus\OneDrive\Desktop\New folder\digivents\backend"
npm install

# 3. Start Strapi backend
npm run develop

# Wait for "Server has started successfully" message

# In another terminal, start frontend:
cd "c:\Users\asus\OneDrive\Desktop\New folder\digivents\frontend"
npm start
```

## Strapi Admin Panel Test

If you can access **http://localhost:1337/admin** in browser:
✅ Backend is running
✅ Port 1337 is accessible

If you CAN'T access it:
❌ Backend not running OR port blocked
