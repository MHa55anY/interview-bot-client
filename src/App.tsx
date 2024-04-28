import { useEffect, useState } from "react";
import "./App.css";
import Conference from "./Conference";
import Footer from "./Footer";
import JoinForm from "./JoinForm";
import { selectIsConnectedToRoom, useHMSActions, useHMSStore } from "@100mslive/react-sdk";

export default function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const [audioSrc, setAudioSrc] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');
    hmsActions.setAppData("wsConn", ws);
    ws.onopen = () => console.log("Connection established!!");
    ws.onmessage = async (event) => {
      const audioBlob = new Blob([event.data], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(blobUrl);
    };
    ws.onclose = () => {
      console.log('Connection closed');
    };
  }, [hmsActions]);

  return (
    <div className="App">
      {isConnected ? (
        <>
          <Conference />
          <Footer />
        </>
      ) : (
        <JoinForm />
      )}
      <br />
      <figure>
        <figcaption>Listen to Audio:</figcaption>
        <audio controls src={audioSrc}></audio>
      </figure>
    </div>
  );
}
