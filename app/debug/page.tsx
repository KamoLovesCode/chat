"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DebugUser {
  id: string
  name: string
  lastSeen: number
  lastSeenAgo: number
  lastSeenFormatted: string
}

export default function DebugPage() {
  const [debugData, setDebugData] = useState<{
    totalUsers: number
    users: DebugUser[]
    serverTime: number
    serverTimeFormatted: string
  } | null>(null)

  const fetchDebugData = async () => {
    try {
      const response = await fetch("/api/debug/users")
      if (response.ok) {
        const data = await response.json()
        setDebugData(data)
      }
    } catch (error) {
      console.error("Failed to fetch debug data:", error)
    }
  }

  useEffect(() => {
    fetchDebugData()
    const interval = setInterval(fetchDebugData, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Debug: User Management</CardTitle>
          <Button onClick={fetchDebugData}>Refresh</Button>
        </CardHeader>
        <CardContent>
          {debugData ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Server Info</h3>
                <p>Total Users: {debugData.totalUsers}</p>
                <p>Server Time: {debugData.serverTimeFormatted}</p>
              </div>

              <div>
                <h3 className="font-semibold">All Users</h3>
                <div className="space-y-2">
                  {debugData.users.map((user) => (
                    <div key={user.id} className="border p-2 rounded">
                      <p>
                        <strong>Name:</strong> {user.name}
                      </p>
                      <p>
                        <strong>ID:</strong> {user.id}
                      </p>
                      <p>
                        <strong>Last Seen:</strong> {user.lastSeenFormatted}
                      </p>
                      <p>
                        <strong>Time Ago:</strong> {Math.round(user.lastSeenAgo / 1000)}s
                      </p>
                      <p>
                        <strong>Online:</strong> {user.lastSeenAgo < 30000 ? "✅ Yes" : "❌ No"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p>Loading debug data...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
