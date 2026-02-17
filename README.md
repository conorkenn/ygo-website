# YGO Collection Website 🎴

A React website to view and manage your Yu-Gi-Oh! card collection.

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm start

# The app will open at http://localhost:3000
```

## API Server Required

This website requires the YGO CLI API server to be running:

```bash
cd ../ygo-cli
node dist/server.js
```

The API server should run on http://localhost:3000

## Features

- View your collection
- Add cards to collection
- Remove cards from collection
- See total collection value
- Card images from YGOPRODeck

## Tech Stack

- React + TypeScript
- CSS (simple styling)
- Calls YGO CLI API

## API Endpoints Used

- GET /api/collection
- POST /api/collection/add
- POST /api/collection/remove
