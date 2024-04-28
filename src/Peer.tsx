import { HMSPeer, selectAppData, selectLocalAudioTrackID, useHMSActions, useHMSStore, useVideo } from "@100mslive/react-sdk";
import { useEffect, useMemo, useState } from "react";

function Peer({ peer }: {peer: HMSPeer}) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });
  const hmsActions = useHMSActions();
  const audioTrackId = useHMSStore(selectLocalAudioTrackID);
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const isRecord: boolean = useHMSStore(selectAppData("record"));
  const websocketConn: WebSocket = useHMSStore(selectAppData("wsConn"));
  const mediaRecorder = useMemo(() => audioStream ? new MediaRecorder(audioStream) : undefined, [audioStream]);

  useEffect(() => {
    console.log(audioStream);
  }, [audioStream]);

  useEffect(() => {
    if(audioTrackId !== undefined) {
      const audioTrack = hmsActions.getNativeTrackById(audioTrackId);
      if(audioTrack) {
        setAudioStream(new MediaStream([audioTrack]));
      }
    }
  },[audioTrackId, hmsActions]);

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
    </div>
  );
}

export default Peer;
