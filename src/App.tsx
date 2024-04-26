import "./App.css";
import JoinForm from "./JoinForm";
import { useHMSActions } from "@100mslive/react-sdk";

export default function App() {
  const hmsActions = useHMSActions();

  return (
    <div className="App">
      <JoinForm />
      <br />
      <button onClick={() => {
        hmsActions.leave();
      }}>
        Leave
      </button>
    </div>
  );
}
