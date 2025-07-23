import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"

export async function GET() {
  try {
    const now = Date.now()
    const onlineThreshold = 30000 // 30 seconds

    console.log(`Checking online users. Total users: ${users.size}`)

    // Get all users and their last seen times
    const allUsers = Array.from(users.values())
    console.log(
      "All users:",
      allUsers.map((u) => ({ name: u.name, lastSeen: new Date(u.lastSeen).toISOString(), timeDiff: now - u.lastSeen })),
    )

    // Filter users who have been active in the last 30 seconds
    const onlineUsers = allUsers.filter((user) => {
      const timeDiff = now - user.lastSeen
      const isOnline = timeDiff < onlineThreshold
      console.log(`User ${user.name}: ${timeDiff}ms ago, online: ${isOnline}`)
      return isOnline
    })

    // Sort by name for consistent ordering across clients
    onlineUsers.sort((a, b) => a.name.localeCompare(b.name))

    console.log(`Online users: ${onlineUsers.length}/${users.size}`)

    return NextResponse.json({
      users: onlineUsers,
      serverTime: now,
      onlineCount: onlineUsers.length,
      totalUsers: users.size,
    })
  } catch (error) {
    console.error("Failed to fetch online users:", error)
    return NextResponse.json({ error: "Failed to fetch online users" }, { status: 500 })
  }
}
