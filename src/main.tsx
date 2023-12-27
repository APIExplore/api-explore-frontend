import React from "react";

import ReactDOM from "react-dom/client";

import { NotificationProvider } from "@tiller-ds/alert";
import { ThemeProvider } from "@tiller-ds/theme";

import App from "./App";
import "./index.css";
import "./App.css";
import {
  defaultComponentConfig,
  defaultIconConfig,
} from "./theme/tiller.config";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NotificationProvider position="topCenter">
      <ThemeProvider
        themeConfig={defaultComponentConfig}
        iconConfig={defaultIconConfig}
      >
        <App />
      </ThemeProvider>
    </NotificationProvider>
  </React.StrictMode>,
);
