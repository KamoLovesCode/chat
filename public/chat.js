// Import the io function from socket.io-client
const io = require("socket.io-client")
const socket = io()
let currentUser = null
let users = []
let messageCount = 0

// DOM elements
const messageForm = document.getElementById("messageForm")
const messageInput = document.getElementById("messageInput")
const messagesList = document.getElementById("messagesList")
const messagesContainer = document.getElementById("messagesContainer")
const membersList = document.getElementById("membersList")
const onlineCount = document.getElementById("onlineCount")
const memberCount = document.getElementById("memberCount")
const messageCountElement = document.getElementById("messageCount")
const rightSidebar = document.getElementById("rightSidebar")

// Check if user data exists
const userData = sessionStorage.getItem("userData")
if (!userData) {
  window.location.href = "/"
} else {
  currentUser = JSON.parse(userData)
  joinChat()
}

function joinChat() {
  socket.emit("join-chat", currentUser)
}

// Message form submission
messageForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const content = messageInput.value.trim()
  if (!content) return

  socket.emit("send-message", { content })
  messageInput.value = ""
})

// Socket events
socket.on("message-history", (messages) => {
  messagesList.innerHTML = ""
  messages.forEach((message) => {
    displayMessage(message)
  })
  scrollToBottom()
})

socket.on("new-message", (message) => {
  displayMessage(message)
  scrollToBottom()
  updateMessageCount()
})

socket.on("users-updated", (updatedUsers) => {
  users = updatedUsers
  updateUsersList()
  updateOnlineCount()
})

socket.on("username-taken", () => {
  alert("Username is already taken. Please choose a different name.")
  window.location.href = "/"
})

function displayMessage(message) {
  const messageElement = document.createElement("div")
  messageElement.className = "message"

  if (message.type === "system") {
    messageElement.classList.add("system")
    messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message.content}</div>
            </div>
        `
  } else {
    const isOwnMessage = message.user && message.user.id === socket.id
    if (isOwnMessage) {
      messageElement.classList.add("own")
    }

    const avatarUrl = message.user ? `https://i.pravatar.cc/150?img=${getAvatarIndex(message.user.avatar)}` : ""

    messageElement.innerHTML = `
            ${message.user ? `<div class="message-avatar" style="background-image: url('${avatarUrl}')"></div>` : ""}
            <div class="message-content">
                ${
                  message.user
                    ? `
                    <div class="message-header">
                        <span class="message-author">${message.user.name}</span>
                        <span class="message-time">${formatTime(message.timestamp)}</span>
                    </div>
                `
                    : ""
                }
                <div class="message-text">${message.content}</div>
            </div>
        `
  }

  messagesList.appendChild(messageElement)
}

function updateUsersList() {
  membersList.innerHTML = ""

  users.forEach((user) => {
    const memberElement = document.createElement("div")
    memberElement.className = "member-item"

    const avatarUrl = `https://i.pravatar.cc/150?img=${getAvatarIndex(user.avatar)}`

    memberElement.innerHTML = `
            <div class="member-avatar" style="background-image: url('${avatarUrl}')"></div>
            <div class="member-info">
                <div class="member-name">${user.name}${user.id === socket.id ? " (You)" : ""}</div>
                <div class="member-status">Online</div>
            </div>
        `

    membersList.appendChild(memberElement)
  })
}

function updateOnlineCount() {
  const count = users.length
  onlineCount.textContent = count
  memberCount.textContent = count
}

function updateMessageCount() {
  messageCount++
  messageCountElement.textContent = messageCount
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function getAvatarIndex(avatar) {
  // Extract index from avatar filename or use hash
  const match = avatar.match(/\d+/)
  return match ? Number.parseInt(match[0]) : (Math.abs(hashCode(avatar)) % 70) + 1
}

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

function toggleMembers() {
  rightSidebar.classList.toggle("show")
}

// Auto-focus message input
messageInput.focus()

// Handle page visibility for better UX
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    messageInput.focus()
  }
})
