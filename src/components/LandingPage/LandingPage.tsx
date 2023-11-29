import { useEffect, useState } from "react";

import axios from "axios";

import { Modal, useModal } from "@tiller-ds/alert";
import { Button, Tabs } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import ExistingSchema from "./existingSchema";
import NewSchema from "./newSchema";
import { backendDomain } from "../../constants/apiConstants";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";
import useSchemaModalStore from "../../stores/schemaModalStore";
import { Definition } from "../RightPanel/types/RightPanelTypes";

export default function LandingPage() {
  const modalOpened = useSchemaModalStore((store) => store.opened);
  const setModalOpened = useSchemaModalStore((store) => store.setOpened);
  const [existingApiSchemasNames, setExistingApiSchemasNames] = useState([]);
  const setAllRequests = useRequestsStore(
    (store: RequestsStore) => store.setAllRequests,
  );
  const setDefinitions = useRequestsStore(
    (store: RequestsStore) => store.setDefinitions,
  );
  const setAllShownItems = useRequestsStore(
    (store: RequestsStore) => store.setAllShownItems,
  );

  const modal = useModal();

  const close = () => {
    setModalOpened(false);
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
  function convertSchemaPathsToList(schema: any) {
    const schemaPaths = schema["paths"];
    const items: any[] = [];
    for (const path in schemaPaths) {
      for (const method in schemaPaths[path]) {
        if (schemaPaths[path][method]) {
          const itemObj: any = {};
          itemObj.path = path;
          itemObj.method = method;
          itemObj.operationId = schemaPaths[path][method].operationId;
          itemObj.definitionRef = schemaPaths[path][method].definitionRef;
          if (schemaPaths[path][method].parameters) {
            itemObj.params = schemaPaths[path][method].parameters.map(
              (param: any) => {
                return {
                  type: param.type,
                  name: param.name,
                  in: param.in,
                  value: "",
                };
              },
            );
          }

          items.push(itemObj);
        }
      }
    }

    setAllRequests(items);
    setAllShownItems(items);
  }

  /* Set all definitions after initial fetch */
  function convertSchemaDefinitionsToList(schema: any) {
    const schemaDefinitions = schema["definitions"];
    const items: Definition[] = [];

    for (const definition in schemaDefinitions) {
      if (schemaDefinitions[definition]) {
        items.push({
          name: definition,
          type: schemaDefinitions[definition].type,
          properties: schemaDefinitions[definition].properties,
        });
      }
    }

    setDefinitions(items);
  }

  return (
    <Modal
      {...modal}
      isOpen={modalOpened}
      state={undefined}
      canDismiss={false}
      onClose={() => setModalOpened(false)}
    >
      <div style={{ height: "700px", overflowY: "auto" }}>
        <Modal.Content title="">
          <Tabs iconPlacement="trailing" fullWidth={true} className="w-full">
            <Tabs.Tab
              label="New schema"
              icon={<Icon type="magnifying-glass" variant="fill" />}
            >
              <NewSchema
                convertSchemaPathsToList={convertSchemaPathsToList}
                convertSchemaDefinitionsToList={convertSchemaDefinitionsToList}
              />
            </Tabs.Tab>
            <Tabs.Tab
              label="Existing schema"
              icon={<Icon type="list" variant="fill" />}
            >
              {existingApiSchemasNames?.length && (
                <ExistingSchema
                  existingApiSchemasNames={existingApiSchemasNames}
                  convertSchemaPathsToList={convertSchemaPathsToList}
                  convertSchemaDefinitionsToList={
                    convertSchemaDefinitionsToList
                  }
                />
              )}
            </Tabs.Tab>
          </Tabs>
        </Modal.Content>
      </div>
      <Modal.Footer>
        <Button
          variant="filled"
          onClick={close}
          trailingIcon={<Icon type="sign-in" />}
        >
          Enter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
