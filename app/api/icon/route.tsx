import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: "bold",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        VE
      </div>
    </div>,
    { width: 200, height: 200 },
  )
}
