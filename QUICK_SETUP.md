# Quick Setup: Get Your Admin API Key

## Current Status
✅ **Search API Key Configured** - Your search is now using real Algolia!
🔄 **Admin API Key Needed** - For idea submissions

## Get Your Admin API Key

### Step 1: Go to Algolia Dashboard
1. Open your Algolia dashboard
2. Go to **Settings** → **API Keys**

### Step 2: Create Admin API Key
1. Look for **"Create API Key"** or **"Add API Key"**
2. Set **Permissions** to:
   - ✅ **Add records**
   - ✅ **Delete records** 
   - ✅ **Edit settings**
3. **Copy the generated key**

### Step 3: Update Configuration
Replace `YOUR_ADMIN_API_KEY` in `src/services/algoliaService.js` with your actual admin key.

### Step 4: Create Index (if needed)
1. Go to **Search** → **Indices**
2. Click **"Create Index"**
3. Name it: `ideas`
4. Click **"Create"**

## Test It
1. **Search** should work with real Algolia data
2. **Submit ideas** will work once admin key is added
3. **Check dashboard** to see submitted ideas

## Current Behavior
- **Search**: ✅ Using real Algolia (your data)
- **Submit**: 🔄 Using mock data (until admin key added)
- **UI**: Shows "Development Mode" for submissions only

Your search is now live with Algolia! Just add the admin key to enable real idea submissions.
