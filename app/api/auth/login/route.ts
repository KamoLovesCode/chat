import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (in production, use a database)
export const users = new Map<string, { id: string; name: string; lastSeen: number }>()

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Generate a simple user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store user with current timestamp
    users.set(userId, {
      id: userId,
      name: name.trim(),
      lastSeen: Date.now(),
    })

    console.log(`User logged in: ${name.trim()} (${userId})`)
    console.log(`Total users: ${users.size}`)

    return NextResponse.json({ userId, name: name.trim() })
  } catch (error) {
    console.error("Login failed:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
