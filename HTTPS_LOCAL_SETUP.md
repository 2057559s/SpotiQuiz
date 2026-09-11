# Update Spotify App Redirect URI

Now that you have a self-signed SSL certificate and HTTPS set up, you need to update your Spotify app's redirect URI.

## Steps:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on your "Spotiquiz" app
3. Click **Edit Settings**
4. Find the **Redirect URIs** section
5. **Replace** the old URI with:
   ```
   https://localhost:3443/api/auth/callback/spotify
   ```
   (Previously it was `http://localhost:3001/api/auth/callback/spotify`)
6. Click **Save**

## Important Notes:

- Your browser will show a security warning about the self-signed certificate - this is normal and expected
- You'll need to accept/allow the certificate when prompted
- In Chrome: Click "Advanced" → "Proceed to localhost (unsafe)"
- In Safari: You may need to add the certificate to Keychain

## Running Your App:

Once you've updated the Spotify redirect URI, start your dev server with HTTPS:

```bash
npm run dev:https
```

This will:
- Start the Next.js dev server on http://localhost:3000 (internally)
- Start an SSL proxy on https://localhost:3443 (publicly visible)
- Redirect all traffic through the self-signed certificate

## Testing:

1. Open https://localhost:3443 in your browser
2. Accept the security warning about the self-signed certificate
3. Click "Connect with Spotify"
4. You should be able to log in without any redirect URI errors!

## Troubleshooting:

If you still get "Invalid redirect URI" error:
- Make sure you've saved the changes in the Spotify Developer Dashboard
- Double-check the URL is exactly: `https://localhost:3443/api/auth/callback/spotify`
- Clear your browser cache
- Restart your dev server
