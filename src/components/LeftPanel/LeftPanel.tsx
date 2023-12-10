import { ResizableBox } from "react-resizable";

import { Tabs } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import Details from "./Details";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";

export default function LeftPanel() {
  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);
  const containerHeight = usePanelDimensionsStore(
    (store) => store.panels.container.height,
  );
  const bottomPanelHeight = usePanelDimensionsStore(
    (store) => store.panels.bottom.height,
  );
  const ref = useResizeObserver("left", setDimensions);
  return (
    <ResizableBox
      width={400}
      height={containerHeight - bottomPanelHeight - 8}
      resizeHandles={["e"]}
    >
      <div
        className="h-full m-1 p-2 bg-white drop-shadow-md"
        ref={ref}
        id="left-panel"
      >
        <Tabs iconPlacement="trailing" fullWidth={true} className="w-full">
          <Tabs.Tab
            label="Details"
            icon={<Icon type="magnifying-glass" variant="fill" />}
          >
            <Details />
          </Tabs.Tab>
          <Tabs.Tab label="Metrics" icon={<Icon type="list" variant="fill" />}>
            Metrics
          </Tabs.Tab>
        </Tabs>
      </div>
    </ResizableBox>
  );
}
