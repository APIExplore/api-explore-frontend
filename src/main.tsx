import React from "react";

import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@tiller-ds/theme";

import App from "./App";
import "./index.css";
import {
  defaultComponentConfig,
  defaultIconConfig,
} from "./theme/tiller.config";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider
      themeConfig={defaultComponentConfig}
      iconConfig={defaultIconConfig}
    >
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
