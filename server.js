const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const path = require("path")
const { v4: uuidv4 } = require("uuid")

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

// Serve static files
app.use(express.static("public"))

// In-memory storage
const users = new Map()
const messages = []

// Available profile pictures
const availableAvatars = [
  "avatar1.jpg",
  "avatar2.jpg",
  "avatar3.jpg",
  "avatar4.jpg",
  "avatar5.jpg",
  "avatar6.jpg",
  "avatar7.jpg",
  "avatar8.jpg",
  "avatar9.jpg",
  "avatar10.jpg",
  "avatar11.jpg",
  "avatar12.jpg",
]

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"))
})

app.get("/api/avatars", (req, res) => {
  res.json(availableAvatars)
})

app.get("/api/check-username/:username", (req, res) => {
  const username = req.params.username.toLowerCase()
  const isAvailable = !Array.from(users.values()).some((user) => user.name.toLowerCase() === username)
  res.json({ available: isAvailable })
})

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-chat", (userData) => {
    const { name, avatar } = userData

    // Check if username is already taken
    const isUsernameTaken = Array.from(users.values()).some((user) => user.name.toLowerCase() === name.toLowerCase())

    if (isUsernameTaken) {
      socket.emit("username-taken")
      return
    }

    // Add user to users map
    users.set(socket.id, {
      id: socket.id,
      name: name,
      avatar: avatar,
      joinedAt: new Date(),
    })

    // Send current messages to new user
    socket.emit("message-history", messages)

    // Send updated user list to all clients
    io.emit("users-updated", Array.from(users.values()))

    // Broadcast user joined message
    const joinMessage = {
      id: uuidv4(),
      type: "system",
      content: `${name} joined the chat`,
      timestamp: new Date(),
      user: null,
    }

    messages.push(joinMessage)
    io.emit("new-message", joinMessage)

    console.log(`${name} joined the chat`)
  })

  socket.on("send-message", (messageData) => {
    const user = users.get(socket.id)
    if (!user) return

    const message = {
      id: uuidv4(),
      type: "user",
      content: messageData.content,
      timestamp: new Date(),
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
    }

    messages.push(message)

    // Keep only last 100 messages
    if (messages.length > 100) {
      messages.splice(0, messages.length - 100)
    }

    io.emit("new-message", message)
  })

  socket.on("disconnect", () => {
    const user = users.get(socket.id)
    if (user) {
      users.delete(socket.id)

      // Send updated user list to all clients
      io.emit("users-updated", Array.from(users.values()))

      // Broadcast user left message
      const leaveMessage = {
        id: uuidv4(),
        type: "system",
        content: `${user.name} left the chat`,
        timestamp: new Date(),
        user: null,
      }

      messages.push(leaveMessage)
      io.emit("new-message", leaveMessage)

      console.log(`${user.name} left the chat`)
    }
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
