import { HMSPeer, selectAppData, selectLocalAudioTrackID, useHMSActions, useHMSStore, useVideo } from "@100mslive/react-sdk";
import { useEffect, useState } from "react";

function Peer({ peer }: {peer: HMSPeer}) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });
  const hmsActions = useHMSActions();
  const audioTrackId = useHMSStore(selectLocalAudioTrackID);
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const state: boolean = useHMSStore(selectAppData("record"));

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
