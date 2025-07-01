"use client";
import React, { useState } from "react";

import { PlusCircle, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
type Props = {};

const Lobby = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="lobby">
      <div className="lobby__header">
        <h1>Welcome to the Video Calling App</h1>
      </div>
      <div className="lobby__description">
        <p>
          This is a simple video calling application built with Next.js and
          Stream.
        </p>
      </div>
      <div className="lobby__subtext">
        <p>To get started, create a new room or join an existing one.</p>
      </div>
      <div className="lobby__create">
        <button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="icon" />
          Create Room
        </button>
      </div>

      <div className="lobby__rooms">
        <div className="room-card">
          <h2>Join Group Calling Room</h2>
          <button onClick={() => router.push("/room/1")}>
            <User2Icon className="icon" />
            Join Room 1
          </button>
          <button onClick={() => router.push("/room/2")}>
            <User2Icon className="icon" />
            Join Room 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
