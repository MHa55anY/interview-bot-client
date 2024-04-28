import { selectPeers, useHMSStore } from "@100mslive/react-sdk";
import React, { useEffect } from "react";
import Peer from "./Peer";

function Conference() {
  const peers = useHMSStore(selectPeers);

  useEffect(() => {
    const initChatBot = async () => {
      await fetch("http://localhost:8000/init-bot")
    }
    initChatBot();
  }, []);
  return (
    <div className="conference-section">
      <h2>Conference</h2>

      <div className="peers-container">
        {peers.map((peer) => (
          <Peer key={peer.id} peer={peer} />
        ))}
      </div>
    </div>
  );
}

export default Conference;
