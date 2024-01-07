import { useState } from "react";

import { ResizableBox } from "react-resizable";

import { useModal } from "@tiller-ds/alert";
import { Tabs } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import Details from "./Details";
import HtmlDetails from "./HtmlDetails";
import Metrics from "./Metrics";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";

export default function LeftPanel() {
  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);
  const modal = useModal();
  const [clickedApiCall, setClickedApiCall] = useState();
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
            className="details-tab"
            icon={<Icon type="magnifying-glass" variant="fill" />}
          >
            <Details modal={modal} setClickedApiCall={setClickedApiCall} />
          </Tabs.Tab>
          <Tabs.Tab
            className="metrics-tab"
            label="Metrics"
            icon={<Icon type="gauge" variant="fill" />}
          >
            <Metrics />
          </Tabs.Tab>
        </Tabs>
        <HtmlDetails modal={modal} clickedApiCall={clickedApiCall} />
      </div>
    </ResizableBox>
  );
}
