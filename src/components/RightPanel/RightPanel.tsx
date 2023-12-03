import { useEffect, useRef, useState } from "react";
import { ResizableBox } from "react-resizable";
import { Modal, useModal } from "@tiller-ds/alert";
import { Button, Tabs, Typography } from "@tiller-ds/core";
import { CheckboxGroup, Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { DropdownMenu } from "@tiller-ds/menu";
import CallSequences from "./CallSequences";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";
import ConfigurationDataTable from "./ConfigurationDataTable";
import DragDrop from "./DragDrop";

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
  const [nameError, setNameError] = useState("default name error");

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
  /* Initial ref */
  const isMountingRef = useRef(false);
  /* Methods that can be selected */
  const [selectedMethods, setSelectedMethods]: any = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

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
    console.log("exstract data from > ", event.target);
    const file = event.target.files[0];
    // convertSchemaPathsToList(callSequence);
    // convertSchemaDefinitionsToList(callSequence);

    if (file) {
      // Kreiranje FileReader objekta za čitanje sadržaja datoteke
      const reader = new FileReader();
      console.log("lalalal >", reader.readAsText(file));

      // Postavljanje funkcije koja će se pozvati nakon čitanja datoteke
      reader.onload = (e) => {
        try {
          // Parsiranje JSON-a iz pročitanog sadržaja
          // const jsonData = JSON.parse(event.target.result);
          // console.log("jsonData > ", jsonData);
          // Pozivanje funkcije koja je prenesena kao prop, a koja će obraditi uvezeni JSON
          // onImport(jsonData);
        } catch (error) {
          console.error("Greška prilikom parsiranja JSON-a", error);
        }
      };

      // Čitanje sadržaja datoteke kao tekst
      reader.readAsText(file);
    }
  };

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
              {state.params?.length === 0 && <p>No params for this endpoint</p>}
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
        )}
      </Modal>
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
            <div className="py-8 text-center">
              <Typography variant="h5">Call Sequence Configuration</Typography>
            </div>
            <Input
              name="sequenceName"
              id="sequence-name-input"
              label="Call Sequence Name"
              placeholder="Call sequence to be stored in the history tab"
              value={callSequenceName}
              onChange={(event) => {
                setCallSequenceName(event.target.value);
                validateInputLength(event.target.value);
              }}
              onBlur={() => validateInputLength()}
              error={inputError}
              className="px-0.5"
            />
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
                    tokens={{
                      GroupItem: { content: "static h-5 flex items-center" },
                    }}
                    value="get"
                  />
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="POST"
                    value="post"
                    tokens={{
                      GroupItem: { content: "static h-5 flex items-center" },
                    }}
                  />
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="PUT"
                    value="put"
                    tokens={{
                      GroupItem: { content: "static h-5 flex items-center" },
                    }}
                  />
                  <CheckboxGroup.Item
                    className="col-span-1"
                    label="DELETE"
                    value="delete"
                    tokens={{
                      GroupItem: { content: "static h-5 flex items-center" },
                    }}
                  />
                </div>
              </CheckboxGroup>
              <div className="my-5">
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
                <input
                  type="file"
                  accept=".json"
                  onChange={extractDataFromCallSequence}
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
          >
            <CallSequences />
          </Tabs.Tab>
        </Tabs>
      </div>
    </ResizableBox>
  );
}
