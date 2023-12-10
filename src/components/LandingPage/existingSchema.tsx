import { useEffect, useState } from "react";

import axios from "axios";
import ReactJson from "react-json-view";

import { Typography } from "@tiller-ds/core";
import { Icon, LoadingIcon } from "@tiller-ds/icons";
import { DropdownMenu } from "@tiller-ds/menu";

import { backendDomain } from "../../constants/apiConstants";
import useLogsStore from "../../stores/logsStore";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";

export default function ExistingSchema({
  existingApiSchemasNames,
  convertSchemaPathsToList,
  convertSchemaDefinitionsToList,
}: {
  existingApiSchemasNames: Array<any>;
  convertSchemaPathsToList: (data: any) => void;
  convertSchemaDefinitionsToList: (data: any) => void;
}) {
  const logs = useLogsStore();
  const allRequests = useRequestsStore(
    (store: RequestsStore) => store.allRequests,
  );
  const definitions = useRequestsStore(
    (store: RequestsStore) => store.definitions,
  );
  const [selectedApiSchema, setSelectedApiSchema] = useState(null);
  const [title, setTitle] = useState("Choose a schema");
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isFetching) {
      setError("");
    }
  }, [isFetching]);

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

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="flex flex-col my-2 w-full">
        <div className="py-3 mt-6 text-center">
          <Typography variant="h6">Select API Schema Name:</Typography>
        </div>
        <div className="flex flex-col">
          <div className="pb-3 mt-6 text-center">
            <DropdownMenu title={title} id="dropdown-existing-schemas">
              {existingApiSchemasNames.map((item, index) => (
                <DropdownMenu.Item
                  key={index}
                  onSelect={() => {
                    selectApiSchema(item);
                  }}
                >
                  <div id={"schema-" + index} className="text-body">
                    {item.name}
                  </div>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu>
            <p
              id="schema-fetched"
              className={`text-${
                isFetched ? "green" : error?.length > 0 ? "red" : undefined
              }-600 mt-2 text-base text-center h-2`}
            >
              {isFetched && "Schema " + selectedApiSchema + " fetched"}
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
