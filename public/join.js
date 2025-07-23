// Import io from socket.io-client
const io = require("socket.io-client")
const socket = io()
let selectedAvatar = null
let availableAvatars = []

// DOM elements
const joinForm = document.getElementById("joinForm")
const usernameInput = document.getElementById("username")
const avatarGrid = document.getElementById("avatarGrid")
const joinBtn = document.getElementById("joinBtn")
const usernameError = document.getElementById("usernameError")
const avatarError = document.getElementById("avatarError")

// Load available avatars
async function loadAvatars() {
  try {
    const response = await fetch("/api/avatars")
    availableAvatars = await response.json()
    renderAvatars()
  } catch (error) {
    console.error("Failed to load avatars:", error)
    // Fallback avatars
    availableAvatars = ["avatar1.jpg", "avatar2.jpg", "avatar3.jpg", "avatar4.jpg"]
    renderAvatars()
  }
}

function renderAvatars() {
  avatarGrid.innerHTML = ""
  availableAvatars.forEach((avatar, index) => {
    const avatarElement = document.createElement("div")
    avatarElement.className = "avatar-option"
    avatarElement.style.backgroundImage = `url('https://i.pravatar.cc/150?img=${index + 1}')`
    avatarElement.addEventListener("click", () => selectAvatar(avatar, avatarElement))
    avatarGrid.appendChild(avatarElement)
  })
}

function selectAvatar(avatar, element) {
  // Remove previous selection
  document.querySelectorAll(".avatar-option").forEach((el) => {
    el.classList.remove("selected")
  })

  // Select new avatar
  element.classList.add("selected")
  selectedAvatar = avatar
  hideError(avatarError)
}

// Username validation
let usernameTimeout
usernameInput.addEventListener("input", () => {
  clearTimeout(usernameTimeout)
  const username = usernameInput.value.trim()

  if (username.length < 2) {
    hideError(usernameError)
    return
  }

  usernameTimeout = setTimeout(async () => {
    await checkUsername(username)
  }, 500)
})

async function checkUsername(username) {
  try {
    const response = await fetch(`/api/check-username/${encodeURIComponent(username)}`)
    const data = await response.json()

    if (!data.available) {
      showError(usernameError, "This username is already taken")
    } else {
      hideError(usernameError)
    }
  } catch (error) {
    console.error("Failed to check username:", error)
  }
}

function showError(element, message) {
  element.textContent = message
  element.classList.add("show")
}

function hideError(element) {
  element.classList.remove("show")
}

// Form submission
joinForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const username = usernameInput.value.trim()
  let hasError = false

  // Validate username
  if (!username || username.length < 2) {
    showError(usernameError, "Name must be at least 2 characters long")
    hasError = true
  }

  // Validate avatar selection
  if (!selectedAvatar) {
    showError(avatarError, "Please select an avatar")
    hasError = true
  }

  if (hasError) return

  // Check username availability one more time
  try {
    const response = await fetch(`/api/check-username/${encodeURIComponent(username)}`)
    const data = await response.json()

    if (!data.available) {
      showError(usernameError, "This username is already taken")
      return
    }
  } catch (error) {
    console.error("Failed to check username:", error)
    return
  }

  // Disable form
  joinBtn.disabled = true
  joinBtn.innerHTML = "<span>Joining...</span>"

  // Store user data and redirect
  sessionStorage.setItem(
    "userData",
    JSON.stringify({
      name: username,
      avatar: selectedAvatar,
    }),
  )

  window.location.href = "/chat"
})

// Socket events
socket.on("username-taken", () => {
  showError(usernameError, "This username is already taken")
  joinBtn.disabled = false
  joinBtn.innerHTML = "<span>Join Chat</span>"
})

// Initialize
loadAvatars()
