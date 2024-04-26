import "./App.css";
import Conference from "./Conference";
import Footer from "./Footer";
import JoinForm from "./JoinForm";
import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";

export default function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  return (
    <div className="App">
      {isConnected ? (
        <>
          <Conference />
          <Footer />
        </>
      ) : (
        <JoinForm />
      )}
      <br />
    </div>
  );
}
