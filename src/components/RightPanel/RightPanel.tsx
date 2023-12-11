import React, { useEffect, useRef, useState } from "react";

import { ResizableBox } from "react-resizable";

import { Modal, useModal } from "@tiller-ds/alert";
import { Button, Tabs, Tooltip, Typography } from "@tiller-ds/core";
import { CheckboxGroup, Input, Toggle } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { DropdownMenu } from "@tiller-ds/menu";

import CallSequences from "./CallSequences";
import ConfigurationDataTable from "./ConfigurationDataTable";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import useApiCallsStore from "../../stores/apiCallsStore";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";

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

  const allShownItems = useRequestsStore((store: any) => store.allShownItems);
  const setAllShownItems = useRequestsStore(
    (store: any) => store.setAllShownItems
  );

  const callSequenceName = useRequestsStore(
    (store: any) => store.callSequenceName
  );
  const setCallSequenceName = useRequestsStore(
    (store: any) => store.setCallSequenceName
  );
  const [inputError, setInputError] = useState("");

  /* Set currently selected requests */
  const setSelectedRequests = useRequestsStore(
    (store: RequestsStore) => store.setSelectedRequests
  );
  /* Modal operation */
  const [modalOperation, setModalOperation] = useState("");
  /* Array of all requests */
  const allRequests = useRequestsStore(
    (store: RequestsStore) => store.allRequests
  );
  /* Array of selected requests*/
  const selectedRequests = useRequestsStore(
    (store: RequestsStore) => store.selectedRequests
  );

  const callByCall = useApiCallsStore((store) => store.callByCallMode);
  const setCallByCall = useApiCallsStore((store) => store.setCallByCallMode);
  const setApiCalls = useApiCallsStore((store) => store.setApiCalls);

  /* Initial ref */
  const isMountingRef = useRef(false);
  /* Methods that can be selected */
  const [selectedMethods, setSelectedMethods]: any = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

  const [fetchingTab, setFetchingTab] = useState<number>(0);

  const ref = useResizeObserver("right", setDimensions);

  /* Function when checkbox is selected */
  function onCheckboxChange(val: any) {
    setSelectedMethods({ ...val });
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

  /* Filter requests depending on checkboxes */
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

  const validateInputLength = (value?: string) => {
    if (
      (value && value?.length === 0) ||
      (!value && callSequenceName.length === 0)
    )
      setInputError("You must enter a name for your sequence");
    else setInputError("");
  };

  const extractDataFromCallSequence = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileContent = e.target?.result ? e.target.result : {};
          const fileContentInJsonFormat = JSON.parse(fileContent as string);
          setSelectedRequests(fileContentInJsonFormat);
        } catch (error) {
          console.error("Error while parsing JSON file", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <ResizableBox
      width={400}
      height={containerHeight - bottomPanelHeight - 8}
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
        {(state: any) => {
          return (
            <>
              <Modal.Content title={"Endpoint name: " + state.operationId}>
                {"Edit params"}
                {state.params?.length === 0 && (
                  <p>No params for this endpoint</p>
                )}
                {state.params?.map((item, index) => (
                  <Input
                    key={index}
                    id={"params-input-" + String(index)}
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
                  id="submit-endpoint"
                  variant="filled"
                  color="success"
                  onClick={() => {
                    selectItem();
                  }}
                >
                  Submit Endpoint
                </Button>
                <Button
                  id="cancel-params"
                  variant="text"
                  color="white"
                  onClick={() => closeModal()}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </>
          );
        }}
      </Modal>
      <div
        className="flex h-full m-1 p-2 bg-white drop-shadow-md"
        ref={ref}
        id="right-panel"
      >
        <Tabs iconPlacement="trailing" fullWidth={true}>
          <Tabs.Tab
            icon={<Icon type="faders" variant="fill" />}
            label="Configuration"
            className="config-tab flex flex-row justify-center"
          >
            <div className="p-4">
              <div className="flex justify-between">
                <Typography variant="h5">Sequence Config</Typography>
                <div className="mb-4">
                  <Toggle
                    className="toggle-call-by-call"
                    label={
                      <span className="text-sm leading-5 font-medium text-gray-900">
                        <div className="flex">
                          <Tooltip
                            label={
                              <span>
                                When starting the simulation execute only one
                                call from the sequence <br />
                                <div className="flex">
                                  <div className="w-4 h-4 bg-success-light" /> -
                                  executed call
                                </div>
                                <div className="flex">
                                  <div className="w-4 h-4 bg-info-light" /> -
                                  next call to be executed
                                </div>
                              </span>
                            }
                          >
                            <div className="flex items-center justify-center pr-1">
                              <Icon
                                type="info"
                                size={4}
                                className="text-slate-500"
                              />
                            </div>
                          </Tooltip>
                          Call-by-call
                        </div>
                      </span>
                    }
                    reverse={true}
                    checked={callByCall.enabled}
                    onClick={() => {
                      setCallByCall(!callByCall.enabled, 0);
                      setApiCalls([]);
                    }}
                  />
                </div>
              </div>
              <Input
                name="sequenceName"
                id="sequence-name-input"
                label="Call Sequence Name"
                placeholder="Call sequence to be stored in the Sequences tab"
                value={callSequenceName}
                onChange={(event) => {
                  setCallSequenceName(event.target.value);
                  validateInputLength(event.target.value);
                }}
                onBlur={() => validateInputLength()}
                error={inputError}
              />
              <CheckboxGroup
                label={
                  <Typography className="my-4 font-semibold">
                    Filter by method:
                  </Typography>
                }
                name="methods"
                className="-mt-0.5"
                onChange={onCheckboxChange}
                value={selectedMethods}
                vertical
              >
                <div className="inline-grid grid-cols-2 gap-2">
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="GET"
                    tokens={{
                      GroupItem: {
                        content: "static h-5 flex items-center",
                      },
                    }}
                    value="get"
                  />
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="POST"
                    value="post"
                    tokens={{
                      GroupItem: {
                        content: "static h-5 flex items-center",
                      },
                    }}
                  />
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="PUT"
                    value="put"
                    tokens={{
                      GroupItem: {
                        content: "static h-5 flex items-center",
                      },
                    }}
                  />
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="DELETE"
                    value="delete"
                    tokens={{
                      GroupItem: {
                        content: "static h-5 flex items-center",
                      },
                    }}
                  />
                </div>
              </CheckboxGroup>
              <div className="my-5 flex items-center">
                <DropdownMenu
                  title="Endpoints"
                  id="endpoints"
                  visibleItemCount={5}
                >
                  {allShownItems.map((item, index) => (
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
                <Input
                  type="file"
                  accept=".json"
                  onChange={extractDataFromCallSequence}
                  placeholder="Test placeholder"
                  name={"choose-seq"}
                  className="ml-2"
                />
              </div>
              <ConfigurationDataTable
                selectedRequests={selectedRequests}
                setSelectedRequests={setSelectedRequests}
                setModalOperation={setModalOperation}
                setClickedItem={setClickedItem}
                removeItem={removeItem}
              />
            </div>
          </Tabs.Tab>
          <Tabs.Tab
            label="Sequences"
            className="sequences-tab"
            icon={<Icon type="clock-counter-clockwise" variant="fill" />}
            onClick={setFetchingTab}
          >
            <CallSequences fetchingTab={fetchingTab} />
          </Tabs.Tab>
        </Tabs>
      </div>
    </ResizableBox>
  );
}
