import React, { useEffect, useState } from "react";

import axios from "axios";
import ReactJson from "react-json-view";

import { useNotificationContext } from "@tiller-ds/alert";
import { IconButton, Typography } from "@tiller-ds/core";
import { Icon, LoadingIcon } from "@tiller-ds/icons";
import { DropdownMenu } from "@tiller-ds/menu";

import { backendDomain } from "../../constants/apiConstants";
import useApiCallsStore from "../../stores/apiCallsStore";
import useLogsStore from "../../stores/logsStore";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";
import { renderRemoveSequenceNotification } from "../../util/notificationUtils";

export default function ExistingSchema({
  existingApiSchemasNames,
  convertSchemaPathsToList,
  convertSchemaDefinitionsToList,
  onSchemaRemoval,
}: {
  existingApiSchemasNames: Array<any>;
  convertSchemaPathsToList: (data: any) => void;
  convertSchemaDefinitionsToList: (data: any) => void;
  onSchemaRemoval: () => Promise<void>;
}) {
  const setSchemaName = useApiCallsStore((store) => store.setSchemaName);
  const logs = useLogsStore();
  const allRequests = useRequestsStore(
    (store: RequestsStore) => store.allRequests,
  );
  const definitions = useRequestsStore(
    (store: RequestsStore) => store.definitions,
  );
  const [selectedApiSchema, setSelectedApiSchema] = useState(null);
  const [removedApiSchema, setRemovedApiSchema] = useState("");
  const [title, setTitle] = useState("Choose a schema");
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [error, setError] = useState("");
  const notification = useNotificationContext();

  useEffect(() => {
    if (isFetching) {
      setError("");
    }
  }, [isFetching]);

  const updateAvailableSchemas = async () => {
    await onSchemaRemoval();
  };

  async function selectApiSchema(item) {
    setSelectedApiSchema(item.name);
    setTitle(item.name);
    setIsFetching(true);
    setIsFetched(false); // Reset isFetched when a new schema is selected
    setError("");

    try {
      const response = await axios.get(
        `${backendDomain}/apiSchema/fetch/` + item.name,
      );

      setSchemaName(item.name);
      convertSchemaPathsToList(response.data);
      convertSchemaDefinitionsToList(response.data);

      setIsFetching(false);
      setIsFetched(true);

      setTimeout(() => {
        setIsFetched(false);
      }, 3000); // Display the "Schema fetched" message for 3 seconds

      if (response.data.warnings) {
        logs.addWarnings(response.data.warnings);
      }
    } catch (error: any) {
      setError(error.response ? error.response.data.error : error.message);
      setIsFetching(false);
      setIsFetched(false);

      if (error.response.data) {
        logs.addError(error.response.data);
      }
    }
  }

  const removeSchema = async (item: any) => {
    try {
      setRemovedApiSchema(item.name);
      setIsFetching(true);
      setIsFetched(false);
      const response = await axios.delete(
        `${backendDomain}/apischema/delete/${item.name}`,
      );
      if (response.data.success) {
        console.log("Schema removed successfully");
        // existingApiSchemasNames = existingApiSchemasNames.filter(
        //   (item) => item.name !== item.name,
        // );
        notification.push(renderRemoveSequenceNotification(item.name));
        setIsRemoved(true);
        await updateAvailableSchemas();
      } else {
        console.error(response.data.error);
      }
    } catch (error: any) {
      console.error("Network error:", error.message);
    } finally {
      setIsFetching(false);
      setIsFetched(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="flex flex-col my-2 w-full">
        <div className="py-3 mt-6 text-center">
          <Typography variant="h6">Select API Schema Name:</Typography>
        </div>
        <div className="flex flex-col">
          <div className="pb-3 mt-6 text-center">
            <DropdownMenu
              title={title}
              id="dropdown-existing-schemas"
              onClick={() => setIsRemoved(false)}
            >
              {existingApiSchemasNames.map((item, index) => (
                <div className="flex flex-row items-center justify-between">
                  <DropdownMenu.Item
                    key={index}
                    onSelect={() => {
                      selectApiSchema(item);
                    }}
                    className="w-full"
                  >
                    <div id={"schema-" + index} className="text-body w-full">
                      {item.name}
                    </div>
                  </DropdownMenu.Item>
                  <div className="pt-[7px]">
                    <IconButton
                      onClick={async () => {
                        setIsFetched(false);
                        await removeSchema(item);
                      }}
                      icon={<Icon type="trash" />}
                      label="Delete"
                      className={"text-red-600 hover:opacity-100 opacity-60"}
                    />
                  </div>
                </div>
              ))}
            </DropdownMenu>
            <p
              id="schema-fetched"
              className={`text-${
                isFetched
                  ? "green"
                  : error?.length > 0 || isRemoved
                  ? "red"
                  : undefined
              }-600 mt-2 text-base text-center h-2`}
            >
              {isFetched && "Schema " + selectedApiSchema + " fetched"}
              {isRemoved && "Schema " + removedApiSchema + " removed"}
              {error?.length > 0 && error}
            </p>
          </div>
        </div>
      </div>
      {selectedApiSchema && !isFetching && (
        <div className="bg-slate-400/10 w-full h-full p-2 rounded-md">
          <p id="schema-fetched" className="mt-2 text-base">
            <Typography
              variant="subtitle"
              className="my-3"
              icon={<Icon type="path" />}
            >
              Schema paths
            </Typography>
            <ReactJson src={allRequests} name="Paths" collapsed={true} />
            {definitions.length > 0 && (
              <>
                <Typography
                  variant="subtitle"
                  className="my-3"
                  icon={<Icon type="key" />}
                >
                  Schema definitions
                </Typography>
                <ReactJson
                  src={definitions}
                  name="Definitions"
                  collapsed={true}
                />
              </>
            )}
          </p>
        </div>
      )}
      {isFetching && <LoadingIcon size={6} />}
    </div>
  );
}
