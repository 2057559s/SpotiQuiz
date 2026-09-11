# Spotiquiz 🎵

A fun and interactive music quiz web app that imports your Spotify data and tests your knowledge of your own listening history!

## Features

- **Spotify Authentication**: Securely connect your Spotify account
- **Personalized Quiz**: 10 random questions about your top tracks
- **Multiple Question Types**:
  - When did you listen to this song the most?
  - How many times have you listened to this track?
  - Can you identify the artist?
  - Guess the song's popularity score
- **Instant Results**: Get immediate feedback with your final score
- **Beautiful UI**: Modern, responsive design with Spotify colors

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Spotify OAuth
- **APIs**: Spotify Web API

## Prerequisites

Before you start, you'll need:
- Node.js 18+ installed
- A Spotify Developer account (free at https://developer.spotify.com)

## Setup Instructions

### 1. Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app (accept the terms)
3. Note your **Client ID** and **Client Secret**
4. Click "Edit Settings" and add a Redirect URI: `http://localhost:3000/api/auth/callback/spotify`

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Spotify API Configuration
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

# NextAuth Secret (generate one with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_nextauth_secret_here

# App URL
NEXTAUTH_URL=http://localhost:3000
```

**To generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app!

## How to Use

1. **Sign In**: Click "Connect with Spotify" on the landing page
2. **Authorize**: Grant Spotiquiz access to your top tracks and listening history
3. **Take the Quiz**: Answer 10 personalized questions about your music
4. **See Results**: View your score and share with friends!

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/
│   │   ├── auth/[...nextauth]   # NextAuth authentication handler
│   │   └── spotify/top-tracks   # Spotify API endpoint
│   ├── login/                    # Login page
│   ├── quiz/                     # Quiz page
│   ├── page.tsx                  # Home page
│   └── layout.tsx                # Root layout with SessionProvider
├── components/                   # React components
│   ├── QuizComponent.tsx        # Main quiz container
│   ├── QuestionCard.tsx         # Individual question display
│   └── ResultsCard.tsx          # Results screen
├── lib/
│   ├── quiz.ts                  # Quiz logic and types
│   └── spotify.ts               # Spotify API utilities
└── types/
    └── next-auth.d.ts           # NextAuth type definitions
```

## Features to Explore

- **Quiz Logic**: Questions are randomly selected from your top tracks
- **Data Import**: Your Spotify data is fetched securely on each session
- **Responsive Design**: Works great on mobile, tablet, and desktop
- **TypeScript**: Full type safety throughout the codebase

## Future Enhancements

- Add more question types (release date guessing, album covers)
- Leaderboard and score tracking
- Share results on social media
- Different difficulty levels
- Time-based challenges
- Multiplayer mode

## Troubleshooting

**"Failed to fetch tracks" error**
- Make sure you've filled in all environment variables correctly
- Check that your Spotify app's redirect URI matches exactly: `http://localhost:3000/api/auth/callback/spotify`

**Spotify login not working**
- Verify your Client ID and Client Secret are correct
- Clear your browser cookies and try again
- Make sure you've added your localhost URL to the app's redirect URIs

**NEXTAUTH_SECRET error**
- Generate a new secret: `openssl rand -base64 32`
- Add it to your `.env.local` file

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

**Enjoy your personalized music quiz!** 🎉
