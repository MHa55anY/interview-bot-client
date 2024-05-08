import { useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";

function JoinForm() {
  const hmsActions = useHMSActions();
  const [inputValues, setInputValues] = useState({
    userName: "",
    roomCode: ""
  });

  const handleInputChange:React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit:React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const {
      userName,
      roomCode,
    } = inputValues

    const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });

    try {
      await hmsActions.join({ userName, authToken });
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <form id="joinForm" onSubmit={handleSubmit}>
      <h2>Join Room</h2>
      <div className="input-container">
        <input
          required
          value={inputValues.userName}
          onChange={handleInputChange}
          id="userName"
          type="text"
          name="userName"
          placeholder="Your name"
        />
      </div>
      <div className="input-container">
        <input
          id="roomCode"
          type="text"
          name="roomCode"
          placeholder="Room code"
          onChange={handleInputChange}
        />
      </div>
      <button className="btn-primary" type="submit">Join</button>
    </form>
  );
}

export default JoinForm;
