# Spotiquiz Setup Guide

## 🔴 REQUIRED: Configure Spotify Authentication

Your app is running but shows an "INVALID_CLIENT" error because Spotify credentials are missing. Here's how to set it up:

### Step 1: Create a Spotify Developer App

1. Go to https://developer.spotify.com/dashboard
2. Click "Log in" (or create a free Spotify account if needed)
3. Click "Create an App"
4. Accept the terms and create the app
5. You'll see your app dashboard with:
   - **Client ID** (copy this)
   - **Client Secret** (copy this - keep it secret!)

### Step 2: Add Redirect URI

1. Still in your app settings, click "Edit Settings"
2. Under "Redirect URIs", add:
   ```
   http://localhost:3001/api/auth/callback/spotify
   ```
3. Save

### Step 3: Configure Environment Variables

1. Open `.env.local` in the project root
2. Replace with your actual credentials:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_actual_client_id_here
SPOTIFY_CLIENT_SECRET=your_actual_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3001
```

### Step 4: Generate NEXTAUTH_SECRET

Run this in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET`

### Step 5: Restart the Dev Server

The dev server should auto-reload when you change `.env.local`, but you can manually restart it if needed:

```bash
# Press Ctrl+C to stop, then:
npm run dev
```

### Step 6: Test It Out

1. Go to http://localhost:3001
2. Click "Connect with Spotify"
3. You should see the Spotify login page (not the INVALID_CLIENT error)
4. Log in and authorize the app
5. Enjoy your music quiz! 🎵

---

## ⚠️ Troubleshooting

**Still getting "INVALID_CLIENT"?**
- Make sure your Client ID and Client Secret are correct (no extra spaces)
- Make sure the Redirect URI in Spotify settings matches exactly: `http://localhost:3001/api/auth/callback/spotify`
- Restart your dev server after updating `.env.local`

**Blank page or other errors?**
- Check the browser console (F12) for errors
- Check the terminal where `npm run dev` is running for errors
- Try clearing your browser cache

**Port 3001 not working?**
- Update your `.env.local` to use the correct port
- Update your Spotify app's Redirect URI to match the port you're using

---

Let me know once you've added your Spotify credentials! 🚀
