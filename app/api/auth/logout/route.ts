import { type NextRequest, NextResponse } from "next/server"
import { users } from "../login/route"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (userId && users.has(userId)) {
      users.delete(userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
