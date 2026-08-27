# Social Network

A responsive social-network application built with React and TypeScript. Users can
register and sign in, browse an infinitely loaded post feed, create and interact
with posts, view profiles, and exchange messages through the chat interface.

## Features

- Email and password registration, login, logout, and session restoration
- Infinite-scrolling posts feed and individual post pages
- Post creation, editing, deletion, reposting, likes, and comments
- User profiles with posts, comments, profile editing, and profile sharing
- Messages page and chat widget
- Optional echo chat connection through `wss://ws.ifelse.io`
- Responsive layouts for mobile, tablet, and desktop

## Technology stack

- React 19 and TypeScript
- Vite
- TanStack Router with file-based routing
- TanStack Query for Firestore server state
- Firebase Authentication and Cloud Firestore
- MobX for client-side state
- Shadcn UI, Radix UI, and Tailwind CSS
- Vitest and Testing Library
- ESLint and Prettier

## Setup

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/omeredova/social-network.git
   cd social-network
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

4. Fill `.env` with the Firebase web-app configuration values:

   ```dotenv
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```

   Variables prefixed with `VITE_` are included in the browser bundle. Do not put
   Firebase Admin credentials, service-account keys, or other private secrets in
   these variables.

5. Start the development server:

   ```bash
   npm run dev
   ```

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` and check TypeScript |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks without emitting files |
| `npm test` | Run the test suite once |
| `npm run format` | Format the project with Prettier |
| `npm run format:check` | Check formatting without modifying files |

## Deployment links

- Vercel project: To be added
- Repository: https://github.com/omeredova/social-network

## Project architecture

The source follows Feature-Sliced Design:

```text
src/
├── app/       # Application initialization, providers, router, and global styles
├── pages/     # Route-level pages
├── widgets/   # Large reusable interface blocks
├── features/  # User actions and business features
├── entities/  # Domain models, data access, and entity UI
└── shared/    # Shared configuration, utilities, types, and UI components
```

TanStack Query owns remote Firestore state, while MobX is used for client-only
application and interface state. Firebase access and WebSocket lifecycle logic are
kept outside presentational components.