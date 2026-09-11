# Spotiquiz - Getting Started

Your Spotify music quiz web app has been successfully created and is now running!

## ✅ What Was Built

A complete **Next.js TypeScript web application** that:
- Authenticates users via Spotify OAuth
- Imports their top tracks and listening history
- Generates personalized music trivia questions
- Provides instant feedback and scoring

## 🚀 Current Status

✅ **Server is running at**: http://localhost:3001

## 📋 Next Steps to Get It Working

### 1. Create a Spotify Developer App

1. Go to https://developer.spotify.com/dashboard
2. Log in or create a Spotify account (free)
3. Create a new app
4. Accept the terms and create

### 2. Get Your Credentials

In the app settings, you'll find:
- **Client ID**
- **Client Secret**

### 3. Add Redirect URI

In your Spotify app settings, add this Redirect URI:
```
http://localhost:3001/api/auth/callback/spotify
```
(Note: It's on port 3001 since port 3000 was in use)

### 4. Generate NEXTAUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

### 5. Configure Environment Variables

Update `/Users/nicholassaunderson/Development/Spotiquiz/.env.local`:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3001
```

### 6. Test the App

1. Go to http://localhost:3001
2. Click "Connect with Spotify"
3. Authorize the app
4. Take the quiz!

## 📁 Project Structure

```
/Users/nicholassaunderson/Development/Spotiquiz/
├── .env.local              # Environment variables (add Spotify creds here!)
├── .github/copilot-instructions.md
├── .vscode/tasks.json      # VS Code tasks
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── login/          # Login page
│   │   ├── quiz/           # Quiz page
│   │   ├── page.tsx        # Home page
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   └── types/              # TypeScript definitions
├── package.json            # Dependencies
├── tsconfig.json          # TypeScript config
└── README.md              # Full documentation
```

## 🎮 How the Quiz Works

1. **User Signs In** → Spotify OAuth
2. **Data Fetches** → Top 50 tracks from user's history
3. **Quiz Generated** → 10 random questions from their tracks
4. **Question Types**:
   - When did you listen to this most?
   - How many times have you listened?
   - Identify the artist
   - Guess the popularity score
5. **Results Shown** → Final score and percentage

## 🛠️ Available Commands

```bash
npm run dev      # Start development server (already running!)
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check code quality
```

## 🔧 VS Code Tasks

You can also run tasks via VS Code:
- **Cmd+Shift+B** → Run dev (default)
- **Cmd+Shift+P** → Type "Tasks: Run Task" to see all tasks

## ⚙️ Features Included

✅ Spotify OAuth authentication
✅ Secure session management with NextAuth.js
✅ TypeScript for type safety
✅ Tailwind CSS for beautiful UI
✅ Responsive design (mobile, tablet, desktop)
✅ Quiz logic with multiple question types
✅ Results and scoring system
✅ Error handling

## 📱 What You Can Customize

The app is fully customizable! You can:
- Add more question types in `src/lib/quiz.ts`
- Change colors/styling with Tailwind
- Add a database to save scores
- Implement leaderboards
- Add social sharing
- Create difficulty levels

## 🐛 Troubleshooting

**"Failed to connect to Spotify"**
- Make sure you've added your credentials to `.env.local`
- Check the Redirect URI matches exactly

**Port 3001 not loading**
- The server is running, try refreshing the page
- Check the terminal output for any errors

**NEXTAUTH_SECRET error**
- Generate a new one: `openssl rand -base64 32`
- Add it to `.env.local`

## 📚 Documentation

Full documentation is available in:
- `README.md` - Complete project guide
- `.github/copilot-instructions.md` - Development guidelines

---

**Enjoy your music quiz app!** 🎵

Let me know if you need any modifications or additional features!
