import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AppProviders } from "@app/context/AppProviders";
import { WebApp } from "./webApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <BrowserRouter>
        <WebApp />
      </BrowserRouter>
    </AppProviders>
  </React.StrictMode>
);
