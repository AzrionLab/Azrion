import { NextRequest } from "next/server"
import { scanTokenActivity } from "@/routines/background-jobs/token-flow/azrionTokenActivityEngine"

export async function GET(req: NextRequest): Promise<Response> {
  const tokenMint = req.nextUrl.searchParams.get("token")?.trim()

  if (!tokenMint) {
    return Response.json(
      { status: "error", message: "Missing or invalid token mint" },
      { status: 400 }
    )
  }

  try {
    const activityResult = await scanTokenActivity(tokenMint)

    return Response.json({
      status: "ok",
      token: tokenMint,
      result: activityResult
    })
  } catch (err: any) {
    console.error("[Azrion] Token activity scan error:", err)

    return Response.json(
      {
        status: "error",
        message: "Failed to scan token activity",
        details: err?.message || "Unexpected error"
      },
      {
        status: 500,
        headers: { "X-Azrion-Error": "true" }
      }
    )
  }
}
