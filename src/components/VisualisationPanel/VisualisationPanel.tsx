import { useEffect, useState } from "react";

import { Tabs } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import ApiChart from "./Chart/ApiChart";
import DependencyGraph from "./DependencyGraph/DependencyGraph";
import RelationshipVisualizer from "./RelationshipVisualizer/RelationshipVisualizer";
import SimulationControls from "./SimulationControls";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";

export default function VisualisationPanel() {
  const leftPanelWidth = usePanelDimensionsStore(
    (store) => store.panels.left.width,
  );
  const rightPanelWidth = usePanelDimensionsStore(
    (store) => store.panels.right.width,
  );
  const bottomPanelHeight = usePanelDimensionsStore(
    (store) => store.panels.bottom.height,
  );
  const containerDimensions = usePanelDimensionsStore(
    (store) => store.panels.container,
  );
  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);

  const [activeTab, setActiveTab] = useState(0);
  const [position, setPosition] = useState<number>(leftPanelWidth);
  const ref = useResizeObserver("middle", setDimensions);

  useEffect(() => {
    setPosition(leftPanelWidth + 24);
  }, [leftPanelWidth]);

  return (
    <div
      style={{
        left: `${position}px`,
        width:
          containerDimensions.width - leftPanelWidth - rightPanelWidth - 24,
        height: containerDimensions.height - bottomPanelHeight - 8,
      }}
      className="absolute col-span-6 p-2 m-1 bg-white drop-shadow-md h-full"
      ref={ref}
      id="middle-panel"
    >
      <Tabs iconPlacement="trailing">
        <Tabs.Tab
          label="Timeline"
          className="timeline-tab"
          icon={<Icon type="rows" variant="light" />}
          onClick={setActiveTab}
        >
          <ApiChart />
        </Tabs.Tab>
        <Tabs.Tab
          className="dependency-graph-tab"
          label="Dependency Graph"
          icon={<Icon type="tree-structure" variant="light" />}
          onClick={setActiveTab}
        >
          <DependencyGraph isOpened={activeTab === 1} />
        </Tabs.Tab>
        <Tabs.Tab
          className="dependency-graph-tab"
          label="Relationships"
          icon={<Icon type="swap" variant="light" />}
          onClick={setActiveTab}
        >
          <RelationshipVisualizer />
        </Tabs.Tab>
      </Tabs>
      <SimulationControls />
    </div>
  );
}
