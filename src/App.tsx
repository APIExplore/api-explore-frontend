import React from "react";

import BottomPanel from "./components/BottomPanel/BottomPanel";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import VisualisationPanel from "./components/VisualisationPanel/VisualisationPanel";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row">
        <LeftPanel />
        <VisualisationPanel />
        <RightPanel />
      </div>
      <BottomPanel />
    </div>
  );
}

export default App;
