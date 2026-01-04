<template>
  <div class="container-fluid px-4">
    <div class="row mb-4">
      <div class="col-12">
        <router-link to="/" class="btn btn-outline-secondary btn-sm">
          ← Back to Home
        </router-link>
      </div>
    </div>

    <!-- Game Container -->
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- World Map Game -->
        <WorldMapGame v-if="type === 'world-map'" :key="`map-${gameKey}`" />
        
        <!-- Capitals Quiz -->
        <CapitalsQuiz v-else-if="type === 'capitals'" :key="`capitals-${gameKey}`" />
        
        <!-- Flags Quiz -->
        <FlagsQuiz v-else-if="type === 'flags'" :key="`flags-${gameKey}`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import WorldMapGame from '../components/games/WorldMapGame.vue'
import CapitalsQuiz from '../components/games/CapitalsQuiz.vue'
import FlagsQuiz from '../components/games/FlagsQuiz.vue'

const props = defineProps({
  type: String
})

const gameKey = ref(0)

watch(() => props.type, () => {
  gameKey.value++
})
</script>

<style scoped>
</style>
