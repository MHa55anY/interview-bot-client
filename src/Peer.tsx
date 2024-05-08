import { HMSPeer, selectAppData, useHMSActions, useHMSStore, useVideo } from "@100mslive/react-sdk";
import { useEffect, useMemo, useState } from "react";

function Peer({ peer }: {peer: HMSPeer}) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });
  const hmsActions = useHMSActions();
  const audioTrackId = peer.audioTrack;
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const isRecord: boolean = useHMSStore(selectAppData("record"));
  const websocketConn: WebSocket = useHMSStore(selectAppData("wsConn"));
  const mediaRecorder = useMemo(() => audioStream ? new MediaRecorder(audioStream) : undefined, [audioStream]);
  const [audioSrc, setAudioSrc] = useState('');

  useEffect(() => {
    console.log(audioStream);
  }, [audioStream]);

  useEffect(() => {
    if(audioTrackId !== undefined && peer.roleName==='guest') {
      const audioTrack = hmsActions.getNativeTrackById(audioTrackId);
      if(audioTrack) {
        setAudioStream(new MediaStream([audioTrack]));
      }
    }
  },[audioTrackId, hmsActions, peer.roleName]);

  useEffect(() => {
    if(mediaRecorder) {
      const recordedChunks: Blob[] = [];
      // Event handler to store chunks of data
      mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        // Combine all recorded chunks into a single Blob
        const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
        const blobUrl = URL.createObjectURL(blob);
        setAudioSrc(blobUrl);
        // Send blob over websocket
        websocketConn.send(blob);
      };
      if(isRecord) {
        mediaRecorder.start();
      }
      else {
        mediaRecorder.stop();
      }
    }
  }, [isRecord, mediaRecorder, websocketConn])

  return (
    <div className="peer-container">
      <video
        ref={videoRef}
        className={`peer-video ${peer.isLocal ? "local" : ""}`}
        autoPlay
        muted
        playsInline
      />
      <div className="peer-name">
        {peer.name} {peer.isLocal ? "(You)" : ""}
      </div>
      <figure>
        <figcaption>Listen to Recorded audio:</figcaption>
        <audio controls src={audioSrc} />
      </figure>
    </div>
  );
}

export default Peer;
