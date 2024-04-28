import {selectAppData, useAVToggle, useHMSActions, useHMSStore } from "@100mslive/react-sdk";
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
  const handleRecord = (record: boolean) => {
    setRecord(record);
    if(record) hmsActions.setAppData("record", true);
    else hmsActions.setAppData("record", false);
  };
  const websocketConn: WebSocket = useHMSStore(selectAppData("wsConn"));
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
      <button className="btn-primary" onClick={() => handleRecord(!record)}>
        {record ? "Stop" : "Record"}
      </button>
      <button onClick={() => websocketConn.close()}>Close websocket</button>
    </div>
  );
}

export default Footer;
