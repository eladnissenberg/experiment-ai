import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

console.log("Main.jsx is executing");
const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App rendered successfully");
} catch (error) {
  console.error("Rendering error:", error);
}