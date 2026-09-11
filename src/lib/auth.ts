import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions: NextAuthOptions = {
  providers: [SpotifyProvider({ clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!, clientSecret: process.env.SPOTIFY_CLIENT_SECRET!, authorization: { params: { scope: "user-read-email user-read-private user-top-read user-read-recently-played streaming user-modify-playback-state user-read-playback-state user-library-read playlist-read-private", show_dialog: "true" } } })],
  secret: process.env.NEXTAUTH_SECRET!, pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) { token.accessToken = account.access_token; token.refreshToken = account.refresh_token; token.expiresAt = account.expires_at ? account.expires_at * 1000 : 0; }
      if (token.expiresAt && Date.now() > (token.expiresAt as number) && token.refreshToken) try {
        const response = await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}` }, body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: token.refreshToken as string }) });
        if (response.ok) { const next = await response.json(); token.accessToken = next.access_token; token.refreshToken = next.refresh_token ?? token.refreshToken; token.expiresAt = Date.now() + next.expires_in * 1000; }
      } catch (error) { console.error("Token refresh failed:", error); }
      return token;
    },
    async session({ session, token }) { if (session.user) session.user = { ...session.user, accessToken: token.accessToken as string, refreshToken: token.refreshToken as string }; return session; },
  },
};
