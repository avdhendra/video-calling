"use client";
import RoomComponent from "@/components/room/Room";
import { createToken } from "@/helpers/jwt";
import { StreamTheme } from "@stream-io/video-react-sdk";
import React, { useEffect } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function Room({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const [value, setValue] = React.useState<any | null>(null);
  const getToken = async () => {
    const streamUserId =
      "video-tutorial-" + Math.random().toString(16).substring(2);

    const res = await fetch("/api/token", {
      method: "POST",
      body: JSON.stringify({ userId: streamUserId }),
      headers: { "Content-Type": "application/json" },
    });
    console.log("res", res);
    const data = await res.json();
    const token = data.token;

    setValue({
      apiKey,
      userToken: token,
      user: {
        id: streamUserId,
        name: "Oliver"+streamUserId,
        image: "https://getstream.io/random_svg/?id=oliver&name=Oliver",
      },
    });
  };
  useEffect(() => {
    getToken();
  }, []);
  // Otherwise, SDP parse errors with MSID

  // Chat does not allow for Id's to include special characters

  return (
    <StreamTheme>
      {apiKey && value && (
        <RoomComponent
          apiKey={apiKey}
          user={value.user}
          userToken={value.token}
          callId={id}
          searchParams={{}}
        />
      )}
    </StreamTheme>
  );
}
