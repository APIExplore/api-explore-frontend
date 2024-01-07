import React from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ResizableBox } from "react-resizable";

import { Tabs } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import CallsTable from "./CallsTable";
import Terminal from "./Terminal";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";

export default function BottomPanel() {
  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);
  const containerWidth = usePanelDimensionsStore(
    (store) => store.panels.container.width,
  );

  const ref = useResizeObserver("bottom", setDimensions);

  return (
    <ResizableBox
      width={containerWidth - 8}
      height={400}
      resizeHandles={["n"]}
      transformScale={0.3}
    >
      <div
        className="w-full h-full bg-white m-1 p-2 drop-shadow-md"
        ref={ref}
        id="bottom-panel"
      >
        <Tabs iconPlacement="trailing">
          <Tabs.Tab
            label="Event Table"
            className="event-tab"
            icon={<Icon type="table" variant="fill" />}
          >
            <CallsTable />
          </Tabs.Tab>
          <Tabs.Tab
            label="Logs"
            className="log-tab"
            icon={<Icon type="terminal" />}
          >
            <Terminal />
          </Tabs.Tab>
        </Tabs>
      </div>
    </ResizableBox>
  );
}
