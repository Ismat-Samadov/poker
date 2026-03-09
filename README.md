# 🃏 PokerNeon — Texas Hold'em

A fully-featured, neon-themed Texas Hold'em poker game built with **Next.js 16**, **TypeScript**, and **Tailwind CSS 4**. Play against a strategic AI opponent with three difficulty tiers, smooth animations, and procedurally generated sound effects.

---

## Features

- **Full Texas Hold'em rules** — Pre-flop, Flop, Turn, River, Showdown
- **Complete hand evaluation** — Royal Flush through High Card, all tie-breaker logic
- **Three AI difficulty tiers**
  - Easy — random play, mostly calls, occasional raises
  - Medium — pot-odds aware, occasional bluffs
  - Hard — position play, semi-bluffing, re-raises, value bets
- **Betting actions** — Fold, Check, Call, Raise (slider), All-In
- **Chip progression** — game ends when one player is bust
- **Persistent high score** via `localStorage`
- **Procedural sound effects** via Web Audio API (no audio files required)
- **Sound on/off toggle**
- **Pause / Resume**
- **Framer Motion animations** — card deals, flip reveals, UI transitions
- **Neon glassmorphism theme** — dark navy background, cyan/purple/gold accents
- **Fully responsive** — desktop, tablet, and mobile
- **Touch-friendly controls** — on-screen action buttons
- **Themed SVG favicon**
- **Vercel-ready** — zero extra configuration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 12 |
| Sound | Web Audio API (procedural) |
| State | React `useReducer` + custom hook |
| Storage | `localStorage` (high score) |
| Deploy | Vercel |

---

## Controls

### Desktop (keyboard + mouse)
| Action | Control |
|---|---|
| Fold | Click **Fold** button |
| Check | Click **Check** button |
| Call | Click **Call** button |
| Raise | Click **Raise** → adjust slider → click again |
| All-In | Click **All In** button |
| Pause | Click **⏸** in the top bar |
| Mute | Click **🔊** in the top bar |

### Mobile (touch)
All controls are large, touch-friendly on-screen buttons. The game is fully playable on phones and tablets with no horizontal scrolling.

---

## How to Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone / navigate to the project
cd poker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build for Production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

**Option A — Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option B — GitHub Integration**
1. Push the repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Click **Deploy** — no extra configuration needed

The project auto-detects as Next.js and builds with zero config.

---

## Project Structure

```
poker/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Entry point (menu ↔ game routing)
│   ├── globals.css         # Tailwind + custom global styles
│   └── favicon.svg         # Themed neon card favicon
├── components/
│   ├── game/
│   │   ├── Card.tsx            # Animated playing card (flip effect)
│   │   ├── CommunityCards.tsx  # Flop/Turn/River display
│   │   ├── PlayerHand.tsx      # Hole cards + player info panel
│   │   ├── PotDisplay.tsx      # Animated pot counter
│   │   ├── BettingControls.tsx # Fold/Check/Call/Raise/AllIn buttons
│   │   ├── EndScreen.tsx       # Round/game result overlay
│   │   └── GameBoard.tsx       # Main game layout orchestrator
│   └── screens/
│       └── StartScreen.tsx     # Main menu with difficulty selection
├── hooks/
│   └── usePokerGame.ts     # All game state, AI orchestration, timing
├── lib/
│   ├── deck.ts             # Deck creation, shuffling, dealing
│   ├── handEvaluator.ts    # Full 7-card hand evaluation + AI strength estimate
│   ├── aiPlayer.ts         # Three-tier AI decision engine
│   └── sounds.ts           # Web Audio API procedural sound effects
└── types/
    └── poker.ts            # TypeScript type definitions
```

---

## Game Rules (Quick Reference)

- Each player starts with **1,000 chips**; Big Blind = 20, Small Blind = 10
- Dealer rotates each round (dealer = small blind in heads-up)
- Betting order: Small blind acts first pre-flop, Big blind acts first post-flop
- Showdown evaluates the best **5-card hand** from 2 hole cards + 5 community cards
- First player to **bust the opponent** wins the game

Hand rankings (best → worst): Royal Flush, Straight Flush, Four of a Kind, Full House, Flush, Straight, Three of a Kind, Two Pair, Pair, High Card
