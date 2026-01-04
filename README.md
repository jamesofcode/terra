# GenoQuiz - Geography Quiz Platform

A modern geography quiz platform built with **Vue 3**, **Vite**, and **Bootstrap 5**.

## Features

✨ **Three Interactive Game Modes:**
- 🗺️ **World Map Challenge**: Type all countries from an interactive SVG map
- 🏛️ **Capitals Quiz**: Test your knowledge of world capitals
- 🚩 **Flags Quiz**: Identify countries by their national flags

🎨 **Modern Dark Theme Design:**
- Minimalist aesthetic with electric blue accents
- Responsive Bootstrap 5 components

⚙️ **Advanced State Management:**
- Pinia store for tracking scores and progress
- Timer functionality for each game session
- Persistent user progress

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will run on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── main.js              # Entry point
│   ├── App.vue              # Root component
│   ├── router/              # Vue Router configuration
│   ├── stores/              # Pinia state management
│   ├── views/               # Page components
│   ├── components/          # Game components
│   └── assets/              # Styles and images
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## How to Play

### World Map Challenge
- Type country names in the input field
- Press Enter to submit each country
- Found countries appear in the list and highlight on the map
- Complete by finding all countries

### Capitals Quiz
- Match capital cities to their countries
- Get instant feedback on your answers
- Build your score with correct answers

### Flags Quiz
- Identify countries by their national flags
- Multiple choice options provided
- Test your flag recognition skills

## Technologies

- **Frontend**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Framework**: Bootstrap 5
- **Styling**: Custom CSS

## Color Palette

- **Dark Background**: `#000000`
- **Dark Surface**: `#1a1a1a`
- **Accent Color**: `#00d4ff` (Electric Blue)

## License

MIT
