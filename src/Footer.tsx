import {useAVToggle, useHMSActions } from "@100mslive/react-sdk";

function Footer() {
  const {
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleAudio,
    toggleVideo
  } = useAVToggle();
  const hmsActions = useHMSActions();
  return (
    <div className="control-bar">
      <button className="btn-control" onClick={toggleAudio}>
        {isLocalAudioEnabled ? "Mute" : "Unmute"}
      </button>
      <button className="btn-control" onClick={toggleVideo}>
        {isLocalVideoEnabled ? "Hide" : "Unhide"}
      </button>
      <button className="btn-primary" onClick={() => {
          hmsActions.leave();
      }}>
        Leave
      </button>
    </div>
  );
}

export default Footer;
