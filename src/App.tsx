import React, { useEffect } from "react";

import BottomPanel from "./components/BottomPanel/BottomPanel";
import LandingPage from "./components/LandingPage/LandingPage";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import VisualisationPanel from "./components/VisualisationPanel/VisualisationPanel";
import usePanelDimensionsStore from "./stores/panelDimensionsStore";

function App() {
  const setContainerDimensions = usePanelDimensionsStore(
    (store) => store.setDimensions,
  );

  useEffect(() => {
    setContainerDimensions(
      "container",
      "width",
      Number(document.getElementById("container")?.clientWidth),
    );
    setContainerDimensions(
      "container",
      "height",
      Number(document.getElementById("container")?.clientHeight),
    );
  }, []);

  return (
    <div className="flex flex-col w-full h-full" id="container">
      <LandingPage />
      <div className="flex justify-between w-full h-full">
        <LeftPanel />
        <VisualisationPanel />
        <RightPanel />
      </div>
      <BottomPanel />
    </div>
  );
}

export default App;
