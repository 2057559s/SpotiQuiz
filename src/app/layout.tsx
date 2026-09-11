import type { Metadata } from "next";
import { ReactNode } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spotiquiz - Music Quiz",
  description: "Test your knowledge of your Spotify listening history",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900">
        <AuthProvider>
          {children}
          <SpotifyPlayer />
        </AuthProvider>
      </body>
    </html>
  );
}
