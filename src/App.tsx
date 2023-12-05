import React, { useEffect } from "react";

import BottomPanel from "./components/BottomPanel/BottomPanel";
import LandingPage from "./components/LandingPage/LandingPage";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import VisualisationPanel from "./components/VisualisationPanel/VisualisationPanel";
import usePanelDimensionsStore from "./stores/panelDimensionsStore";
import { LoadingIcon } from "@tiller-ds/icons";
import useAgentStore from "./stores/agentStore";

function App() {
  const setContainerDimensions = usePanelDimensionsStore(
    (store) => store.setDimensions
  );

  const agentLoading = useAgentStore((store: any) => store.agentLoading);

  useEffect(() => {
    setContainerDimensions(
      "container",
      "width",
      Number(document.getElementById("container")?.clientWidth)
    );
    setContainerDimensions(
      "container",
      "height",
      Number(document.getElementById("container")?.clientHeight)
    );
  }, []);

  return (
    <div className="flex flex-col w-full h-full" id="container">
      {agentLoading && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50 flex justify-center items-center"
          id="loading-screen"
        >
          <LoadingIcon size={6} className="text-white" />
        </div>
      )}
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
