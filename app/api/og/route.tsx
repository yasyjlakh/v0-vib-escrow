import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0d9488, #14b8a6)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style={{ marginRight: 16 }}>
          <path
            d="M16 3H8C5.79 3 4 4.79 4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4z"
            fill="rgba(255,255,255,0.2)"
            stroke="white"
            strokeWidth="2"
          />
          <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "white",
            letterSpacing: "-2px",
          }}
        >
          VibEscrow
        </span>
      </div>
      <div
        style={{
          fontSize: 32,
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        Scambia NFT multipli in modo sicuro su Farcaster
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 40,
          gap: 16,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.2)",
            padding: "12px 24px",
            borderRadius: 12,
            fontSize: 24,
            color: "white",
          }}
        >
          NFT Swap
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.2)",
            padding: "12px 24px",
            borderRadius: 12,
            fontSize: 24,
            color: "white",
          }}
        >
          Escrow Sicuro
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.2)",
            padding: "12px 24px",
            borderRadius: 12,
            fontSize: 24,
            color: "white",
          }}
        >
          Base Chain
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
