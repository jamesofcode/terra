<template>
  <div class="capitals-quiz-container">
    <!-- Game Header -->
    <div class="card border-secondary bg-dark mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h3 class="mb-0">Capitals Quiz</h3>
            <p class="text-muted mb-0">Name the capitals of these countries</p>
          </div>
          <div class="col-md-6 text-end">
            <span class="fs-5 accent-text">Score: {{ gameStore.score }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Question -->
    <div class="card border-secondary bg-dark mb-4" v-if="currentQuestion">
      <div class="card-body text-center">
        <h4 class="mb-4">What is the capital of {{ currentQuestion.country }}?</h4>
        <div class="input-group input-group-lg mb-3">
          <input 
            type="text" 
            class="form-control bg-secondary border-0 text-light"
            v-model="userAnswer"
            @keyup.enter="submitAnswer"
            placeholder="Type your answer..."
            autofocus
          />
          <button class="btn btn-primary" @click="submitAnswer">Submit</button>
        </div>
        
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

    <!-- Results (when complete) -->
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
const userAnswer = ref('')
const feedback = ref('')
const feedbackClass = ref('')
const correctAnswers = ref(0)
const isComplete = ref(false)

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const submitAnswer = () => {
  const correct = userAnswer.value.toLowerCase().trim() === currentQuestion.value.capital.toLowerCase()
  
  if (correct) {
    feedback.value = `✓ Correct! ${currentQuestion.value.capital} is the capital of ${currentQuestion.value.country}.`
    feedbackClass.value = 'alert-success'
    correctAnswers.value++
    gameStore.addFoundCountry(currentQuestion.value.country)
  } else {
    feedback.value = `✗ Incorrect. The correct answer is ${currentQuestion.value.capital}.`
    feedbackClass.value = 'alert-danger'
  }

  setTimeout(() => {
    nextQuestion()
  }, 1500)
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    userAnswer.value = ''
    feedback.value = ''
  } else {
    isComplete.value = true
  }
}

const generateQuestions = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital')
    const countries = await response.json()
    
    // Filter countries that have capitals
    const countriesWithCapitals = countries.filter(c => c.capital && c.capital.length > 0)
    
    // Shuffle and select 5 random countries
    const shuffled = countriesWithCapitals.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 5)
    
    questions.value = selected.map(country => ({
      country: country.name.common,
      capital: country.capital[0]
    }))
  } catch (error) {
    // Handle API error silently
  }
}

onMounted(() => {
  gameStore.setGameType('capitals')
  generateQuestions()
})
</script>

<style scoped>
.accent-text {
  color: #00d4ff;
}

.form-control:focus {
  background-color: #1a1a1a !important;
  color: #fff !important;
  border-color: #00d4ff !important;
  box-shadow: 0 0 0 0.2rem rgba(0, 212, 255, 0.25);
}

.btn-primary {
  background-color: #00d4ff;
  border-color: #00d4ff;
  color: #000;
}

.btn-primary:hover {
  background-color: #00e5ff;
  border-color: #00e5ff;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
