import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { ResizableBox } from "react-resizable";

import {
  StatusButton,
  Tabs,
  Typography,
  IconButton,
  Button,
} from "@tiller-ds/core";
import { CheckboxGroup, Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { DropdownMenu } from "@tiller-ds/menu";
import { Modal, useModal } from "@tiller-ds/alert";
import { DataTable } from "@tiller-ds/data-display";

import DragDrop from "./DragDrop";
import { Item, Request } from "./types/RightPanelTypes";
import { backendDomain } from "../../constants/apiConstants";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import { useRequestsStore } from "../../stores/requestsStore";

export default function RightPanel() {
  const modal = useModal();
  const containerHeight = usePanelDimensionsStore(
    (store) => store.panels.container.height
  );
  const bottomPanelHeight = usePanelDimensionsStore(
    (store) => store.panels.bottom.height
  );

  const [clickedItem, setClickedItem]: any = useState(null);

  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);

  /* Set currently selected requests */
  const setSelectedRequests = useRequestsStore(
    (store: any) => store.setSelectedRequests
  );
  /* Modal operation */
  const [modalOperation, setModalOperation] = useState("");
  /* Set all possible requests on initial fetch */
  const setAllRequests = useRequestsStore((store: any) => store.setAllRequests);
  /* Array of all requests */
  const allRequests = useRequestsStore((store: any) => store.allRequests);
  /* Array of selected requests*/
  const selectedRequests = useRequestsStore(
    (store: any) => store.selectedRequests
  );
  /* Is fetching done */
  const [isFetched, setIsFetched] = useState(false);
  /* Initial ref */
  const isMountingRef = useRef(false);
  /* Error or input of schema adress */
  const [inputError, setInputError] = useState("");
  /* Schema adress*/
  const [apiSchema, setApiSchema] = useState(
    "http://localhost:8080/swagger.json"
  );
  /* Methods that can be selected */
  const [selectedMethods, setSelectedMethods]: any = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });
  /* Items to show in drop down */
  const [shownItems, setShownItems] = useState<Item[] | Request[]>(allRequests);

  const ref = useResizeObserver("right", setDimensions);

  useEffect(() => {
    if (isFetched) {
      setInputError("");
    }
  }, [isFetched]);

  /* Set all requests and shown items after initial fetch */
  function convertSchemaToList(schema: any) {
    const items: any[] = [];

    for (const path in schema) {
      for (const method in schema[path]) {
        if (schema[path][method]) {
          items.push({
            path: path,
            method: method,
            operationId: schema[path][method].operationId,
            params: schema[path][method].parameters.map((param) => {
              return {
                type: param.type,
                name: param.name,
                value: "",
              };
            }),
          });
        }
      }
    }

    setAllRequests(items);
    setShownItems(items);
  }

  /* Function when checkbox is selected */
  function onCheckboxChange(val: any) {
    setSelectedMethods({ ...val });
  }

  /* set value to apischmea string on change */
  function onApiSchemaInputChange(val: any) {
    setApiSchema(val.target.value);
  }

  /* Check what param of item was changed and update it */
  function onParamChange(val: any, paramName: string) {
    const tempItem = { ...clickedItem };
    tempItem.params.forEach((param) => {
      if (param.name === paramName) {
        param.value = val.target.value;
      }
    });

    setClickedItem(tempItem);
  }

  /* Select item from drop down or edit one */
  const selectItem = () => {
    if (modalOperation === "add") {
      /* Add new item at end of the array */
      setSelectedRequests([...selectedRequests, clickedItem]);
    } else if (modalOperation === "edit") {
      /* Edit item at its index */
      const { index, ...realItem } = clickedItem;
      selectedRequests.splice(index, 1, realItem);
      setSelectedRequests([...selectedRequests]);
    }
    setClickedItem(null);
    setModalOperation("");
    modal.onClose();
  };

  /* Remove item by its array index */
  const removeItem = (index) => {
    const tempItems = selectedRequests?.length ? [...selectedRequests] : [];
    if (tempItems?.length > index) {
      tempItems.splice(index, 1);
    }

    setSelectedRequests(tempItems);
  };

  /* Submit api adress to backend */
  async function submitApiAdress() {
    try {
      const data = await axios.post(`${backendDomain}/apiSchema/fetch`, {
        address: apiSchema,
      });

      if (data.status != 201) {
        setInputError(data.data.error);
      }

      convertSchemaToList(data.data);

      /* Show confirmation message */
      setIsFetched(true);
      setTimeout(() => {
        setIsFetched(false);
      }, 3000);
    } catch (e: any) {
      setInputError(e.response ? e.response.data.error : e.message);
    }
  }

  /* Filter requests depending on checkboxes */
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

  /* On modal close */
  const closeModal = () => {
    setClickedItem(null);
    modal.onClose();
  };

  /* Simulate initial load */
  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  /* Watch when item is selected */
  useEffect(() => {
    if (!isMountingRef.current) {
      if (clickedItem != null) {
        modal.onOpen(clickedItem);
      }
    } else {
      isMountingRef.current = false;
    }
  }, [clickedItem]);

  /* On change for methods checkboxes change filter items */
  useEffect(() => {
    if (!isMountingRef.current) {
      filterRequests();
    } else {
      isMountingRef.current = false;
    }
  }, [selectedMethods]);

  /* Filter requests on each selection so it filters out unwanted methods */
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
      <Modal
        {...modal}
        icon={
          <Modal.Icon
            icon={<Icon type="lock-open" variant="bold" />}
            tokens={{
              Icon: {
                backgroundColor: "bg-primary",
              },
            }}
            className="text-white"
          />
        }
      >
        {(state: any) => (
          <>
            <Modal.Content title={"Endpoint name: " + state.operationId}>
              {"Edit params"}
              {state.params.length === 0 && <p>No params for this endpoint</p>}
              {state.params.map((item, index) => (
                <Input
                  id="params-input"
                  label={<p className="font-semibold">{item.name}</p>}
                  className="py-2"
                  name="params"
                  onChange={(e) => onParamChange(e, item.name)}
                  value={item.value}
                />
              ))}
            </Modal.Content>

            <Modal.Footer>
              <Button
                variant="filled"
                color="success"
                onClick={() => {
                  selectItem();
                }}
              >
                {"Submit endpoint"}
              </Button>
              <Button variant="text" color="white" onClick={() => closeModal()}>
                {"cancel"}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
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
                <Typography variant="h6">Enter Schema Address:</Typography>
              </div>

              <div className="flex flex-col my-2">
                <Input
                  id="schema-adress-input"
                  label="Api schema address"
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
                <Typography variant="h6">Or Upload Schema as JSON:</Typography>
              </div>
              <DragDrop onFileUpload={convertSchemaToList} />
            </div>
          </Tabs.Tab>
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
                <DropdownMenu title="Endpoints">
                  {shownItems.map((item, index) => (
                    <DropdownMenu.Item
                      key={index}
                      onSelect={() => {
                        setModalOperation("add");
                        setClickedItem(JSON.parse(JSON.stringify(item)));
                      }}
                    >
                      <div className="text-body">
                        {item.method.toUpperCase()} {item.operationId}
                      </div>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu>
              </div>
              <DataTable data={selectedRequests} className="w-[300px]">
                <DataTable.Column
                  header="Method"
                  id="method"
                  className="max-w-md"
                >
                  {(item: Item) => <>{item.method}</>}
                </DataTable.Column>
                <DataTable.Column
                  header="Operation Id"
                  id="operationId"
                  className="max-w-md"
                >
                  {(item: Item) => <>{item.operationId}</>}
                </DataTable.Column>
                <DataTable.Column
                  header="Actions"
                  id="actions"
                  className="max-w-md"
                  canSort={false}
                >
                  {(item: Item, index) => (
                    <div className="flex justify-center items-center space-x-1">
                      <IconButton
                        icon={
                          <Icon
                            type="pencil-simple"
                            variant="fill"
                            className="text-gray-500"
                          />
                        }
                        onClick={() => {
                          setModalOperation("edit");
                          setClickedItem(
                            JSON.parse(JSON.stringify({ ...item, index }))
                          );
                        }}
                        label="Edit"
                      />
                      <IconButton
                        icon={
                          <Icon
                            type="trash"
                            variant="fill"
                            className="text-gray-500"
                          />
                        }
                        onClick={() => removeItem(index)}
                        label="Delete"
                      />
                    </div>
                  )}
                </DataTable.Column>
              </DataTable>
            </div>
          </Tabs.Tab>
          <Tabs.Tab
            label="History"
            className="history-tab"
            icon={<Icon type="folder" variant="fill" />}
          >
            <h1>History</h1>
          </Tabs.Tab>
        </Tabs>
      </div>
    </ResizableBox>
  );
}
