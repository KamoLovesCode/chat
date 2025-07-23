import { type NextRequest, NextResponse } from "next/server"

interface Message {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: number
}

interface ClientInfo {
  lastMessageId?: string
  lastFetch: number
}

// In-memory storage (in production, use a database)
const messages: Message[] = []
const clientInfo = new Map<string, ClientInfo>()

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const clientId = url.searchParams.get("clientId") || "anonymous"
    const lastMessageId = url.searchParams.get("lastMessageId")

    // Track client info
    const client = clientInfo.get(clientId) || { lastFetch: 0 }
    client.lastFetch = Date.now()
    clientInfo.set(clientId, client)

    // If client provides lastMessageId, only return newer messages
    let messagesToReturn = messages.slice(-100) // Last 100 messages

    if (lastMessageId) {
      const lastIndex = messages.findIndex((msg) => msg.id === lastMessageId)
      if (lastIndex !== -1) {
        messagesToReturn = messages.slice(lastIndex + 1)
      }
    }

    return NextResponse.json({
      messages: messagesToReturn,
      totalMessages: messages.length,
      serverTime: Date.now(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, content, clientId } = await request.json()

    if (!userId || !userName || !content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid message data" }, { status: 400 })
    }

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      content: content.trim(),
      timestamp: Date.now(),
    }

    messages.push(message)

    // Keep only last 200 messages in memory for multiple clients
    if (messages.length > 200) {
      messages.splice(0, messages.length - 200)
    }

    // Update client info
    if (clientId) {
      const client = clientInfo.get(clientId) || { lastFetch: 0 }
      client.lastMessageId = message.id
      clientInfo.set(clientId, client)
    }

    return NextResponse.json({
      message,
      totalMessages: messages.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
