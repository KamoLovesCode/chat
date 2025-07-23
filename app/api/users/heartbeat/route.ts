import { type NextRequest, NextResponse } from "next/server"
import { users } from "../../auth/login/route"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (users.has(userId)) {
      const user = users.get(userId)!
      const updatedUser = {
        ...user,
        lastSeen: Date.now(),
      }
      users.set(userId, updatedUser)

      console.log(`Heartbeat from: ${user.name} (${userId})`)
      return NextResponse.json({ success: true, user: updatedUser })
    } else {
      console.log(`Heartbeat failed: User ${userId} not found`)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Heartbeat failed:", error)
    return NextResponse.json({ error: "Heartbeat failed" }, { status: 500 })
  }
}
