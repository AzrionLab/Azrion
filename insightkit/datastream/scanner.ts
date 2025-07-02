import { NextRequest } from "next/server"
import { scanTokenActivity } from "@/routines/background-jobs/token-flow/azrionTokenActivityEngine"

export async function GET(req: NextRequest): Promise<Response> {
  const tokenMint = req.nextUrl.searchParams.get("token")

  if (!tokenMint) {
    return new Response("Missing token mint", { status: 400 })
  }

  try {
    const activityResult = await scanTokenActivity(tokenMint)

    return Response.json({
      status: "ok",
      token: tokenMint,
      result: activityResult
    })
  } catch (err) {
    console.error("[Azrion] Token activity scan error:", err)

    return new Response("Internal server error", {
      status: 500,
      headers: { "X-Azrion-Error": "true" }
    })
  }
}
