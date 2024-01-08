import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { ResizableBox } from "react-resizable";

import { Modal, useModal, useNotificationContext } from "@tiller-ds/alert";
import { Button, Tabs, Tooltip, Typography } from "@tiller-ds/core";
import { CheckboxGroup, Input, Toggle } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { DropdownMenu } from "@tiller-ds/menu";

import CallSequences from "./CallSequences";
import ConfigurationDataTable from "./ConfigurationDataTable";
import { CallSequence } from "./types/RightPanelTypes";
import { backendDomain } from "../../constants/apiConstants";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import useApiCallsStore from "../../stores/apiCallsStore";
import useCallSequenceCacheStore from "../../stores/callSequenceCacheStore";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";
import {
  renderEditSequenceNotification,
  renderSequenceUploaded,
} from "../../util/notificationUtils";

export default function RightPanel() {
  const notification = useNotificationContext();
  const modal = useModal();

  const containerHeight = usePanelDimensionsStore(
    (store) => store.panels.container.height,
  );
  const bottomPanelHeight = usePanelDimensionsStore(
    (store) => store.panels.bottom.height,
  );
  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);

  const allShownItems = useRequestsStore((store: any) => store.allShownItems);
  const setAllShownItems = useRequestsStore(
    (store: any) => store.setAllShownItems,
  );
  const callSequenceName = useRequestsStore(
    (store: any) => store.callSequenceName,
  );
  const setCallSequenceName = useRequestsStore(
    (store: any) => store.setCallSequenceName,
  );
  /* Set currently selected requests */
  const setSelectedRequests = useRequestsStore(
    (store: RequestsStore) => store.setSelectedRequests,
  );
  const allRequests = useRequestsStore(
    (store: RequestsStore) => store.allRequests,
  );
  /* Array of selected requests*/
  const selectedRequests = useRequestsStore(
    (store: RequestsStore) => store.selectedRequests,
  );

  /* Array of all requests */
  const refreshSequenceDetailsCache = useCallSequenceCacheStore(
    (store) => store.refreshSequenceDetailsCache,
  );

  const callByCall = useApiCallsStore((store) => store.callByCallMode);
  const setCallByCall = useApiCallsStore((store) => store.setCallByCallMode);
  const setApiCalls = useApiCallsStore((store) => store.setApiCalls);
  const { fetchedCallSequences, setFetchedCallSequences } =
    useCallSequenceCacheStore();

  const [clickedItem, setClickedItem]: any = useState(null);
  const [inputError, setInputError] = useState("");
  /* Modal operation */
  const [modalOperation, setModalOperation] = useState("");
  const [existingSequenceFlag, setExistingSequenceFlag] =
    useState<boolean>(false);

  // Function to update callSequences in the parent component
  const updateCallSequences = (updatedCallSequences: CallSequence[]): void => {
    setFetchedCallSequences(updatedCallSequences);
  };

  /* Initial ref */
  const isMountingRef = useRef(false);
  /* Methods that can be selected */
  const [selectedMethods, setSelectedMethods]: any = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

  const [activeTab, setActiveTab] = useState<number>(0);

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
        allRequests.filter(
          (item: any) => selectedMethods[item.method] === true,
        ),
      );
    }
  };

  /* On modal close */
  const closeModal = () => {
    setClickedItem(null);
    modal.onClose();
  };

  useEffect(() => {
    if (isMountingRef.current) {
      isMountingRef.current = false;
      return;
    }

    if (clickedItem != null) {
      modal.onOpen(clickedItem);
    }

    filterRequests();
  }, [clickedItem, selectedMethods, selectedRequests]);

  const validateInputLength = (value?: string) => {
    if (
      (value && value?.length === 0) ||
      (!value && callSequenceName.length === 0)
    ) {
      setInputError("You must enter a name for your sequence");
    } else {
      setInputError("");
    }
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
    setCallByCall(callByCall.enabled, 0);
    notification.push(renderSequenceUploaded(file.name));
  };

  const checkExistingSequences = (value?: string) => {
    if (inputError === "") {
      setExistingSequenceFlag(
        fetchedCallSequences.some((sequence) => sequence.name === value),
      );
    }
  };

  async function editSequence(sequenceName: string) {
    setExistingSequenceFlag(true);

    try {
      await axios
        .get(`${backendDomain}/callsequence/fetch/${sequenceName}`)
        .then((response) => {
          setCallSequenceName(sequenceName);
          const newRequests = response.data.map((apiCall) => ({
            path: apiCall.endpoint,
            method: apiCall.method,
            params: apiCall.parameters,
            operationId: apiCall.operationId,
          }));
          setSelectedRequests(newRequests);
          setActiveTab(0);

          notification.push(renderEditSequenceNotification(sequenceName));
        });
    } catch (error: any) {
      console.log("Problem with retrieving sequence by name.");
    }
  }

  const shouldDisableInput =
    callByCall.enabled &&
    callByCall.nextCallIndex !== 0 &&
    selectedRequests.length !== callByCall.nextCallIndex;

  const shouldShowExistingTooltip =
    existingSequenceFlag &&
    (callByCall.enabled
      ? callByCall.nextCallIndex === 0 ||
        selectedRequests.length === callByCall.nextCallIndex
      : true);

  return (
    <ResizableBox
      width={400}
      height={containerHeight - bottomPanelHeight - 8}
      resizeHandles={["w"]}
    >
      <>
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
                      crossOrigin={undefined}
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
          <Tabs
            iconPlacement="trailing"
            fullWidth={true}
            onTabChange={(tabIndex) => {
              setActiveTab(tabIndex);
              setExistingSequenceFlag(
                fetchedCallSequences.some(
                  (sequence) => sequence.name === callSequenceName,
                ),
              );
            }}
            index={activeTab}
          >
            <Tabs.Tab
              icon={<Icon type="faders" variant="fill" />}
              label="Configuration"
              className="config-tab flex flex-row justify-center"
            >
              <div className="p-4">
                <div className="flex justify-between mb-4">
                  <Typography variant="h5">Sequence Config</Typography>
                  <div className="mb-4">
                    <Toggle
                      label={
                        <span className="text-sm leading-5 font-medium text-gray-900">
                          <div className="flex">
                            <Tooltip
                              label={
                                <span>
                                  When starting the simulation execute only one
                                  call from the sequence <br />
                                  <div className="flex">
                                    <div className="w-4 h-4 bg-success-light" />{" "}
                                    - executed call
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
                  tooltip={
                    shouldShowExistingTooltip ? (
                      <Tooltip
                        label={
                          <span>
                            The sequence with this name already exists in the
                            history. <br />
                            Running the simulation will overwrite the calls.
                          </span>
                        }
                      >
                        <span className="flex items-center bg-yellow-200 text-xs px-1.5 py-0.5 ml-0.5 rounded-full hover:text-black">
                          <Icon type="warning" size={2} className="mr-0.5" />
                          Existing
                        </span>
                      </Tooltip>
                    ) : shouldDisableInput ? (
                      <Tooltip
                        label={
                          <span>
                            You cannot change the sequence name when at least
                            one call in the call-by-call mode has been executed.{" "}
                            <br />
                            Stop the simulation to change the call sequence
                            name.
                          </span>
                        }
                      >
                        <span className="flex items-center bg-primary-200 text-xs px-1.5 py-0.5 ml-0.5 rounded-full hover:text-black">
                          <Icon type="info" size={2} className="mr-0.5" />
                          Running
                        </span>
                      </Tooltip>
                    ) : undefined
                  }
                  value={callSequenceName}
                  onChange={(event) => {
                    setExistingSequenceFlag(false);
                    setCallSequenceName(event.target.value);
                    validateInputLength(event.target.value);
                    checkExistingSequences(event.target.value);
                  }}
                  onBlur={() => validateInputLength()}
                  error={inputError}
                  disabled={shouldDisableInput}
                  crossOrigin={undefined}
                />
                <CheckboxGroup
                  label={
                    <Typography className="mt-4 font-semibold">
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
                        <div className="text-body truncate">
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
                    crossOrigin={undefined}
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
              onClick={() => {
                refreshSequenceDetailsCache(callSequenceName);
              }}
            >
              <CallSequences
                fetchingTab={activeTab}
                onEditSequence={editSequence}
                updateCallSequences={updateCallSequences}
              />
            </Tabs.Tab>
          </Tabs>
        </div>
      </>
    </ResizableBox>
  );
}
