import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[VibEscrow Webhook] Received:", JSON.stringify(body, null, 2))

    // Handle different webhook event types from Farcaster
    const { type, data } = body

    switch (type) {
      case "frame_added":
        console.log("[VibEscrow] Frame added by user:", data?.fid)
        break
      case "frame_removed":
        console.log("[VibEscrow] Frame removed by user:", data?.fid)
        break
      case "notifications_enabled":
        console.log("[VibEscrow] Notifications enabled by user:", data?.fid)
        break
      case "notifications_disabled":
        console.log("[VibEscrow] Notifications disabled by user:", data?.fid)
        break
      default:
        console.log("[VibEscrow] Unknown webhook type:", type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[VibEscrow Webhook] Error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "VibEscrow webhook endpoint",
  })
}
