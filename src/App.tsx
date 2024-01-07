import React, { useEffect, useState } from "react";

import { Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import BottomPanel from "./components/BottomPanel/BottomPanel";
import LandingPage from "./components/LandingPage/LandingPage";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import VisualisationPanel from "./components/VisualisationPanel/VisualisationPanel";
import useAgentStore from "./stores/agentStore";
import usePanelDimensionsStore from "./stores/panelDimensionsStore";

function App() {
  const setContainerDimensions = usePanelDimensionsStore(
    (store) => store.setDimensions,
  );

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const agentLoading = useAgentStore((store: any) => store.agentLoading);

  useEffect(() => {
    function updateContainerDimensions() {
      const container = document.getElementById("container");
      if (container) {
        setContainerWidth(container.clientWidth);
        setContainerHeight(container.clientHeight);
      }
    }

    updateContainerDimensions();

    window.addEventListener("resize", updateContainerDimensions);

    return () => {
      window.removeEventListener("resize", updateContainerDimensions);
    };
  }, []);

  useEffect(() => {
    setContainerDimensions("container", "width", containerWidth);
    setContainerDimensions("container", "height", containerHeight);
  }, [containerWidth, containerHeight, setContainerDimensions]);

  return (
    <div className="flex flex-col w-full h-full" id="container">
      {agentLoading && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50 flex justify-center items-center"
          id="loading-screen"
        >
          <div className="flex flex-col mb-12 items-center animate-pulse space-y-4">
            <Icon type="coffee" size={10} className=" text-white" />
            <Typography variant="h4" className="text-white pb-4">
              Starting the API...
            </Typography>
          </div>
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
