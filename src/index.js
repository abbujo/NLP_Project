import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AuthProvider from "./contexts/authContexts";
// import DataProvider from "./contexts/dataContexts";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      {/* <DataProvider> */}
      <App />
      {/* </DataProvider> */}
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
