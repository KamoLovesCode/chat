import { type NextRequest, NextResponse } from "next/server"

// Import messages from the main messages route
// In a real app, this would be from a shared database
const getMessages = () => {
  // This is a workaround for demo purposes
  // In production, use a shared database
  return []
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // In production, implement proper pagination with database
    const messages = getMessages()
    const paginatedMessages = messages.slice(offset, offset + limit)

    return NextResponse.json({
      messages: paginatedMessages,
      total: messages.length,
      limit,
      offset,
      hasMore: offset + limit < messages.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch message history" }, { status: 500 })
  }
}
