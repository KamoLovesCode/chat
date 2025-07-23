import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"

export async function GET() {
  try {
    const now = Date.now()
    const onlineThreshold = 15000 // 15 seconds

    const totalUsers = users.size
    const onlineUsers = Array.from(users.values()).filter((user) => now - user.lastSeen < onlineThreshold)

    return NextResponse.json({
      totalUsers,
      onlineUsers: onlineUsers.length,
      serverTime: now,
      uptime: process.uptime(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
