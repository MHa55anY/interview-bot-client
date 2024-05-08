import { useEffect, useMemo } from "react";
import "./App.css";
import Conference from "./Conference";
import Footer from "./Footer";
import JoinForm from "./JoinForm";
import { selectIsConnectedToRoom, useHMSActions, useHMSStore, selectPeers } from "@100mslive/react-sdk";

export default function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const peers = useHMSStore(selectPeers)
  const host = peers.find((p) => p.roleName === 'host');
  const audioContext = useMemo(() => new AudioContext(), []);
  const ws = useMemo(() => {
    const websocket = new WebSocket('ws://localhost:8081');
    hmsActions.setAppData("wsConn", websocket);
    return websocket;
  }, [hmsActions])

  async function createAudioBuffer(arrayBuffer: ArrayBuffer, audioContext: AudioContext): Promise<AudioBuffer> {
    return await audioContext.decodeAudioData(arrayBuffer);
  }

  // Function to convert the AudioBuffer to a MediaStream
  function bufferToStream(audioBuffer: AudioBuffer, audioContext: AudioContext): MediaStream {
    // Create an AudioBufferSourceNode and set its buffer
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create a MediaStreamDestination node
    const destination = audioContext.createMediaStreamDestination();

    // Connect the AudioBufferSourceNode to the destination
    source.connect(destination);

    // Start the audio source
    source.start(3);

    // Get the media stream from the destination
    return destination.stream;
  }

  console.log("Added track", peers);
  

  useEffect(() => {
    console.log("triggered useffect")
    ws.onopen = () => console.log("Connection established!!");
    if(host?.isLocal)
      ws.onmessage = (event: MessageEvent<BlobPart>) => {
        const audioBlob = new Blob([event.data]);
        audioBlob.arrayBuffer()
          .then((buffer) => createAudioBuffer(buffer, audioContext))
          .then((audioBuffer) => {
            const mediaStream: MediaStream = bufferToStream(audioBuffer, audioContext);
            const audioTrack: MediaStreamTrack = mediaStream.getAudioTracks()[0]; // Extracting the audio track
            return audioTrack;
          })
          .then((track) => hmsActions.addTrack(track, 'regular'))
          .then(() => console.log("TRACK ADDEDD!"))
      };
    ws.onclose = () => {
      console.log('Connection closed');
    };
  }, [audioContext, hmsActions, host?.isLocal, isConnected, ws]);

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
    </div>
  );
}
