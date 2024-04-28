import { HMSPeer, selectAppData, selectLocalAudioTrackID, useHMSActions, useHMSStore, useVideo } from "@100mslive/react-sdk";
import { useEffect, useState } from "react";

function Peer({ peer }: {peer: HMSPeer}) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });
  const hmsActions = useHMSActions();
  const audioTrackId = useHMSStore(selectLocalAudioTrackID);
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const isRecord: boolean = useHMSStore(selectAppData("record"));
  const websocketConn: WebSocket = useHMSStore(selectAppData("wsConn"));

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
    if(audioStream) {
      const mediaRecorder = new MediaRecorder(audioStream);
      if(isRecord) {
        mediaRecorder.start();
        const recordedChunks: Blob[] = [];
          // Event handler to store chunks of data
        mediaRecorder.ondataavailable = (event) => {
          console.log("WSCONNN ", websocketConn);
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
          // Event handler when recording stops
          mediaRecorder.onstop = () => {
            // Combine all recorded chunks into a single Blob
            const blob = new Blob(recordedChunks, { type: 'audio/wav' });
    
            // Now you can send this blob over WebSocket
            websocketConn.send(blob);
          };
        };
      }
      else {
        mediaRecorder.stop();
      }
    }
  }, [audioStream, isRecord, websocketConn])

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
