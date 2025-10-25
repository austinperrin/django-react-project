import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./Login.jsx";
import "./index.css";
import { getTokens } from "./auth";

function Root() {
  const hasTokens = !!getTokens();
  const [authed, setAuthed] = React.useState(hasTokens);

  return authed ? (
    <App />
  ) : (
    <Login onSuccess={() => setAuthed(true)} />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
