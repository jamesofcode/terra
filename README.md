# GenoQuiz - Geography Quiz Platform

A modern geography quiz platform built with **Vue 3**, **Vite**, and **Bootstrap 5**.

## Features

✨ **Four Interactive Game Modes:**
- 🗺️ **World Map Challenge**: Type all countries from an interactive SVG map
- 🏛️ **Capitals Quiz**: Test your knowledge of world capitals
- 🚩 **Flags Quiz**: Identify countries by their national flags
- 🌍 **Languages Quiz**: Name the languages spoken in each country

🎨 **Modern Dark Theme Design:**
- Minimalist aesthetic with electric blue accents
- Responsive Bootstrap 5 components

⚙️ **Advanced State Management:**
- Pinia store for tracking scores and progress
- Real-time REST Countries API integration
- Dynamic game routing

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will run on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Project Structure

```
terra/
├── src/
│   ├── main.js                 # Entry point
│   ├── App.vue                 # Root component
│   ├── router/
│   │   └── index.js            # Vue Router configuration
│   ├── stores/
│   │   └── gameStore.js        # Pinia state management
│   ├── views/
│   │   ├── HomeView.vue        # Home page with game selection
│   │   └── GameView.vue        # Game routing container
│   ├── components/
│   │   └── games/              # Individual game components
│   │       ├── WorldMapGame.vue
│   │       ├── CapitalsQuiz.vue
│   │       ├── FlagsQuiz.vue
│   │       └── LanguagesQuiz.vue
│   └── assets/
│       ├── styles/
│       │   └── theme.css       # Custom theme styles
│       └── world.svg           # SVG world map
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── package-lock.json           # Locked versions
```

## How to Play

### World Map Challenge
- Type country names in the input field
- Press Enter to submit each country
- Found countries appear in the list and highlight on the map
- Features pause/resume functionality and session timer

### Capitals Quiz
- Match capital cities to their countries
- 5 random countries per game session
- Get instant feedback on your answers
- Build your score with correct answers

### Flags Quiz
- Identify countries by their national emoji flags
- Multiple choice options provided
- 5 random countries per game session
- Test your flag recognition skills

### Languages Quiz
- Name one of the languages spoken in each country
- Accept any correct language from the country's language list
- 5 random countries per game session
- Learn about global linguistic diversity

## Technologies

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Framework**: Bootstrap 5
- **Styling**: Custom CSS
- **External API**: REST Countries API v3.1

## API Integration

All game data is sourced from the **REST Countries API** (`https://restcountries.com/v3.1/`):
- CapitalsQuiz: `?fields=name,capital`
- FlagsQuiz: `?fields=name,flag`
- LanguagesQuiz: `?fields=name,languages`

No backend server required - fully client-side application.

## Color Palette

- **Dark Background**: `#000000`
- **Dark Surface**: `#1a1a1a`
- **Accent Color**: `#00d4ff` (Electric Blue)
- **Success**: `#28a745`
- **Error**: `#dc3545`

## Deployment

### Prerequisites for Deployment
- Ensure all dependencies are installed: `npm install`
- Run production build: `npm run build`
- Test the build locally: `npm run preview`

### Deploy to Azure (Recommended)

Using Azure Static Web Apps or App Service:
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your Azure hosting service

## License

MIT
