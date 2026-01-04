<template>
  <div class="flags-quiz-container">
    <!-- Game Header -->
    <div class="card border-secondary bg-dark mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h3 class="mb-0">Flags Quiz</h3>
            <p class="text-muted mb-0">Identify these country flags</p>
          </div>
          <div class="col-md-6 text-end">
            <span class="fs-5 accent-text">Score: {{ gameStore.score }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Question -->
    <div class="card border-secondary bg-dark mb-4" v-if="currentQuestion && !isComplete">
      <div class="card-body text-center">
        <h4 class="mb-4">Which country does this flag belong to?</h4>
        
        <!-- Flag Display -->
        <div class="flag-display mb-4">
          <span class="flag-emoji" style="font-size: 120px;">{{ currentQuestion.flag }}</span>
        </div>

        <!-- Multiple Choice Options -->
        <div class="options mb-4">
          <button 
            v-for="(option, idx) in currentOptions"
            :key="idx"
            class="btn btn-outline-primary w-100 mb-2 option-btn"
            @click="submitAnswer(option)"
            :disabled="hasAnswered"
          >
            {{ option }}
          </button>
        </div>

        <!-- Feedback -->
        <div v-if="feedback" :class="['alert', feedbackClass, 'mt-3']">
          {{ feedback }}
        </div>

        <small class="text-muted d-block mt-3">
          Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
        </small>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="progress mb-4" style="height: 8px;">
      <div 
        class="progress-bar bg-primary" 
        :style="{ width: `${(currentQuestionIndex / questions.length) * 100}%` }"
      ></div>
    </div>

    <!-- Results -->
    <div class="card border-secondary bg-dark" v-if="isComplete">
      <div class="card-body text-center py-5">
        <h2 class="accent-text mb-3">Quiz Complete!</h2>
        <p class="fs-5 mb-3">Your Score: <span class="accent-text fw-bold">{{ gameStore.score }}</span></p>
        <p class="text-muted mb-4">{{ correctAnswers }} out of {{ questions.length }} correct</p>
        <router-link to="/" class="btn btn-primary">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../../stores/gameStore'

const gameStore = useGameStore()

const questions = ref([])
const currentQuestionIndex = ref(0)
const feedback = ref('')
const feedbackClass = ref('')
const correctAnswers = ref(0)
const isComplete = ref(false)
const hasAnswered = ref(false)

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const currentOptions = computed(() => {
  if (!currentQuestion.value) return []
  return currentQuestion.value.options.sort(() => Math.random() - 0.5)
})

const submitAnswer = (answer) => {
  hasAnswered.value = true
  const correct = answer === currentQuestion.value.country

  if (correct) {
    feedback.value = `✓ Correct! That is the flag of ${currentQuestion.value.country}.`
    feedbackClass.value = 'alert-success'
    correctAnswers.value++
    gameStore.addFoundCountry(currentQuestion.value.country)
  } else {
    feedback.value = `✗ Incorrect. The correct answer is ${currentQuestion.value.country}.`
    feedbackClass.value = 'alert-danger'
  }

  setTimeout(() => {
    nextQuestion()
  }, 1500)
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    feedback.value = ''
    hasAnswered.value = false
  } else {
    isComplete.value = true
  }
}

const generateQuestions = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flag')
    const countries = await response.json()
    
    // Shuffle and select 5 random countries for questions
    const shuffled = countries.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 5)
    
    // Create a pool of all country names for random options
    const allCountryNames = countries.map(c => c.name.common)
    
    questions.value = selected.map(country => {
      // Get 3 random wrong answers from all countries (excluding the correct answer)
      const wrongAnswers = allCountryNames
        .filter(name => name !== country.name.common)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
      
      return {
        country: country.name.common,
        flag: country.flag,
        options: [country.name.common, ...wrongAnswers]
      }
    })
    
    // Questions generated
  } catch (error) {
    // Handle API error silently
  }
}

onMounted(() => {
  gameStore.setGameType('flags')
  generateQuestions()
})
</script>

<style scoped>
.accent-text {
  color: #00d4ff;
}

.flag-emoji {
  display: inline-block;
  line-height: 1;
}

.option-btn {
  border-color: #333;
  color: #00d4ff;
  transition: all 0.2s ease;
}

.option-btn:hover:not(:disabled) {
  background-color: #00d4ff;
  color: #000;
  border-color: #00d4ff;
}

.option-btn:disabled {
  opacity: 0.6;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
