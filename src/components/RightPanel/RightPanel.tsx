import { Tabs, Button } from "@tiller-ds/core";
import { CheckboxGroup, Input } from "@tiller-ds/form-elements";
import { ComponentTokens } from "@tiller-ds/theme";
import { Autocomplete } from "@tiller-ds/selectors";
import { Icon } from "@tiller-ds/icons";
import { useRequestsStore } from "../../stores/requestsStore";
import DragDrop from "./DragDrop";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Item } from "./types/RightPanelTypes";
import { backendDomain } from "../../constants/apiConstants";

export default function RightPanel() {
  const setSelectedRequests = useRequestsStore(
    (store: any) => store.setSelectedRequests
  );
  const setAllRequests = useRequestsStore((store: any) => store.setAllRequests);
  const allRequests = useRequestsStore((store: any) => store.allRequests);
  const selectedRequests = useRequestsStore(
    (store: any) => store.selectedRequests
  );
  const isMountingRef = useRef(false);
  const [inputError, setInputError] = useState("");
  const [apiSchema, setApiSchema] = useState(
    "http://localhost:8080/swagger.json"
  );
  const [selectedMethods, setSelectedMethods]: any = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });
  const [shownItems, setShownItems] = useState(allRequests);

  // Props for autocomplete component
  const frontendProps = {
    name: "Endpoints",
    onChange: onEndpointsChange,
    getOptionLabel: (item: any) => (
      <div>
        {item.method.toUpperCase()} {item.path}
      </div>
    ),
    sort: (items: any[]) => items.sort((a, b) => a.path.localeCompare(b.path)),
    options: shownItems,
    allowMultiple: true,
    getOptionValue: (item: any) => item.path + "|" + item.method,
    filter: (path: string, option: any) => option.path.toLowerCase(),
  };

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
    let items: Item[] = [];

    for (const path in schema.paths) {
      for (const method in schema.paths[path]) {
        if (schema.paths[path][method]) {
          items.push({
            path: path,
            method: method,
            // parameters: schema.paths[path][method].parameters,
          });
        }
      }
    }

    return items;
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

  function onFileUpload(event) {
    const data = JSON.parse(event.target.result);
    const schemaList = convertSchemaToList(data);
    setAllRequests(schemaList);
    setShownItems(schemaList);
  }

  // Submit api adress to backend
  async function submitApiAdress() {
    try {
      const data = await axios.post(`${backendDomain}/apiSchema/fetch`, {
        address: apiSchema,
      });

      if (data.statusText != "OK") {
        setInputError(data.data.error);
      }

      const schemaList = convertSchemaToList(data.data);
      setAllRequests(schemaList);
      setShownItems(schemaList);
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
    <>
      <div className="p-5 w-[25rem] h-[31.25rem]">
        <Tabs iconPlacement="trailing">
          <Tabs.Tab
            label="API Schema"
            icon={<Icon type="file-text" variant="fill" />}
          >
            <h2 className="my-3 font-semibold">Enter schema adress:</h2>
            <div className="flex flex-col my-2">
              <Input
                label="Api schema adress"
                error={inputError}
                className="my-2"
                name="test"
                onChange={onApiSchemaInputChange}
                placeholder="API schema adress"
                value={apiSchema}
              />
              <Button
                className="my-2 w-100 h-50"
                variant="outlined"
                onClick={submitApiAdress}
              >
                Submit schema
              </Button>
            </div>
            <h2 className="my-3 font-semibold">Or upload schema as json:</h2>
            <DragDrop onFileUpload={onFileUpload} />
          </Tabs.Tab>
          <Tabs.Tab
            icon={<Icon type="faders" variant="fill" />}
            label="Configuration"
            className="flex flex-row justify-center"
          >
            <div className="my-2">
              <CheckboxGroup
                label="Filter by method"
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
                  {...frontendProps}
                  autocompleteTokens={autocompleteText}
                />
              </div>
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </>
  );
}
