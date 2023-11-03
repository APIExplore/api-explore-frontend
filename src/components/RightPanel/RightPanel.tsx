import { Tabs, Button } from "@tiller-ds/core";
import { CheckboxGroup, Input } from "@tiller-ds/form-elements";
import { Autocomplete } from "@tiller-ds/selectors";
// import { useFileUpload } from "./hooks/useFileUpload";
// import { DragZoneField } from "@tiller-ds/formik-elements";
import { useRequestsStore } from "../../stores/requestsStore";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function RightPanel() {
  const backendDomain = "http://localhost:3000";
  const setRequests = useRequestsStore((store: any) => store.setRequests);
  const setAllRequests = useRequestsStore((store: any) => store.setAllRequests);
  const allRequests = useRequestsStore((store: any) => store.allRequests);
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

  function convertSchemaToList(schema: any) {
    let items = [];

    for (const path in schema.paths) {
      for (const method in schema.paths[path]) {
        if (schema.paths[path][method]) {
          items.push({
            path: path,
            method: method,
            parameters: schema.paths[path][method].parameters,
          });
        }
      }
    }

    return items;
  }

  // Function when checkbox is selected
  const onCheckboxChange = (val: any) => {
    setSelectedMethods({ ...val });
  };

  // Function when new endpoint is selected
  const onEndpointsChange = (val: any) => {
    setRequests(val);
  };

  // set value to apischmea string on change
  const onApiSchemaInputChange = (val: any) => {
    setApiSchema(val.target.value);
  };

  // Submit api adress to backend
  const submitApiAdress = async () => {
    // http://localhost:8080/swagger.json
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
      setInputError(e.response.data.error);
    }
  };

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

  // Create hook from this
  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  // On Methods checkboxes change filter items
  useEffect(() => {
    if (!isMountingRef.current) {
      filterRequests();
    } else {
      isMountingRef.current = false;
    }
  }, [selectedMethods]);

  // Props for autocomplete component
  const frontendProps = {
    name: "Endpoints",
    onChange: onEndpointsChange,
    onBlur: () => {},
    itemToString: (item: any) => `${item.path} ${item.method.toUpperCase()}`,
    sort: (items: any[]) => items.sort((a, b) => a.path.localeCompare(b.path)),
    options: shownItems,
    allowMultiple: true,
    getOptionValue: (item: any) => item.path + "|" + item.method,
    filter: (path: string, option: any) => option.path.toLowerCase(),
  };

  return (
    <>
      <div className="p-5">
        <Tabs className="">
          <Tabs.Tab label="API Schema">
            {/* <DragZoneField
              name="API schema"
              hook={useFileUpload}
              url=""
              title={<Intl name="dragZoneTitle" />}
            /> */}
            <div className="flex flex-col my-2">
              <Input
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
                Button
              </Button>
            </div>
          </Tabs.Tab>
          <Tabs.Tab
            label="Configuration"
            className="flex flex-row justify-center"
          >
            <div className="my-2">
              <CheckboxGroup
                label="Methods"
                name="methods"
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
                <Autocomplete label="Endpoints" {...frontendProps} />
              </div>
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </>
  );
}
