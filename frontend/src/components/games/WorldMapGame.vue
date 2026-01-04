<template>
  <div class="world-map-container">
    <!-- Game Header -->
    <div class="card border-secondary bg-dark mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h3 class="mb-0">World Map Challenge</h3>
            <p class="text-muted mb-0">Type all the countries from the map</p>
          </div>
          <div class="col-md-6 text-end">
            <div class="row">
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
          </div>
        </div>
      </div>
    </div>

    <!-- Input Section -->
    <div class="card border-secondary bg-dark mb-4">
      <div class="card-body">
        <div class="input-group">
          <input 
            v-model="countryInput" 
            @keypress.enter="handleCountrySubmit"
            type="text" 
            class="form-control form-control-dark" 
            placeholder="Type a country name and press Enter..."
            autocomplete="off"
          />
        </div>
        <div v-if="inputError" class="text-danger mt-2 small">
          {{ inputError }}
        </div>
      </div>
    </div>

    <!-- SVG Map Container -->
    <div class="card border-secondary bg-dark mb-4">
      <div class="card-body svg-container">
        <svg 
          class="world-map" 
          viewBox="0 0 960 600"
          ref="mapSvg"
        />
      </div>
    </div>

    <!-- Found Countries List -->
    <div class="card border-secondary bg-dark mb-4">
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
    <div v-if="isGameComplete" class="card border-success bg-dark mb-4">
      <div class="card-body text-center">
        <h5 class="text-success mb-2">🎉 Congratulations!</h5>
        <p class="mb-0 text-muted">You found all {{ totalCountries }} countries in {{ formatTime(timer) }}</p>
      </div>
    </div>

    <!-- Instructions -->
    <div class="card border-secondary bg-dark">
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'

const gameStore = useGameStore()
const mapSvg = ref(null)
const countryInput = ref('')
const inputError = ref('')
const timer = ref(0)
const allCountries = ref([])
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

const handleCountrySubmit = () => {
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
    const response = await fetch(new URL('../../assets/world.svg', import.meta.url).href)
    const svgText = await response.text()
    
    if (mapSvg.value) {
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
      const importedSvg = svgDoc.documentElement
      
      // Extract country names from SVG path titles
      const countries = new Set()
      importedSvg.querySelectorAll('path').forEach(path => {
        const title = path.getAttribute('title')
        if (title) {
          countries.add(title)
        }
      })
      allCountries.value = Array.from(countries).sort()
      
      // Clear and append
      mapSvg.value.innerHTML = ''
      while (importedSvg.firstChild) {
        mapSvg.value.appendChild(importedSvg.firstChild)
      }
      
      // Update visuals for already found countries
      updateMapVisuals()
    }
  } catch (error) {
    console.error('Error loading map SVG:', error)
  }
}

onMounted(() => {
  gameStore.setGameType('world-map')
  loadMapSvg()
  
  // Start timer
  timerInterval = setInterval(() => {
    timer.value++
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
