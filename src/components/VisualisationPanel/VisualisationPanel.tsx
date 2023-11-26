import { useEffect, useState } from "react";

import { Button, Tabs } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import ApiChart from "./Chart/ApiChart";
import SimulationControls from "./SimulationControls";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import LandingPage from "../LandingPage/LandingPage";

export default function VisualisationPanel() {
  const leftPanelWidth = usePanelDimensionsStore(
    (store) => store.panels.left.width
  );
  const rightPanelWidth = usePanelDimensionsStore(
    (store) => store.panels.right.width
  );
  const bottomPanelHeight = usePanelDimensionsStore(
    (store) => store.panels.bottom.height
  );

  const containerDimensions = usePanelDimensionsStore(
    (store) => store.panels.container
  );
  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);
  const [position, setPosition] = useState<number>(leftPanelWidth);
  const [openLandingPage, setOpenLandingPage] = useState(false);
  const ref = useResizeObserver("middle", setDimensions);

  useEffect(() => {
    setPosition(leftPanelWidth + 24);
  }, [leftPanelWidth]);

  const openLandingPageFunction = () => {
    console.log("klik na button");
    setOpenLandingPage(true); // Open the modal when the button is clicked
  };

  return (
    <div>
      <Button onClick={openLandingPageFunction}>Choose schema</Button>
      {openLandingPage && <LandingPage />}

      <div
        style={{
          left: `${position}px`,
          width:
            containerDimensions.width - leftPanelWidth - rightPanelWidth - 24,
          height: containerDimensions.height - bottomPanelHeight - 12,
        }}
        className="absolute col-span-6 p-4 m-1 bg-white drop-shadow-md h-full"
        ref={ref}
        id="middle-panel"
      >
        <Tabs iconPlacement="trailing">
          <Tabs.Tab
            label="Timeline"
            icon={<Icon type="rows" variant="light" />}
          >
            <ApiChart />
          </Tabs.Tab>
          <Tabs.Tab
            label="Dependency Graph"
            icon={<Icon type="tree-structure" variant="light" />}
          >
            Dependency Graph
          </Tabs.Tab>
        </Tabs>
        <SimulationControls />
      </div>
    </div>
  );
}
