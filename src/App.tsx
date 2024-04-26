import "./App.css";
import Conference from "./Conference";
import JoinForm from "./JoinForm";
import { selectIsConnectedToRoom, useHMSActions, useHMSStore } from "@100mslive/react-sdk";

export default function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();

  return (
    <div className="App">
      {isConnected ? (
        <Conference />
      ) : (
        <JoinForm />
      )}
      <br />
      <button onClick={() => {
        if (isConnected)
          hmsActions.leave();
      }}>
        Leave
      </button>
    </div>
  );
}
