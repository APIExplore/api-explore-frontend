import { Tabs, Button } from "@tiller-ds/core";
import { CheckboxGroup, Input } from "@tiller-ds/form-elements";
import { Autocomplete } from "@tiller-ds/selectors";
// import { useFileUpload } from "./hooks/useFileUpload";
// import { DragZoneField } from "@tiller-ds/formik-elements";
import { useRequestsStore } from "../../stores/requestsStore";
import { useEffect, useState, useRef } from "react";

export default function RightPanel() {
  const setRequests = useRequestsStore((store: any) => store.setRequests);
  const [apiSchema, setApiSchema] = useState("");
  const [selectedMethods, setSelectedMethods]: any = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });
  /* DUMMY this will be all selected offers from schema*/
  const items = [
    {
      path: "/products/{productName}",
      method: "get",
      parameters: [
        {
          name: "productName",
          in: "path",
          required: true,
          type: "string",
        },
      ],
    },
    {
      path: "/products/{nesto}",
      method: "post",
      parameters: [
        {
          name: "nesto",
          in: "path",
          required: true,
          type: "string",
        },
      ],
    },
  ];
  const [shownItems, setShownItems] = useState(items);

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
  const submitApiAdress = () => {
    console.log(apiSchema);
  };

  // Filter requests depending on checkboxes
  const filterRequests = () => {
    if (
      !selectedMethods.get &&
      !selectedMethods.post &&
      !selectedMethods.put &&
      !selectedMethods.delete
    ) {
      setShownItems(items);
    } else {
      setShownItems(
        items.filter((item: any) => selectedMethods[item.method] === true)
      );
    }
  };

  // On Methods checkboxes change filter items
  useEffect(() => {
    filterRequests();
  }, [selectedMethods]);

  // Props for autocomplete component
  const frontendProps = {
    name: "Endpoints",
    onChange: onEndpointsChange,
    onBlur: () => {},
    itemToString: (item: any) => `${item.path} - ${item.method.toUpperCase()}`,
    sort: (items: any[]) => items.sort((a, b) => a.path.localeCompare(b.path)),
    options: shownItems,
    allowMultiple: true,
    getOptionValue: (item: any) => item.path,
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
