import {useAVToggle, useHMSActions } from "@100mslive/react-sdk";
import { useState } from "react";

function Footer() {
  const {
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleAudio,
    toggleVideo
  } = useAVToggle();
  const hmsActions = useHMSActions();
  const [record, setRecord] = useState(false);
  const handleRecord = () => {
    if(record) hmsActions.setAppData("record", true);
    else hmsActions.setAppData("record", false);
    setRecord((prev) => !prev);
  };
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
      <button className="btn-primary" onClick={handleRecord}>
        {record ? "Record" : "Stop"}
      </button>
    </div>
  );
}

export default Footer;
