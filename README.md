# 🌸 Mandy's Virtual Scrapbook

Welcome to **Mandy's Virtual Scrapbook**! This is a beautiful, interactive, and fully collaborative infinite-canvas journaling app designed to let friends and loved ones pin memories, leave cute notes, and share media together in real-time.

## ✨ Features

- **Infinite Drag-and-Drop Canvas:** A massive vertical corkboard to arrange memories exactly how you want them.
- **Manual Placement Mode:** When adding new items, enter a "stamp mode" that lets you scroll and tap exactly where you want the item to appear!
- **Collaborative Identity & Security:** Choose a cute emoji avatar (🐨, 🦊, 🐰, etc.) and a name. Every item you add gets a tiny customized signature tag at the bottom! Plus, users can only delete items that they created.
- **Rich Media Cards:** 
  - 📝 **Sticky Notes:** Write sweet messages on customizable, colorful sticky notes (with pushpins!).
  - 📸 **Polaroids:** Upload images into beautiful framed polaroids.
  - 💌 **Open When Envelopes:** Leave secret messages hidden inside interactive fold-out envelopes.
  - 💐 **Virtual Bouquets:** Gift gorgeous floral bouquets that drop animated petals when clicked.
  - 🎵 **Music Cards:** Embed Spotify or YouTube links to share your favorite songs.
  - 🎤 **Voice Notes & 📹 Video Clips:** Add custom audio and video memories.
  - ✨ **Stickers:** Decorate the board with cute, hand-drawn stickers!

## 🚀 Getting Started

To run this project locally, you will need [Node.js](https://nodejs.org/) installed.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Convex backend:**
   Convex powers the real-time multiplayer database.
   ```bash
   npx convex dev
   ```

3. **Start the Vite frontend server:**
   (In a separate terminal window)
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Visit `http://localhost:5173` in your browser.

## 🛠️ Built With

- **[React](https://reactjs.org/)** (Vite) - Frontend Framework
- **[Convex](https://convex.dev/)** - Real-time Database & Backend
- **[React Draggable](https://github.com/react-grid-layout/react-draggable)** - For smooth element dragging
- **[Lucide React](https://lucide.dev/)** - Beautiful iconography
