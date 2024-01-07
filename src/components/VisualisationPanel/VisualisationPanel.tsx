import { useEffect, useMemo, useState } from "react";

import { Tabs } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import ApiChart from "./Chart/ApiChart";
import DependencyGraph from "./DependencyGraph/DependencyGraph";
import RelationshipVisualizer from "./RelationshipVisualizer/RelationshipVisualizer";
import SimulationControls from "./SimulationControls";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";

export default function VisualisationPanel() {
  const { left, right, middle, bottom, container } = usePanelDimensionsStore(
    (store) => store.panels,
  );
  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);

  const [activeTab, setActiveTab] = useState(0);
  const [position, setPosition] = useState<number>(left.width);
  const ref = useResizeObserver("middle", setDimensions);

  useEffect(() => {
    setPosition(left.width + 24);
  }, [left.width]);

  const controlsOverlapping: boolean = useMemo(() => {
    return middle.width < 780;
  }, [middle.width]);

  return (
    <div
      style={{
        left: `${position}px`,
        width: container.width - left.width - right.width - 24,
        height: container.height - bottom.height - 8,
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
          className="relationship-tab"
          label="Relationships"
          icon={<Icon type="swap" variant="light" />}
          onClick={setActiveTab}
        >
          <RelationshipVisualizer />
        </Tabs.Tab>
      </Tabs>
      <SimulationControls shouldReposition={controlsOverlapping} />
    </div>
  );
}
