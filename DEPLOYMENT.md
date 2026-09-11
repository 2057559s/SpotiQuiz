# Deploy Spotiquiz on Vercel

Vercel is the recommended host for this Next.js application. Its Hobby plan is free for personal, non-commercial projects.

## 1. Create the deployment

1. Create a GitHub repository and push this project. Do not commit `.env.local`.
2. Sign in at [Vercel](https://vercel.com/new) with GitHub and import the repository.
3. Keep the detected **Next.js** framework preset and deploy once. Vercel will assign an HTTPS URL such as `https://spotiquiz-your-name.vercel.app`.

## 2. Add production environment variables

In **Project Settings → Environment Variables**, add these for Production:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | Your Spotify Client ID |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify Client Secret (mark as sensitive) |
| `NEXTAUTH_SECRET` | A new random value from `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your exact Vercel HTTPS URL, without a trailing slash |

Redeploy after adding the values.

## 3. Update Spotify

In the Spotify Developer Dashboard, add this exact Redirect URI under your app settings:

```
https://YOUR-VERCEL-URL/api/auth/callback/spotify
```

Also set the app Website URL to the same Vercel origin. The redirect URI must exactly match and must use HTTPS in production.

## 4. Verify

Open the deployed URL in a private browser window, connect Spotify, and open **Your music → Liked Songs**. If Spotify says `redirect_uri: Not matching configuration`, compare the URI character-for-character with the Vercel URL.
