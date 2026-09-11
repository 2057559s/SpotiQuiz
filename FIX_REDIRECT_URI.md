# Fix: INVALID_CLIENT - Invalid Redi❌ **Wrong Port**: Using `http://localhost:3000` instead of `http://localhost:3001`
❌ **Wrong Path**: Using `/callback` instead of `/api/auth/callback/spotify`
❌ **Extra Slash**: Using `http://localhost:3001/` instead of `http://localhost:3001`
❌ **Wrong Protocol**: Using `https://` instead of `http://` (for localhost development, use http)

## ✅ Correct Format for Local Development
```
http://localhost:3001/api/auth/callback/spotify
```

## ℹ️ Note on HTTPS
For **local development**, use `http://`. 
For **production**, use `https://` - Spotify requires secure connections in production.
## The Problem
Spotify is rejecting the redirect URI because it doesn't match what's configured in your Spotify app settings.

## The Solution

### Step 1: Go to Your Spotify App Settings
1. Visit https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Find your app in the list
4. Click on it to open the settings

### Step 2: Edit Settings
1. Click the **"Edit Settings"** button
2. Scroll down to find **"Redirect URIs"**

### Step 3: Add/Update Redirect URI
Make sure this exact URI is in the list:
```
http://localhost:3001/api/auth/callback/spotify
```

If there are other URIs listed, you can keep them or remove them (only this one is needed for localhost development).

**Note:** For local development, use `http://`. For production deployments, Spotify requires `https://`.

### Step 4: Save
Click "Save" button at the bottom

### Step 5: Refresh Your App
- The dev server should auto-detect the change and reload
- If not, you can manually refresh your browser at http://localhost:3001

## ⚠️ Common Mistakes to Avoid

❌ **Wrong Port**: Using `https://localhost:3000` instead of `https://localhost:3001`
❌ **Wrong Path**: Using `/callback` instead of `/api/auth/callback/spotify`
❌ **Extra Slash**: Using `https://localhost:3001/` instead of `https://localhost:3001`
❌ **Wrong Protocol**: Using `http://` instead of `https://` (Spotify requires HTTPS)

## ✅ Correct Format
```
https://localhost:3001/api/auth/callback/spotify
```

## Still Having Issues?

If you've added the correct redirect URI and still see the error:

1. **Clear your browser cache** (Cmd+Shift+Delete on Mac)
2. **Refresh the page** (Cmd+R)
3. **Try an incognito/private window**
4. **Make sure the exact URI is in your Spotify settings** (copy-paste to be sure)

---

Once you've updated your Spotify app settings, try clicking "Connect with Spotify" again! 🎵
