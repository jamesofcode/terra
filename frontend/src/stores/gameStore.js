import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  const score = ref(0)
  const foundCountries = ref([])
  const gameType = ref(null)
  const timer = ref(0)
  const isGameActive = ref(false)

  const foundCountriesCount = computed(() => foundCountries.value.length)

  const addFoundCountry = (country) => {
    if (!foundCountries.value.includes(country)) {
      foundCountries.value.push(country)
      score.value += 10
    }
  }

  const removeFoundCountry = (country) => {
    const index = foundCountries.value.indexOf(country)
    if (index > -1) {
      foundCountries.value.splice(index, 1)
      score.value -= 10
    }
  }

  const setGameType = (type) => {
    gameType.value = type
    isGameActive.value = true
  }

  const resetGame = () => {
    score.value = 0
    foundCountries.value = []
    gameType.value = null
    timer.value = 0
    isGameActive.value = false
  }

  const incrementTimer = () => {
    if (isGameActive.value) {
      timer.value++
    }
  }

  return {
    score,
    foundCountries,
    gameType,
    timer,
    isGameActive,
    foundCountriesCount,
    addFoundCountry,
    removeFoundCountry,
    setGameType,
    resetGame,
    incrementTimer
  }
})
