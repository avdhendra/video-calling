import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const secretKey = process.env.STREAM_SECRET_KEY!;

export async function POST(req: Request) {
    
  const { userId } = await req.json();

  const client = new StreamClient(apiKey, secretKey);
  const token = client.generateUserToken({ user_id: userId });


  return NextResponse.json({ token });
}