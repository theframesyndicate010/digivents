# Contact Form Setup Guide

## Overview
The contact form submissions are sent to the Strapi backend and saved in the `contacts` collection.

## Recent Fixes Applied

### 1. **Backend Schema Update** ✅
- **File**: `backend/src/api/contact/content-types/contact/schema.json`
- **Change**: Replaced generic `phone` field with `subject` field
- **Reason**: The frontend form uses `subject` field, not `phone`

### 2. **Frontend API Mapping Fix** ✅
- **File**: `frontend/src/data/contactApi.js`
- **Change**: Corrected field mapping from `Subject → subject` (was incorrectly mapped to `phone`)
- **Added**: Console logging for debugging API calls

### 3. **Enhanced Backend Controller** ✅
- **File**: `backend/src/api/contact/controllers/contact.js`
- **Added**:
  - Request logging
  - Field validation
  - Email format validation
  - Optional admin email notification
  - Better error handling

### 4. **Improved Frontend Validation** ✅
- **File**: `frontend/src/pages/ContactPage.js`
- **Added**:
  - Form field validation before submission
  - Email format validation
  - Better error messages
  - Loading state feedback

## Contact Form Fields

### Frontend Form
- **First Name** (required)
- **Last Name** (required)
- **Email** (required, must be valid email)
- **Subject** (optional)
- **Message** (required)

### Backend Schema
```json
{
  "firstName": "string (required, max 100)",
  "lastName": "string (required, max 100)",
  "email": "email (required)",
  "subject": "string (optional, max 200)",
  "message": "text (required)"
}
```

## Strapi Admin Panel Setup

### Step 1: Enable Public Access to Contact Endpoint

1. Open Strapi Admin Panel (http://yoursite.com/admin)
2. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
3. Click on **Public** role
4. Find **Contact** in the permissions list
5. Check these permissions:
   - ✅ `find` (GET all contacts)
   - ✅ `create` (POST new contact) ← **IMPORTANT**
   - Leave `update` and `delete` unchecked for security

6. Click **Save**

### Step 2: View Submitted Messages

1. In Strapi Admin, go to **Content Manager**
2. Click on **Contact** (in the left sidebar under Collections)
3. All submitted messages appear here with submission details
4. You can view, edit, or delete submissions

### Step 3: Optional - Setup Email Notifications

The contact controller is configured to send email notifications to `digivents02@gmail.com` when a message is received.

To enable:
1. Make sure Strapi Email Plugin is installed: `npm install @strapi/plugin-email`
2. Configure email provider (SendGrid, Mailgun, etc.) in `backend/config/plugins.js`
3. Restart backend

Example SMTP configuration:
```javascript
// backend/config/plugins.js
module.exports = {
  email: {
    config: {
      provider: 'sendgrid', // or 'nodemailer', 'mailgun', etc.
      providerOptions: {
        apiKey: process.env.SENDGRID_API_KEY,
      },
      settings: {
        defaultFrom: 'noreply@digivents.com',
        defaultReplyTo: 'no-reply@digivents.com',
      },
    },
  },
};
```

## Testing the Form

### Frontend Testing
1. Fill out the contact form on `/contact` page
2. Check browser console (F12 → Console tab) for API logs:
   - `[Contact API] Sending message: {...}`
   - `[Contact API] Success response: {...}`

### Backend Testing
1. Check Strapi logs for:
   - `[Contact Controller] POST /api/contacts`
   - `[Contact Controller] Message created successfully`

2. Verify in Strapi Admin:
   - Go to **Content Manager** → **Contact**
   - New submission should appear

### Debugging Failed Submissions

If messages aren't being saved:

1. **Check Permissions**:
   - Verify Public role has `create` permission for Contact
   - Settings → Users & Permissions → Public → Contact → create ✅

2. **Check Browser Console** (F12):
   - Look for error messages
   - Network tab → check POST request to `/api/contacts`

3. **Check Backend Logs**:
   - Terminal where Strapi is running
   - Look for `[Contact Controller]` messages

4. **Common Issues**:
   - Missing required fields → Error: "Missing required fields: ..."
   - Invalid email → Error: "Invalid email format"
   - Permissions error → HTTP 403 Forbidden
   - CORS error → Check `backend/config/middlewares.js`

## Form Data Flow

```
User fills form on /contact
         ↓
Frontend validates (email format, required fields)
         ↓
contactApi.sendMessage(formData)
         ↓
POST /api/contacts
{
  data: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    subject: "Website inquiry",
    message: "I'd like to..."
  }
}
         ↓
Backend validates again
         ↓
Saves to Strapi contacts collection
         ↓
(Optional) Sends email to admin
         ↓
Returns success response to frontend
         ↓
User sees success message
         ↓
Submission visible in Strapi Admin
```

## Environment Variables

Make sure these are set:

**Frontend** (`.env` or `.env.local`):
```
REACT_APP_API_URL=http://localhost:1337
# or for production:
REACT_APP_API_URL=https://api.digivents.com.np
```

**Backend** (`.env`):
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=digivents
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
NODE_ENV=production
# Add email provider credentials if using email notifications
SENDGRID_API_KEY=your_api_key
```

## Support

If messages still aren't being saved:
1. Check the browser console for errors
2. Check the Strapi logs in terminal
3. Verify the Contact collection exists in Strapi
4. Verify Public role has create permission
5. Test with curl or Postman:

```bash
curl -X POST http://localhost:1337/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "subject": "Test",
      "message": "Test message"
    }
  }'
```
