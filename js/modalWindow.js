/* modalWindow.js */

// 1. When the DOM loads, check if we already have a saved username.
window.addEventListener('DOMContentLoaded', () => {
  const savedUsername = localStorage.getItem('username')

  if (savedUsername) {
    // If there's a saved username, remove the login button and show "Привет, username".
    const headerUserDiv = document.querySelector('.header__user')
    const loginBtn = document.getElementById('open-login-btn')

    if (loginBtn) loginBtn.remove() // remove the login button

    const greeting = document.createElement('span')
    greeting.textContent = `Привет, ${savedUsername}`
    greeting.style.color = 'black' // style as you wish
    greeting.style.marginLeft = '15px'

    headerUserDiv.appendChild(greeting)
  }
})

// 2. Modal open/close logic
const openLoginBtn = document.getElementById('open-login-btn')
const closeLoginBtn = document.getElementById('close-login-btn')
const loginModal = document.getElementById('login-modal')

if (openLoginBtn) {
  openLoginBtn.addEventListener('click', () => {
    loginModal?.classList.add('open')
  })
}
if (closeLoginBtn) {
  closeLoginBtn.addEventListener('click', () => {
    loginModal?.classList.remove('open')
  })
}

// Optional: Close modal on "Escape" key
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    loginModal?.classList.remove('open')
  }
})

// Optional: Close modal if clicking outside .modal__box
loginModal?.addEventListener('click', event => {
  // If the event is on the background (not the .modal__box), close it
  if (event.target === loginModal) {
    loginModal.classList.remove('open')
  }
})

// 3. Handle login form submission
const loginForm = document.querySelector('.modal__form')
if (loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault() // prevent page reload

    const usernameInput = loginForm.querySelector('input[type="text"]')
    const passwordInput = loginForm.querySelector('input[type="password"]')

    if (!usernameInput || !passwordInput) return

    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if (!username || !password) {
      alert('Пожалуйста, введите имя и пароль!')
      return
    }

    // Store username in localStorage
    localStorage.setItem('username', username)

    // Close the modal
    loginModal?.classList.remove('open')

    // Remove the login button
    const loginBtn = document.getElementById('open-login-btn')
    if (loginBtn) loginBtn.remove()

    // Show the greeting
    const headerUserDiv = document.querySelector('.header__user')
    if (headerUserDiv) {
      const greeting = document.createElement('span')
      greeting.textContent = `Привет, ${username}`
      greeting.style.color = '#fff8ee'
      greeting.style.marginLeft = '15px'
      headerUserDiv.appendChild(greeting)
    }
  })
}
