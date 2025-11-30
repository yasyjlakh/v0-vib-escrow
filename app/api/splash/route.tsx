import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(180deg, #0f0f0f, #1a1a2e)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
          boxShadow: "0 0 60px rgba(236, 72, 153, 0.5)",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: "bold",
            color: "white",
          }}
        >
          VE
        </div>
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: "bold",
          background: "linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        VibEscrow
      </div>
      <div
        style={{
          fontSize: 20,
          color: "rgba(255,255,255,0.6)",
          marginTop: 10,
        }}
      >
        Caricamento...
      </div>
    </div>,
    { width: 200, height: 200 },
  )
}
