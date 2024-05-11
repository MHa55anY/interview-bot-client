import { FC, useEffect, useMemo, useState } from "react";
import {
  selectAppData,
  selectPeers,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Button } from "@100mslive/roomkit-react";

const Recorder: FC<{nativeTrack?: MediaStreamTrack, websocketConn: WebSocket}> = ({ nativeTrack, websocketConn }) => {
  const hmsActions = useHMSActions();
  const interviewee = useHMSStore(selectPeers).find(
    p => p?.roleName === "guest"
  );
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const isRecord = useHMSStore(selectAppData("record"));
  const [record, setRecord] = useState(false);
  const handleRecord = (record: boolean) => {
    setRecord(record);
    if (record) hmsActions.setAppData("record", true);
    else hmsActions.setAppData("record", false);
  };
  const mediaRecorder = useMemo(
    () => (audioStream ? new MediaRecorder(audioStream) : undefined),
    [audioStream]
  );

  useEffect(() => {
    if (interviewee?.roleName === "guest") {
      if (nativeTrack) {
        setAudioStream(new MediaStream([nativeTrack]));
      }
    }
  }, [interviewee?.roleName, nativeTrack]);

  useEffect(() => {
    if (mediaRecorder) {
      const recordedChunks:BlobPart[] = [];
      // Event handler to store chunks of data
      mediaRecorder.ondataavailable = event => {
        recordedChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        // Combine all recorded chunks into a single Blob
        const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
        // Send blob over websocket
        console.log("SENDING AUDIO")
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
