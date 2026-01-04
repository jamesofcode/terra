<template>
  <div class="world-map-container">
    <!-- Start Screen -->
    <div v-if="!isGameStarted" class="card border-info bg-dark mb-4">
      <div class="card-body text-center">
        <h2 class="text-info mb-3">🗺️ World Map Challenge</h2>
        <p class="text-muted mb-4">Type all the countries from the map to complete the challenge!</p>
        <div class="mb-4">
          <p class="text-muted small">
            <strong>Objective:</strong> Name all {{ allCountries.length }} countries on the world map.<br>
            <strong>How to Play:</strong> Type country names in the input field and press Enter.
          </p>
        </div>
        <button 
          @click="startGame"
          class="btn btn-lg btn-success"
        >
          ▶ Start Game
        </button>
      </div>
    </div>

    <!-- Game Content (only show after game starts) -->
    <div v-if="isGameStarted && !isGameEnded">
    <div class="card border-secondary bg-dark mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h3 class="mb-0">World Map Challenge</h3>
            <p class="text-muted mb-0">Type all the countries from the map</p>
          </div>
          <div class="col-md-6 text-end">
            <div class="row mb-3">
              <div class="col-6">
                <div class="text-center">
                  <small class="text-muted d-block">Time</small>
                  <span class="fs-5 accent-text">{{ formatTime(timer) }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="text-center">
                  <small class="text-muted d-block">Found</small>
                  <span class="fs-5 accent-text">{{ foundCountriesCount }}/{{ totalCountries }}</span>
                </div>
              </div>
            </div>
            <div class="btn-group w-100" role="group">
              <button 
                @click="togglePause"
                :class="['btn btn-sm', isPaused ? 'btn-success' : 'btn-warning']"
              >
                {{ isPaused ? '▶ Resume' : '⏸ Pause' }}
              </button>
              <button 
                @click="endGame"
                class="btn btn-sm btn-danger"
              >
                End Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Section -->
    <div class="card border-secondary bg-dark mb-4" v-if="!isGameEnded">
      <div class="card-body">
        <div class="input-group">
          <input 
            v-model="countryInput" 
            @keypress.enter="handleCountrySubmit"
            type="text" 
            class="form-control form-control-dark" 
            placeholder="Type a country name and press Enter..."
            autocomplete="off"
            :disabled="isPaused || isGameEnded"
          />
        </div>
        <div v-if="inputError" class="text-danger mt-2 small">
          {{ inputError }}
        </div>
      </div>
    </div>

    <!-- Pause Message -->
    <div v-if="isPaused && !isGameEnded" class="card border-warning bg-dark mb-4">
      <div class="card-body text-center">
        <h5 class="text-warning mb-2">⏸ Game Paused</h5>
        <p class="mb-0 text-muted">Click Resume to continue playing</p>
      </div>
    </div>

    <!-- SVG Map Container -->
    <div class="card border-secondary bg-dark mb-4">
      <div class="card-body svg-container">
        <div ref="mapSvg" class="svg-map-wrapper"></div>
      </div>
    </div>

    <!-- Found Countries List -->
    <div v-if="!isGameEnded" class="card border-secondary bg-dark mb-4">
      <div class="card-body">
        <h6 class="mb-3">Found Countries ({{ foundCountriesCount }}/{{ totalCountries }})</h6>
        <div class="countries-grid">
          <div 
            v-for="country in gameStore.foundCountries" 
            :key="country"
            class="country-badge found"
          >
            {{ country }}
          </div>
        </div>
      </div>
    </div>

    <!-- Game Complete Message -->
    <div v-if="isGameComplete && !isGameEnded" class="card border-success bg-dark mb-4">
      <div class="card-body text-center">
        <h5 class="text-success mb-2">🎉 Congratulations!</h5>
        <p class="mb-0 text-muted">You found all {{ totalCountries }} countries in {{ formatTime(timer) }}</p>
      </div>
    </div>

    <!-- Instructions -->
    <div v-if="!isGameEnded" class="card border-secondary bg-dark">
      <div class="card-body">
        <h6 class="mb-2">How to Play:</h6>
        <ul class="mb-0 text-muted small">
          <li>Type country names in the input field</li>
          <li>Press Enter to submit each country</li>
          <li>Found countries will appear in the list and turn <span class="accent-text">cyan</span> on the map</li>
          <li>Type all countries to complete the challenge!</li>
        </ul>
      </div>
    </div>
    </div>

    <!-- Game Results Modal -->
    <div v-if="isGameEnded" class="card border-info bg-dark mb-4">
      <div class="card-body">
        <h4 class="text-info mb-4 text-center">📊 Game Results</h4>
        
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="text-center">
              <small class="text-muted d-block">Countries Found</small>
              <h3 class="accent-text">{{ foundCountriesCount }}/{{ totalCountries }}</h3>
            </div>
          </div>
          <div class="col-md-6">
            <div class="text-center">
              <small class="text-muted d-block">Time Played</small>
              <h3 class="accent-text">{{ formatTime(timer) }}</h3>
            </div>
          </div>
        </div>

        <div class="progress mb-4">
          <div 
            class="progress-bar bg-info" 
            :style="{ width: (foundCountriesCount / totalCountries * 100) + '%' }"
          >
            {{ Math.round(foundCountriesCount / totalCountries * 100) }}%
          </div>
        </div>

        <!-- Found Countries -->
        <div class="mb-4">
          <h6 class="text-success mb-2">✓ Found Countries ({{ foundCountriesCount }})</h6>
          <div class="countries-grid">
            <div 
              v-for="country in gameStore.foundCountries" 
              :key="country"
              class="country-badge found"
            >
              {{ country }}
            </div>
          </div>
        </div>

        <!-- Missed Countries -->
        <div class="mb-4" v-if="getMissedCountries().length > 0">
          <h6 class="text-danger mb-2">✗ Missed Countries ({{ getMissedCountries().length }})</h6>
          <div class="countries-grid">
            <div 
              v-for="country in getMissedCountries()" 
              :key="country"
              class="country-badge missed"
            >
              {{ country }}
            </div>
          </div>
        </div>

        <div class="text-center">
          <button 
            @click="restartGame"
            class="btn btn-success me-2"
          >
            🔄 Restart Game
          </button>
          <router-link to="/" class="btn btn-primary">Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import worldSvgText from '../../assets/world.svg?raw'

const gameStore = useGameStore()
const mapSvg = ref(null)
const countryInput = ref('')
const inputError = ref('')
const timer = ref(0)
const allCountries = ref([])
const isPaused = ref(false)
const isGameEnded = ref(false)
const isGameStarted = ref(false)
let timerInterval = null

const totalCountries = computed(() => allCountries.value.length)
const foundCountriesCount = computed(() => gameStore.foundCountries.length)
const isGameComplete = computed(() => foundCountriesCount.value === totalCountries.value)

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  const pad = (num) => String(num).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const endGame = () => {
  isGameEnded.value = true
  if (timerInterval) clearInterval(timerInterval)
}

const startGame = () => {
  isGameStarted.value = true
  // Load SVG after game starts and DOM is ready
  setTimeout(() => {
    loadMapSvg()
  }, 0)
}

const restartGame = () => {
  // Reset game state
  isGameStarted.value = false
  isGameEnded.value = false
  isPaused.value = false
  timer.value = 0
  countryInput.value = ''
  inputError.value = ''
  
  // Clear found countries from store
  gameStore.foundCountries = []
}

const handleCountrySubmit = () => {
  if (isPaused.value || isGameEnded.value) return
  
  const input = countryInput.value.trim()
  inputError.value = ''
  
  if (!input) {
    return
  }
  
  // Find matching country (case-insensitive)
  const matchedCountry = allCountries.value.find(
    country => country.toLowerCase() === input.toLowerCase()
  )
  
  if (!matchedCountry) {
    inputError.value = `"${input}" not found. Check spelling and try again.`
    return
  }
  
  if (gameStore.foundCountries.includes(matchedCountry)) {
    inputError.value = `You already found ${matchedCountry}!`
    return
  }
  
  // Add the country
  gameStore.addFoundCountry(matchedCountry)
  countryInput.value = ''
  updateMapVisuals()
}

const isCountryFound = (country) => {
  return gameStore.foundCountries.includes(country)
}

const getMissedCountries = () => {
  return allCountries.value.filter(country => !isCountryFound(country))
}

const updateMapVisuals = () => {
  if (mapSvg.value) {
    mapSvg.value.querySelectorAll('path').forEach(path => {
      const countryName = path.getAttribute('title')
      if (countryName && isCountryFound(countryName)) {
        path.classList.add('found')
      } else if (countryName) {
        path.classList.remove('found')
      }
    })
  }
}

const loadMapSvg = async () => {
  try {
    // Use the imported SVG text directly
    const svgText = worldSvgText
    console.log('SVG loaded from import, length:', svgText.length)
    
    if (mapSvg.value) {
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
      
      // Check for parsing errors
      if (svgDoc.documentElement.tagName === 'parsererror') {
        throw new Error('Failed to parse SVG')
      }
      
      const importedSvg = svgDoc.documentElement
      console.log('SVG parsed, tag:', importedSvg.tagName, 'paths found:', importedSvg.querySelectorAll('path').length)
      
      // Add world-map class to SVG for styling
      importedSvg.classList.add('world-map')
      
      // Extract country names from SVG path titles
      const countries = new Set()
      importedSvg.querySelectorAll('path').forEach(path => {
        const title = path.getAttribute('title')
        if (title) {
          countries.add(title)
        }
      })
      allCountries.value = Array.from(countries).sort()
      console.log('Countries extracted:', allCountries.value.length)
      
      // Clear and append
      mapSvg.value.innerHTML = ''
      mapSvg.value.appendChild(importedSvg)
      console.log('SVG appended to DOM')
      
      // Update visuals for already found countries
      updateMapVisuals()
    }
  } catch (error) {
    console.error('Error loading map SVG:', error)
  }
}

onMounted(() => {
  gameStore.setGameType('world-map')
  
  // Start timer with pause support
  timerInterval = setInterval(() => {
    if (!isPaused.value && !isGameEnded.value) {
      timer.value++
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.accent-text {
  color: #00d4ff;
}

.svg-container {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: auto;
}

.svg-map-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.world-map {
  width: 100%;
  height: auto;
  min-height: 400px;
  border: 1px solid #333;
  border-radius: 0.25rem;
  background: #0a0a0a;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.form-control-dark {
  background-color: #1a1a1a;
  border-color: #444;
  color: #fff;
}

.form-control-dark:focus {
  background-color: #1a1a1a;
  border-color: #00d4ff;
  color: #fff;
  box-shadow: 0 0 0 0.2rem rgba(0, 212, 255, 0.25);
}

.form-control-dark::placeholder {
  color: #888;
}

.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
}

.country-badge {
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #444;
  border-radius: 0.25rem;
  background: #0a0a0a;
  color: #999;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.country-badge.found {
  background: #00d4ff;
  color: #000;
  border-color: #0099cc;
  font-weight: bold;
}

.country-badge.missed {
  background: #1a1a1a;
  color: #ff6b6b;
  border-color: #cc3333;
  font-weight: bold;
  opacity: 0.7;
}
</style>

<style>
/* SVG Path Styling */
.world-map path {
  fill: #1a1a1a;
  stroke: #444;
  stroke-width: 0.5px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.world-map path:hover,
.world-map path.hovered {
  fill: #333;
  stroke: #666;
  filter: brightness(1.2);
}

.world-map path.found {
  fill: #00d4ff;
  stroke: #0099cc;
  stroke-width: 1.5px;
}

.world-map path.found:hover,
.world-map path.found.hovered {
  fill: #00e5ff;
  stroke: #00aadd;
  filter: brightness(1.1);
}
</style>
