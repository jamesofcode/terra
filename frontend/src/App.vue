<template>
  <div id="app" class="bg-dark text-light min-vh-100">
    <!-- Navigation Bar -->
    <nav class="navbar navbar-dark bg-black border-bottom border-secondary sticky-top">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand fw-bold">
          <span class="accent-color">Geno</span>Quiz
        </router-link>
        <span class="badge bg-primary" v-if="currentScore">Score: {{ currentScore }}</span>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="py-4">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-black border-top border-secondary text-center py-3 mt-5">
      <p class="text-muted mb-0">&copy; 2026 GenoQuiz. Test your geography knowledge.</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from './stores/gameStore'

const gameStore = useGameStore()
const currentScore = computed(() => gameStore.score)
</script>

<style scoped>
.accent-color {
  color: #00d4ff;
}

:deep(.navbar) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

main {
  background: linear-gradient(135deg, #000000 0%, #121212 100%);
  min-height: calc(100vh - 200px);
}
</style>
