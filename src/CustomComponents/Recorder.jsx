import { useEffect, useMemo, useState } from "react";
import {
  selectAppData,
  selectPeers,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Button } from "@100mslive/roomkit-react";

const Recorder = () => {
  const hmsActions = useHMSActions();
  const interviewee = useHMSStore(selectPeers).find(
    p => p?.roleName === "guest"
  );
  const audioTrackId = interviewee.audioTrack;
  const [audioStream, setAudioStream] = useState();
  const isRecord = useHMSStore(selectAppData("record"));
  const websocketConn = useHMSStore(selectAppData("wsConn"));
  const [record, setRecord] = useState(false);
  const handleRecord = record => {
    setRecord(record);
    if (record) hmsActions.setAppData("record", true);
    else hmsActions.setAppData("record", false);
  };
  const mediaRecorder = useMemo(
    () => (audioStream ? new MediaRecorder(audioStream) : undefined),
    [audioStream]
  );
  console.log("hmsActions", hmsActions);
  useEffect(() => {
    if (audioTrackId !== undefined && interviewee.roleName === "guest") {
      const audioTrack = hmsActions.getNativeTrackById(audioTrackId);
      if (audioTrack) {
        setAudioStream(new MediaStream([audioTrack]));
      }
    }
  }, [audioTrackId, hmsActions, interviewee.roleName]);

  useEffect(() => {
    if (mediaRecorder) {
      const recordedChunks = [];
      // Event handler to store chunks of data
      mediaRecorder.ondataavailable = event => {
        recordedChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        // Combine all recorded chunks into a single Blob
        const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
        // Send blob over websocket
        websocketConn.send(blob);
      };
      if (isRecord) {
        mediaRecorder.start();
      } else {
        mediaRecorder.stop();
      }
    }
  }, [isRecord, mediaRecorder, websocketConn]);

  return (
    <Button onClick={() => handleRecord(!record)}>
      {record ? "Stop" : "Record"}
    </Button>
  );
};

export default Recorder;
