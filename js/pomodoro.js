// Button elements
const startBtn = document.querySelector('.control__btn-start')
const stopBtn = document.querySelector('.control__btn-stop')
const resetBtn = document.querySelector('.control__btn-reset')

// Mode buttons
const workBtn = document.querySelector('button[data-use="work"]')
const breakBtn = document.querySelector('button[data-use="break"]')
const relaxBtn = document.querySelector('button[data-use="relax"]')

// Timer display
const minutesEl = document.querySelector('.time__minutes')
const secondsEl = document.querySelector('.time__seconds')

// Durations in seconds
const WORK_TIME = 25 * 60
const BREAK_TIME = 5 * 60
const RELAX_TIME = 15 * 60

let remainingTime = WORK_TIME

let timerInterval = null

function updateDisplay(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60
  minutesEl.textContent = String(minutes).padStart(2, '0')
  secondsEl.textContent = String(seconds).padStart(2, '0')
}

function startTimer() {
  if (timerInterval) return

  timerInterval = setInterval(() => {
    remainingTime--
    updateDisplay(remainingTime)

    if (remainingTime <= 0) {
      clearInterval(timerInterval)
      timerInterval = null
      remainingTime = 0
      updateDisplay(remainingTime)
    }
  }, 1000)
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resetTimer() {
  pauseTimer()
  remainingTime = WORK_TIME
  updateDisplay(remainingTime)
}

// ----- Mode Switchers -----

function setWorkTimer() {
  pauseTimer()
  remainingTime = WORK_TIME
  updateDisplay(remainingTime)
}

// 2) Перерыв (5 min)
function setBreakTimer() {
  pauseTimer()
  remainingTime = BREAK_TIME
  updateDisplay(remainingTime)
}

// 3) Отдых (15 min)
function setRelaxTimer() {
  pauseTimer()
  remainingTime = RELAX_TIME
  updateDisplay(remainingTime)
}

updateDisplay(remainingTime)

startBtn.addEventListener('click', startTimer)
stopBtn.addEventListener('click', pauseTimer)
resetBtn.addEventListener('click', resetTimer)

workBtn.addEventListener('click', setWorkTimer)
breakBtn.addEventListener('click', setBreakTimer)
relaxBtn.addEventListener('click', setRelaxTimer)


// Активная вкладка
const navigationBtns = document.querySelectorAll('.navigation__btn')
navigationBtns.forEach(button => {
  button.addEventListener('click', () => {
    // Убираем класс 'active' у всех кнопок
    navigationBtns.forEach(btn => btn.classList.remove('navigation__btn--active'))
    // Добавляем класс 'active' к той кнопке, на которую нажали
    button.classList.add('navigation__btn--active')
  })
})
