import { selectPeers, useHMSStore } from "@100mslive/react-sdk";
import Peer from "./Peer";
import { useEffect } from "react";
import axios from "axios";

function Conference() {
  const peers = useHMSStore(selectPeers);
  const localPeer = peers.find((p) => p.isLocal)

  useEffect(() => {
    const initChatBot = async () => {
      await axios.get("http://localhost:8000/init-bot", {
        params: {
          role: localPeer?.roleName
        }
      })
    }
    initChatBot();
  }, [localPeer?.roleName]);

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
