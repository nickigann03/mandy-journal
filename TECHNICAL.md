# 💻 Technical Overview: Mandy's Virtual Scrapbook

This document details the architecture, state management, and technical design decisions for the Mandy's Journal app.

## 🏗️ Architecture

The app uses a modern React single-page application (SPA) architecture combined with a Convex real-time backend.

1. **Frontend:** React + Vite.
2. **Backend/Database:** Convex (`convex/schema.js`, `convex/items.js`). Convex is entirely responsible for real-time multiplayer state syncing. When a user drags a card, the backend updates the XY coordinates, and all connected clients instantly see the movement.

## 📂 Project Structure

- `src/App.jsx`: The root component. It handles the local `currentUser` state using `localStorage` and guards the main app with the `UserSetupModal`.
- `src/components/PinboardCanvas.jsx`: The core interactive workspace. It renders the giant grid, queries the Convex backend for `items`, and maps them to their respective UI Card components. It also manages the Floating Action Button (FAB) menu state for adding new items.
- `src/components/*Card.jsx`: Individual components (`NoteCard`, `PolaroidCard`, `MusicCard`, etc.). Each wraps its content in a `<Draggable>` wrapper to manage freeform movement across the board.
- `src/components/CreatorTag.jsx`: A helper component rendered inside every card to display the creator's avatar and name.
- `convex/`: Contains the database schema definitions and serverless mutations/queries.

## 💾 State Management

- **Global/Persistent State:** The actual items on the board (their types, positions, colors, content, and creators) are stored in the Convex database. React pulls this state via the `useQuery(api.items.get)` hook.
- **Local Ephemeral State:** `PinboardCanvas` uses `useState` strictly for UI interactions (e.g., whether the sticker picker menu is open, and managing the `placementMode` state for new item drops).
- **Session Identity & Authorization:** The user's chosen avatar and name are stored locally in the browser's `localStorage` (`mandy_journal_user`). This identity persists across sessions and is used for client-side authorization (e.g., users can only delete items that match their `creatorName`).

## 🎨 Styling & UX Techniques

- **Infinite Scrolling:** The body overflow is hidden, and `.pinboard-wrapper` manages scrolling across a massive virtual `3000px` high canvas (`.pinboard-canvas`), clamped horizontally to `100vw`.
- **Z-Index & Interactions:** `react-draggable` handles click-and-drag. Interactive elements (like buttons, textareas, or iframes) within the draggable components use the `cancel` prop so users can interact with them without dragging the whole card.
- **Manual Placement Mode:** When a user selects a new item from the FAB menu, they enter `placementMode`. A crosshair tracks their cursor (on desktop) and a toast overlay appears. The user can scroll freely and click anywhere on the canvas to spawn the item at those exact coordinates, avoiding cluttered auto-spawning.
- **Blend Modes:** The transparent sticker aesthetic for `.jpg/.png` stickers is achieved using the CSS `mix-blend-mode: multiply;` trick, which naturally subtracts white backgrounds against the canvas.
