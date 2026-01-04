<template>
  <div class="container-fluid px-4">
    <!-- Hero Section -->
    <div class="row py-5 mb-5 text-center">
      <div class="col-lg-12">
        <h1 class="display-4 fw-bold mb-3">
          <span class="accent-text">GenoQuiz</span>
        </h1>
        <p class="lead text-muted">Master the world's geography with our interactive quiz games</p>
      </div>
    </div>

    <!-- Call-to-Action -->
    <div class="row mb-5 justify-content-center">
      <div class="col-lg-8">
        <div class="alert alert-info bg-secondary border-0 text-center py-4">
          <h4 class="mb-2">Ready to challenge yourself?</h4>
          <p class="mb-0 text-muted">Scroll down to select a game and begin your geography adventure.</p>
        </div>
      </div>
    </div>

    <!-- Game Selection Grid -->
    <div class="row g-4 mb-5">
      <div class="col-md-6 col-lg-4" v-for="game in games" :key="game.id">
        <div class="card game-card h-100 border-secondary bg-dark">
          <div class="card-body d-flex flex-column">
            <div class="game-icon mb-3 text-center">
              <i :class="game.icon" class="fs-1 accent-text"></i>
            </div>
            <h5 class="card-title text-center">{{ game.name }}</h5>
            <p class="card-text text-muted flex-grow-1">{{ game.description }}</p>
            <div class="d-grid mt-3">
              <router-link 
                :to="`/game/${game.type}`" 
                class="btn btn-outline-primary accent-btn"
                @click="startGame(game.type)"
              >
                Play Game
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="row py-5 border-top border-secondary">
      <div class="col-md-4 text-center mb-4">
        <h6 class="text-uppercase accent-text mb-2">🌍 Global Coverage</h6>
        <p class="text-muted">Quiz on countries, capitals, and flags from around the world.</p>
      </div>
      <div class="col-md-4 text-center mb-4">
        <h6 class="text-uppercase accent-text mb-2">⚡ Interactive Maps</h6>
        <p class="text-muted">Click on maps to identify countries and test your knowledge.</p>
      </div>
      <div class="col-md-4 text-center mb-4">
        <h6 class="text-uppercase accent-text mb-2">📊 Track Progress</h6>
        <p class="text-muted">Monitor your score and improve your geography skills over time.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const games = ref([
  {
    id: 1,
    name: 'World Countries',
    type: 'world-map',
    icon: 'bi bi-globe2',
    description: 'Click on countries on the map to identify them correctly. A challenging way to test your world geography.'
  },
  {
    id: 2,
    name: 'Capitals Quiz',
    type: 'capitals',
    icon: 'bi bi-building',
    description: 'Given a country name, guess its capital. Perfect for learning major world capitals.'
  },
  {
    id: 3,
    name: 'Flags Quiz',
    type: 'flags',
    icon: 'bi bi-flag',
    description: 'Identify countries by their flags. Test your knowledge of national symbols.'
  }
])

const startGame = (type) => {
  gameStore.setGameType(type)
}
</script>

<style scoped>
.accent-text {
  color: #00d4ff;
  font-weight: 700;
}

.game-card {
  transition: all 0.3s ease;
  border: 1px solid #333;
}

.game-card:hover {
  border-color: #00d4ff;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 212, 255, 0.15);
}

.accent-btn {
  border-color: #00d4ff;
  color: #00d4ff;
  transition: all 0.3s ease;
}

.accent-btn:hover {
  background-color: #00d4ff;
  color: #000;
  border-color: #00d4ff;
}

.game-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
