# Playlist Maker

A web application that helps you create playlists from setlists.
It combines Spotify and Setlist.fm APIs.
Built with React, TypeScript, and Vite.

This is a pet project, it has more bugs than the Amazon rainforest and there's no guarantee of fixes, updates or mainteinance :D
Use it at your own risk :)

## Features

- Search for artists and their setlists
- Create Spotify playlists from setlists
- Modern, responsive UI
- TypeScript for type safety

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- [Spotify Developer Account](https://developer.spotify.com/)
- [Setlist.fm Account](https://api.setlist.fm/docs/1.0/index.html)

## Project Structure

```
monorepo/
├── frontend/          # React + Vite application, takes care of Spotify API integration
│   ├── src/          # Source code
│   │   ├── app/      # Redux store and services
│   │   ├── components/ # React components
│   │   ├── hooks/    # Custom React hooks
│   │   └── assets/   # Static assets
│   └── public/       # Public assets
└── backend/          # Node.js + Express server, takes care of Setlist.fm API integration
    └── src/          # Source code
```

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   # Frontend
   cd monorepo/frontend
   npm install

   # Backend
   cd monorepo/backend
   npm install
   ```

3. Create environment files:
   - Frontend `.env`:
     ```
     VITE_SPOTIFY_CLIENT_ID=your_client_id
     VITE_APP_DOMAIN=http://localhost:5173
     VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
     ```
   - Backend `.env`:
     ```
     PORT=3000
     ```
4. Update your Spotify Developer Dashboard with the redirect URI

## Development

Run both servers:

```bash
# Terminal 1 - Frontend
cd monorepo/frontend
npm run dev

# Terminal 2 - Backend
cd monorepo/backend
npm run dev
```

## Building for Production

1. Create `.env.production` files with production values
2. Build both projects:

   ```bash
   # Frontend
   cd monorepo/frontend
   npm run build

   # Backend
   cd monorepo/backend
   npm run build
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
