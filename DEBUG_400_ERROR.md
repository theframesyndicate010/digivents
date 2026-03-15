# Contact Form 400 Error - Debugging Guide

## What is a 400 Error?
**400 Bad Request** means the frontend sent invalid data to the backend. The API rejected the request because the data doesn't match what Strapi expects.

## How to Debug

### Step 1: Check Browser Console
1. Open the browser **Developer Tools** (Press `F12`)
2. Go to the **Console** tab
3. Submit the contact form
4. Look for logs prefixed with `[Contact API]` or `[API]`

You should see something like:
```
[API] Fetching: http://localhost:1337/api/contacts
[Contact API] Raw formData: {First Name: "...", Last Name: "...", ...}
[Contact API] Prepared payload: {...}
[API Error Details] {
  status: 400,
  statusText: "Bad Request",
  message: "...",
  details: "..."
}
```

### Step 2: Check the Error Messages
The improved error handling now shows exactly what Strapi rejected. Look for messages like:
- `firstName is required and cannot be empty`
- `email must be a valid email`
- `Invalid email format`
- etc.

### Step 3: Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Submit the form
3. Find the POST request to `/api/contacts`
4. Click on it
5. Look at **Response** tab to see the error details from Strapi

## Common 400 Error Causes

### 1. **Empty Required Fields**
**Problem**: Form fields are empty when submitted
**Solution**: 
- Check that all inputs have the `value` prop bound to formData
- Make sure `onChange={handleInputChange}` is connected to each input

### 2. **Field Name Mismatch**
**Problem**: The form field names don't match the backend schema
**Frontend expects**: firstName, lastName, email, subject, message
**Check**:
- In ContactPage.js, inputs use `handleInputChange(label, value)` where label should be: "First Name", "Last Name", "Email", "Subject", "Message"
- But sendMessage function expects: `formData['First Name']` not `formData['firstName']`

### 3. **Email Validation**
**Problem**: Invalid email format
**Check**: The email field contains a valid email (e.g., user@domain.com)

### 4. **Missing Subject Field**
**Old schema issue**: The old schema used `phone` field, not `subject`
**Fixed**: Updated schema.json to include `subject` field

## Test Data
Try submitting with this exact data:
```
First Name: John
Last Name: Doe
Email: john@example.com
Subject: Test Message
Message: This is a test message to verify the contact form works.
```

## Backend Error Logs
If you're running Strapi locally, check the terminal where Strapi is running:

```
[Contact Controller] POST /api/contacts
[Contact Controller] Request body: {...}
[Contact Controller] Validation errors: [...]
[Contact Controller] Creating contact with data: {...}
[Contact Controller] Contact created successfully with ID: 1
```

If you see validation errors, that's what's causing the 400.

## Frontend Code Check

### Verify Form Structure
The ContactPage.js form should have inputs like:

```javascript
{formConfig.nameFields.map((ph, i) => (
  <input
    onChange={(e) => handleInputChange(ph, e.target.value)}
    value={formData[ph] || ''}  // ← MUST HAVE VALUE PROP
    // ...
  />
))}

{formConfig.inputFields.map((field, i) => (
  <input
    onChange={(e) => handleInputChange(field.label, e.target.value)}
    value={formData[field.label] || ''}  // ← MUST HAVE VALUE PROP
    // ...
  />
))}
```

The `value` prop is important - without it, the input won't be controlled by React.

### Check formConfig Structure
Make sure formConfig is built correctly:
```javascript
const formConfig = {
  nameFields: ['First Name', 'Last Name'],
  inputFields: [
    { label: 'Email', type: 'email', placeholder: '...' },
    { label: 'Subject', type: 'text', placeholder: '...' },
  ],
  messageField: { label: 'Message', placeholder: '...', rows: 5 }
}
```

## Quick Fixes to Try

1. **Clear form and try again** - Sometimes cached data causes issues
   - Don't use browser autofill, type manually
   
2. **Check Strapi is running**
   - Make sure backend is actually running: `npm run develop`
   
3. **Clear browser cache**
   - Ctrl+Shift+Delete → Clear all data → Try again

4. **Check CORS settings**
   - If you get a CORS error instead, check `backend/config/middlewares.js`
   - Ensure origin includes your frontend URL

## Full Request/Response Example

### What Gets Sent (Frontend)
```json
POST http://localhost:1337/api/contacts

{
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "subject": "Test",
    "message": "Hello world"
  }
}
```

### What Should Be Returned (Success)
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "subject": "Test",
      "message": "Hello world",
      "createdAt": "2026-03-15T...",
      "updatedAt": "2026-03-15T..."
    }
  }
}
```

### Error Response (400)
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "...",
    "details": {
      "errors": [...]
    }
  }
}
```

## Still Not Working?

1. **Open browser console** (F12 → Console)
2. **Submit form**
3. **Copy all error messages** that start with `[Contact API]`, `[API]`, or `[API Error]`
4. **Paste them here** and we can debug from there

The improved error logging now shows exactly what's going wrong!
