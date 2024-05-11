import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import './index.css'

import App from "./App";
import { HMSPrebuilt } from "./PrebuiltSrc";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <HMSPrebuilt />,
  rootElement
);

