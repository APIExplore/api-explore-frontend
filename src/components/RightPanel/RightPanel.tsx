import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { ResizableBox } from "react-resizable";

import { StatusButton, Tabs, Typography } from "@tiller-ds/core";
import { CheckboxGroup, Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { Autocomplete } from "@tiller-ds/selectors";
import { ComponentTokens } from "@tiller-ds/theme";

import DragDrop from "./DragDrop";
import { Item, Request } from "./types/RightPanelTypes";
import { backendDomain } from "../../constants/apiConstants";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import { useRequestsStore } from "../../stores/requestsStore";

export default function RightPanel() {
  const containerHeight = usePanelDimensionsStore(
    (store) => store.panels.container.height,
  );
  const bottomPanelHeight = usePanelDimensionsStore(
    (store) => store.panels.bottom.height,
  );

  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);
  const setSelectedRequests = useRequestsStore(
    (store: any) => store.setSelectedRequests,
  );
  const setAllRequests = useRequestsStore((store: any) => store.setAllRequests);
  const allRequests = useRequestsStore((store: any) => store.allRequests);
  const [isFetched, setIsFetched] = useState(false);
  const selectedRequests = useRequestsStore(
    (store: any) => store.selectedRequests,
  );
  const isMountingRef = useRef(false);
  const [inputError, setInputError] = useState("");
  const [apiSchema, setApiSchema] = useState(
    "http://localhost:8080/swagger.json",
  );
  const [selectedMethods, setSelectedMethods]: any = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });
  const [shownItems, setShownItems] = useState<Item[] | Request[]>(allRequests);

  const ref = useResizeObserver("right", setDimensions);

  useEffect(() => {
    if (isFetched) {
      setInputError("");
    }
  }, [isFetched]);

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

  function convertSchemaToList(schema: any) {
    const items: Item[] = [];

    for (const path in schema) {
      for (const method in schema[path]) {
        if (schema[path][method]) {
          items.push({
            path: path,
            method: method,
            operationId: schema[path][method].operationId,
          });
        }
      }
    }

    setAllRequests(items);
    setShownItems(items);
  }

  // Function when checkbox is selected
  function onCheckboxChange(val: any) {
    setSelectedMethods({ ...val });
  }

  // Function when new endpoint is selected
  function onEndpointsChange(val: Item[]) {
    setSelectedRequests(val);
  }

  // set value to apischmea string on change
  function onApiSchemaInputChange(val: any) {
    setApiSchema(val.target.value);
  }

  // Submit api adress to backend
  async function submitApiAdress() {
    try {
      const data = await axios.post(`${backendDomain}/apiSchema/fetch`, {
        address: apiSchema,
      });

      if (data.status != 201) {
        setInputError(data.data.error);
      }

      convertSchemaToList(data.data);

      // Show confirmation message
      setIsFetched(true);
      setTimeout(() => {
        setIsFetched(false);
      }, 3000);
    } catch (e: any) {
      setInputError(e.response ? e.response.data.error : e.message);
    }
  }

  // Filter requests depending on checkboxes
  const filterRequests = () => {
    if (
      !selectedMethods.get &&
      !selectedMethods.post &&
      !selectedMethods.put &&
      !selectedMethods.delete
    ) {
      setShownItems(allRequests);
    } else {
      setShownItems(
        allRequests.filter(
          (item: any) => selectedMethods[item.method] === true,
        ),
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
            label="API Schema"
            className="api-schema-tab"
            icon={<Icon type="file-text" variant="fill" />}
          >
            <div className="flex flex-col w-full h-full">
              <div className="py-3 mt-6 text-center">
                <Typography variant="h6">Enter schema adress:</Typography>
              </div>

              <div className="flex flex-col my-2">
                <Input
                  id="schema-adress-input"
                  label="Api schema adress"
                  error={inputError}
                  className="py-2"
                  name="test"
                  onChange={onApiSchemaInputChange}
                  placeholder="API schema adress"
                  value={apiSchema}
                />
                <StatusButton
                  status={isFetched ? "success" : inputError ? "error" : "idle"}
                  id="submit-adress-button"
                  className="my-2 w-full h-50"
                  variant="outlined"
                  onClick={submitApiAdress}
                >
                  Submit schema
                </StatusButton>
                <div className="h-4">
                  {isFetched && (
                    <p
                      id="schema-fetched"
                      className="text-green-600 mt-2 text-base text-center"
                    >
                      Schema fetched
                    </p>
                  )}
                </div>
              </div>
              <div className="py-3 mt-6 text-center">
                <Typography variant="h6">Or upload schema as json:</Typography>
              </div>
              <DragDrop onFileUpload={convertSchemaToList} />
            </div>
          </Tabs.Tab>
          <Tabs.Tab
            icon={<Icon type="faders" variant="fill" />}
            label="Configuration"
            className="config-tab flex flex-row justify-center"
          >
            <div className="py-3 mt-6">
              <Typography variant="h6">Selected endpoints</Typography>
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
                  options={shownItems as Item[]}
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
