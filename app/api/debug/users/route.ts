import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"

export async function GET() {
  try {
    const now = Date.now()
    const allUsers = Array.from(users.values()).map((user) => ({
      ...user,
      lastSeenAgo: now - user.lastSeen,
      lastSeenFormatted: new Date(user.lastSeen).toISOString(),
    }))

    return NextResponse.json({
      totalUsers: users.size,
      users: allUsers,
      serverTime: now,
      serverTimeFormatted: new Date(now).toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch debug info" }, { status: 500 })
  }
}
