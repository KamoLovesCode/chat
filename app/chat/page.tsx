"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Send, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: number
}

interface User {
  id: string
  name: string
  lastSeen: number
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Add these state variables after the existing ones
  const [clientId] = useState(() => `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connecting")

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName")

    if (!userId || !userName) {
      router.push("/")
      return
    }

    setCurrentUser({ id: userId, name: userName })
    console.log(`Current user: ${userName} (${userId})`)

    // Fetch initial data
    fetchMessages().catch(handleConnectionError)
    fetchOnlineUsers().catch(() => {})

    // Send initial heartbeat immediately
    sendHeartbeat().catch(() => {})

    // Set up polling with error handling
    const messageInterval = setInterval(() => {
      fetchMessages().catch(handleConnectionError)
    }, 1000) // Increased to 1 second for better performance

    const userInterval = setInterval(() => {
      fetchOnlineUsers().catch(() => {})
    }, 2000) // Check users every 2 seconds

    const heartbeatInterval = setInterval(() => {
      sendHeartbeat().catch(() => {})
    }, 5000) // Heartbeat every 5 seconds

    return () => {
      clearInterval(messageInterval)
      clearInterval(userInterval)
      clearInterval(heartbeatInterval)
    }
  }, [router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Update the fetchMessages function
  const fetchMessages = async () => {
    try {
      setConnectionStatus("connecting")
      const url = new URL("/api/messages", window.location.origin)
      url.searchParams.set("clientId", clientId)
      if (lastMessageId) {
        url.searchParams.set("lastMessageId", lastMessageId)
      }

      const response = await fetch(url.toString())
      if (response.ok) {
        const data = await response.json()

        if (lastMessageId) {
          // Append new messages to existing ones
          setMessages((prev) => [...prev, ...data.messages])
        } else {
          // Replace all messages (initial load)
          setMessages(data.messages)
        }

        // Update last message ID
        if (data.messages.length > 0) {
          setLastMessageId(data.messages[data.messages.length - 1].id)
        }

        setConnectionStatus("connected")
      } else {
        setConnectionStatus("disconnected")
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      setConnectionStatus("disconnected")
    }
  }

  const fetchOnlineUsers = async () => {
    try {
      console.log("Fetching online users...")
      const response = await fetch("/api/users/online")
      if (response.ok) {
        const data = await response.json()
        console.log(
          "Online users received:",
          data.users.length,
          data.users.map((u) => u.name),
        )
        setOnlineUsers(data.users)
      } else {
        console.error("Failed to fetch online users:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Failed to fetch online users:", error)
    }
  }

  const sendHeartbeat = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    try {
      const response = await fetch("/api/users/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Heartbeat successful for:", data.user?.name)
      } else {
        console.error("Heartbeat failed:", response.status, response.statusText)
        // If heartbeat fails, user might need to re-login
        if (response.status === 404) {
          console.log("User not found, redirecting to login...")
          handleLogout()
        }
      }
    } catch (error) {
      console.error("Heartbeat failed:", error)
    }
  }

  // Update the sendMessage function
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          content: newMessage.trim(),
          clientId: clientId,
        }),
      })

      if (response.ok) {
        setNewMessage("")
        // Don't fetch messages immediately, let the polling handle it
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        })
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }

    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Add these functions after the existing ones
  const handleConnectionError = () => {
    setConnectionStatus("disconnected")
    // Attempt to reconnect after 5 seconds
    setTimeout(() => {
      if (currentUser) {
        fetchMessages()
        fetchOnlineUsers()
      }
    }, 5000)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Online Users Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Online Users
            </h2>
            <Badge variant="secondary">{onlineUsers.length}</Badge>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-2">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className={`p-2 rounded-lg mb-1 ${
                  user.id === currentUser.id ? "bg-blue-100 text-blue-800" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {user.name}
                    {user.id === currentUser.id && " (You)"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-gray-200">
          <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Update the chat header section */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Live Chat - Welcome, {currentUser.name}!</h1>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "connecting"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600 capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.userId === currentUser.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.userId === currentUser.id ? "bg-blue-500 text-white" : "bg-white border border-gray-200"
                  }`}
                >
                  {message.userId !== currentUser.id && (
                    <div className="text-xs font-medium text-gray-600 mb-1">{message.userName}</div>
                  )}
                  <div className="text-sm">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${message.userId === currentUser.id ? "text-blue-100" : "text-gray-500"}`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              maxLength={500}
            />
            <Button type="submit" disabled={isLoading || !newMessage.trim()} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
