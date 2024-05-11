import { useEffect, useMemo } from "react";
import {
  selectIsConnectedToRoom,
  selectPeers,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";

const useWebSocket = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const peers = useHMSStore(selectPeers);
  const host = peers.find(p => p.roleName === "host");
  const audioContext = useMemo(() => new AudioContext(), []);
  const ws = useMemo(() => {
    const websocket = new WebSocket("ws://localhost:8081");
    hmsActions.setAppData("wsConn", websocket);
    return websocket;
  }, [hmsActions]);

  // (ArrayBuffer, AudioContext): Promise<AudioBuffer>
  const createAudioBuffer = async (arrayBuffer: ArrayBuffer, audioContext: AudioContext) =>
    await audioContext.decodeAudioData(arrayBuffer);

  // Function to convert the AudioBuffer to a MediaStream
  //(AudioBuffer, AudioContext) => MediaStream
  const bufferToStream = (audioBuffer: AudioBuffer, audioContext: AudioContext) => {
    // Create an AudioBufferSourceNode and set its buffer
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create a MediaStreamDestination node
    const destination = audioContext.createMediaStreamDestination();

    // Connect the AudioBufferSourceNode to the destination
    source.connect(destination);

    // Start the audio source - Lagg added to avoid early start of audio before 100ms track addition
    source.start(5);

    // Get the media stream from the destination
    return destination.stream;
  };

  useEffect(() => {
    console.log("triggered useffect");
    ws.onopen = () => console.log("Connection established!!");
    if (host?.isLocal)
      // event: MessageEvent<BlobPart>
      ws.onmessage = event => {
        const audioBlob = new Blob([event.data]);
        audioBlob
          .arrayBuffer()
          .then(buffer => createAudioBuffer(buffer, audioContext))
          .then(audioBuffer => {
            const mediaStream = bufferToStream(audioBuffer, audioContext);
            const audioTrack = mediaStream.getAudioTracks()[0]; // Extracting the audio track - MediaStreamTrack
            return audioTrack;
          })
          .then(track => hmsActions.addTrack(track, "regular"))
          .then(() => console.log("TRACK ADDEDD!"));
      };
    ws.onclose = () => {
      console.log("Connection closed");
    };
  }, [audioContext, hmsActions, host?.isLocal, isConnected, ws]);
  
  return ws;
};

export default useWebSocket;
