# Setting Up HTTPS for Local Development with ngrok

Since Spotify now requires HTTPS for all redirect URIs (even localhost), we need to use a tunneling service like `ngrok` to create a secure tunnel to your local development server.

## Option 1: Using ngrok (Recommended - Easiest)

### Step 1: Install ngrok
```bash
# Using Homebrew on Mac
brew install ngrok
```

Or download from: https://ngrok.com/download

### Step 2: Create a Free ngrok Account
1. Go to https://ngrok.com/
2. Sign up for a free account
3. Get your auth token from the dashboard

### Step 3: Authenticate ngrok
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Step 4: Start ngrok Tunnel
In a new terminal window:
```bash
ngrok http 3001
```

You'll see output like:
```
Forwarding    https://abc123def456.ngrok.io -> http://localhost:3001
```

Copy that HTTPS URL (e.g., `https://abc123def456.ngrok.io`)

### Step 5: Update Your Spotify App

1. Go to https://developer.spotify.com/dashboard
2. Click your app → Edit Settings
3. Update Redirect URI to:
   ```
   https://abc123def456.ngrok.io/api/auth/callback/spotify
   ```
   (Replace `abc123def456.ngrok.io` with your actual ngrok URL)

### Step 6: Update Your `.env.local`

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=3c7a58554fa64fc7a0609603b424b36a
SPOTIFY_CLIENT_SECRET=8964bcd36fac497e810ee083000a7801
NEXTAUTH_SECRET=XyHi79iGlop5Kx6RQQOcwVdE0EVqvKVqs+4DpjOyp3A=
NEXTAUTH_URL=https://abc123def456.ngrok.io
```

(Replace with your actual ngrok URL)

### Step 7: Restart Dev Server
The dev server should auto-reload when you update `.env.local`

### Step 8: Test It Out
Visit your ngrok URL in the browser (e.g., `https://abc123def456.ngrok.io`) and try "Connect with Spotify"

---

## Option 2: Using localhost with mkcert (More Complex)

If you prefer to use localhost, you can create local SSL certificates:

```bash
# Install mkcert
brew install mkcert

# Create local CA
mkcert -install

# Generate certificate for localhost
mkcert localhost 127.0.0.1
```

Then configure Next.js to use the certificates, but this requires more setup.

---

## Why ngrok is Better for This
- ✅ Simple setup (just one command)
- ✅ Creates a real HTTPS URL that Spotify accepts
- ✅ No certificate issues
- ✅ Free tier is sufficient for development
- ✅ Great for testing webhooks and OAuth flows

---

## Steps Summary

1. `brew install ngrok`
2. Sign up at ngrok.com and get auth token
3. `ngrok config add-authtoken YOUR_TOKEN`
4. `ngrok http 3001` (in a new terminal)
5. Copy the HTTPS URL from ngrok output
6. Update Spotify redirect URI to use that ngrok URL
7. Update `.env.local` to use that ngrok URL
8. Try logging in!

Let me know when you've set up ngrok and I can help with the rest! 🚀
