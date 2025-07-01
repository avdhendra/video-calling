
import { NextResponse } from "next/server";
import { createToken, maxTokenValidityInSeconds } from "@/helpers/jwt";
import { SampleAppCallConfig } from "@/app/api/call/sample"; // Update path if needed

const config: SampleAppCallConfig = JSON.parse(
  process.env.SAMPLE_APP_CALL_CONFIG || '{}',
);

if (!config['pronto']) {
  config.pronto = {
    apiKey: process.env.STREAM_API_KEY,
    secret: process.env.STREAM_SECRET_KEY,
  };
}

export async function GET(req: Request) {
  console.log("create-token called");
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  const apiKeyFromRequest = url.searchParams.get("api_key") || "";
  const exp = url.searchParams.get("exp") || String(maxTokenValidityInSeconds);
  const environment =
    url.searchParams.get("environment") ||
    (apiKeyFromRequest === "hd8szvscpxvd"
      ? "pronto-legacy"
      : apiKeyFromRequest === "mmhfdzb5evj2"
      ? "demo"
      : apiKeyFromRequest === "2g3htdemzwhg"
      ? "demo-flutter"
      : "demo");

  const appConfig = config[environment];
  if (!appConfig || !appConfig.apiKey || !appConfig.secret) {
    return NextResponse.json({ error: "Invalid environment config" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: "'user_id' is required" }, { status: 400 });
  }

  const token = createToken(userId, appConfig.apiKey, appConfig.secret, { exp });

  return NextResponse.json({
    userId,
    apiKey: appConfig.apiKey,
    token,
  });
}