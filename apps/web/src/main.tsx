import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import FallbackLoader from "./component/FallbackLoader";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<FallbackLoader />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
