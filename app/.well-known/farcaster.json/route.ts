import { NextResponse } from "next/server"
import { minikitConfig } from "../../../minikit.config"

export async function GET() {
  const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "https://v0-vib-escrow.vercel.app"

  const manifest = {
    accountAssociation: {
      header: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_HEADER || minikitConfig.accountAssociation.header,
      payload: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_PAYLOAD || minikitConfig.accountAssociation.payload,
      signature: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_SIGNATURE || minikitConfig.accountAssociation.signature,
    },
    frame: {
      version: "1",
      name: minikitConfig.miniapp.name,
      iconUrl: `${ROOT_URL}/icon.png`,
      homeUrl: ROOT_URL,
      imageUrl: `${ROOT_URL}/api/image`,
      buttonTitle: "Swap NFTs",
      splashImageUrl: `${ROOT_URL}/api/splash`,
      splashBackgroundColor: "#050308",
      webhookUrl: `${ROOT_URL}/api/webhook`,
    },
  }

  return NextResponse.json(manifest, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
