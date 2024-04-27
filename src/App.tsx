import { useEffect, useState } from "react";
import "./App.css";
import Conference from "./Conference";
import Footer from "./Footer";
import JoinForm from "./JoinForm";
import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";

export default function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const [audioSrc, setAudioSrc] = useState('');
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');
    ws.onopen = () => console.log("Connection established!!");
    ws.onmessage = async (event) => {
      const audioBlob = new Blob([event.data], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(blobUrl);
    };
    ws.onclose = () => {
      console.log('Connection closed');
    };
    return () => {
      ws.close();
    };
  }, [])

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
        <figcaption>Listen to the T-Rex:</figcaption>
        <audio controls src={audioSrc}></audio>
      </figure>
    </div>
  );
}
