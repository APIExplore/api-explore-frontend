import { useEffect, useRef, useState } from "react";
import { ResizableBox } from "react-resizable";
import { Tabs, Typography } from "@tiller-ds/core";
import { CheckboxGroup, Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { Autocomplete } from "@tiller-ds/selectors";
import { ComponentTokens } from "@tiller-ds/theme";
import { Item } from "./types/RightPanelTypes";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import { useRequestsStore } from "../../stores/requestsStore";

export default function RightPanel() {
  const containerHeight = usePanelDimensionsStore(
    (store) => store.panels.container.height
  );
  const bottomPanelHeight = usePanelDimensionsStore(
    (store) => store.panels.bottom.height
  );

  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);
  const setSelectedRequests = useRequestsStore(
    (store: any) => store.setSelectedRequests
  );
  const allRequests = useRequestsStore((store: any) => store.allRequests);
  const selectedRequests = useRequestsStore(
    (store: any) => store.selectedRequests
  );
  const isMountingRef = useRef(false);
  const [selectedMethods, setSelectedMethods]: any = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });
  const allShownItems = useRequestsStore((store: any) => store.allShownItems);
  const setAllShownItems = useRequestsStore(
    (store: any) => store.setAllShownItems
  );

  const ref = useResizeObserver("right", setDimensions);

  const autocompleteText: ComponentTokens<"Autocomplete"> = {
    Item: {
      base: {
        regular:
          "w-full text-sm px-4 py-2 block leading-5 cursor-pointer text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:text-slate-900 focus:bg-slate-100",
      },
      active: {
        regular:
          "w-full text-sm px-4 py-2 block leading-5 cursor-pointer text-slate-900 bg-slate-100 focus:outline-none",
      },
    },
  };

  // Function when checkbox is selected
  function onCheckboxChange(val: any) {
    setSelectedMethods({ ...val });
  }

  // Function when new endpoint is selected
  function onEndpointsChange(val: Item[]) {
    setSelectedRequests(val);
  }

  // Filter requests depending on checkboxes
  const filterRequests = () => {
    if (
      !selectedMethods.get &&
      !selectedMethods.post &&
      !selectedMethods.put &&
      !selectedMethods.delete
    ) {
      setAllShownItems(allRequests);
    } else {
      setAllShownItems(
        allRequests.filter((item: any) => selectedMethods[item.method] === true)
      );
    }
  };
  // Simulate initial load
  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  // On change for methods checkboxes change filter items
  useEffect(() => {
    if (!isMountingRef.current) {
      filterRequests();
    } else {
      isMountingRef.current = false;
    }
  }, [selectedMethods]);

  // Filter requests on each selection so it filters out unwanted methods
  useEffect(() => {
    if (!isMountingRef.current) {
      filterRequests();
    } else {
      isMountingRef.current = false;
    }
  }, [selectedRequests]);

  return (
    <ResizableBox
      width={400}
      height={containerHeight - bottomPanelHeight - 12}
      resizeHandles={["w"]}
    >
      <div
        className="flex h-full m-1 p-4 bg-white drop-shadow-md"
        ref={ref}
        id="right-panel"
      >
        <Tabs iconPlacement="trailing" fullWidth={true}>
          <Tabs.Tab
            icon={<Icon type="faders" variant="fill" />}
            label="Configuration"
            className="config-tab flex flex-row justify-center"
          >
            <div className="py-3 mt-6 text-center">
              <Typography variant="h6">Selected Endpoints</Typography>
            </div>
            <div className="my-2 text-left">
              <CheckboxGroup
                label={
                  <Typography className="my-3 font-semibold">
                    Filter by method:
                  </Typography>
                }
                name="methods"
                className="my-2"
                onChange={onCheckboxChange}
                value={selectedMethods}
                vertical
              >
                <div className="inline-grid grid-cols-2 gap-2">
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="GET"
                    value="get"
                  />
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="POST"
                    value="post"
                  />
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="PUT"
                    value="put"
                  />
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="DELETE"
                    value="delete"
                  />
                </div>
              </CheckboxGroup>
              <div className="my-5">
                <Autocomplete
                  label="Endpoints"
                  name="Endpoints"
                  onChange={(v) => Array.isArray(v) && onEndpointsChange(v)}
                  onReset={() => setSelectedRequests([])}
                  getOptionLabel={(item) => (
                    <div className="text-body">
                      {item.method.toUpperCase()} {item.operationId}
                    </div>
                  )}
                  options={allShownItems as Item[]}
                  allowMultiple={true}
                  getOptionValue={(item) => item.path + "|" + item.method}
                  filter={(name: string, option) => {
                    return (
                      option.method.toLowerCase() +
                      " " +
                      option.operationId.toLowerCase()
                    ).includes(name.toLowerCase());
                  }}
                  autocompleteTokens={autocompleteText}
                />
              </div>
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </ResizableBox>
  );
}
