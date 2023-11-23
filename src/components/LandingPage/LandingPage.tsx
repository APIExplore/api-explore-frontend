import { Modal, useModal } from "@tiller-ds/alert";
import { Button, Tabs } from "@tiller-ds/core";
import { useEffect, useState } from "react";
import NewSchema from "./newSchema";
import { Icon } from "@tiller-ds/icons";
import ExistingSchema from "./existingSchema";
import axios from "axios";
import { backendDomain } from "../../constants/apiConstants";
import { useRequestsStore } from "../../stores/requestsStore";

export default function LandingPage() {
  const [isClosed, setIsClosed] = useState(false);
  const [existingApiSchemasNames, setExistingApiSchemasNames] = useState([]);
  const setAllRequests = useRequestsStore((store: any) => store.setAllRequests);
  const setAllShownItems = useRequestsStore(
    (store: any) => store.setAllShownItems
  );

  const modal = useModal();

  const close = () => {
    setIsClosed(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendDomain}/apiSchema/fetch`); // Fetch all existing schemas
        setExistingApiSchemasNames(response.data);
      } catch (error) {
        console.error("Error fetching API schemas from the backend:", error);
      }
    };

    fetchData();
  }, []);

  /* Set all requests and shown items after initial fetch */
  function convertSchemaToList(schema: any) {
    const items: any[] = [];

    for (const path in schema) {
      for (const method in schema[path]) {
        if (schema[path][method]) {
          const itemObj: any = {};
          itemObj.path = path;
          itemObj.method = method;
          itemObj.operationId = schema[path][method].operationId;
          if (schema[path][method].parameters) {
            itemObj.params = schema[path][method].parameters.map(
              (param: any) => {
                return {
                  type: param.type,
                  name: param.name,
                  in: param.in,
                  value: "",
                };
              }
            );
          }

          items.push(itemObj);
        }
      }
    }

    setAllRequests(items);
    setAllShownItems(items);
  }

  return (
    <Modal {...modal} isOpen={!isClosed} state={undefined} canDismiss={false}>
      <div style={{ height: "700px", overflowY: "auto" }}>
        <Modal.Content title="">
          <Tabs iconPlacement="trailing" fullWidth={true} className="w-full">
            <Tabs.Tab
              label="New schema"
              icon={<Icon type="magnifying-glass" variant="fill" />}
            >
              <NewSchema
                setIsClosed={setIsClosed}
                convertSchemaToList={convertSchemaToList}
              />
            </Tabs.Tab>
            <Tabs.Tab
              label="Existing schema"
              icon={<Icon type="list" variant="fill" />}
            >
              {existingApiSchemasNames?.length && (
                <ExistingSchema
                  existingApiSchemasNames={existingApiSchemasNames}
                  setIsClosed={setIsClosed}
                  convertSchemaToList={convertSchemaToList}
                />
              )}
            </Tabs.Tab>
          </Tabs>
        </Modal.Content>
      </div>
      <Modal.Footer>
        <Button variant="filled" onClick={close}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
