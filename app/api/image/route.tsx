import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)",
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
          fontSize: 80,
          fontWeight: "bold",
          color: "white",
          textShadow: "4px 4px 8px rgba(0,0,0,0.3)",
          marginBottom: 20,
        }}
      >
        VibEscrow
      </div>
      <div
        style={{
          fontSize: 32,
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        Scambia NFT in sicurezza su Farcaster
      </div>
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 40,
        }}
      >
        <div style={{ fontSize: 60 }}>🎨</div>
        <div style={{ fontSize: 60 }}>🔄</div>
        <div style={{ fontSize: 60 }}>🔒</div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  )
}
