import { useState, useEffect } from "react";
import { Item } from "../RightPanel/types/RightPanelTypes";
import { StatusButton, Typography } from "@tiller-ds/core";
import { Input } from "@tiller-ds/form-elements";
import DragDrop from "../RightPanel/DragDrop";
import axios from "axios";
import { backendDomain } from "../../constants/apiConstants";
import { useRequestsStore } from "../../stores/requestsStore";

export default function NewSchema() {
  const [inputError, setInputError] = useState("");
  const [apiSchema, setApiSchema] = useState(
    "http://localhost:8080/swagger.json"
  );
  const [isFetched, setIsFetched] = useState(false);
  const setAllRequests = useRequestsStore((store: any) => store.setAllRequests);
  const setAllShownItems = useRequestsStore(
    (store: any) => store.setAllShownItems
  );

  // set value to apischmea string on change
  function onApiSchemaInputChange(val: any) {
    setApiSchema(val.target.value);
  }

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
    setAllShownItems(items);
  }

  // Submit api adress to backend
  async function submitApiAdress() {
    try {
      const data = await axios.post(`${backendDomain}/apiSchema/fetch`, {
        address: apiSchema,
      });

      if (data.status != 201) {
        setInputError(data.data.error);
      }

      convertSchemaToList(data.data);

      // Show confirmation message
      setIsFetched(true);
      setTimeout(() => {
        setIsFetched(false);
      }, 3000);
    } catch (e: any) {
      setInputError(e.response ? e.response.data.error : e.message);
    }
  }

  useEffect(() => {
    if (isFetched) {
      setInputError("");
    }
  }, [isFetched]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="py-3 mt-6 text-center">
        <Typography variant="h6">Enter Schema Name:</Typography>
      </div>
       <div className="flex flex-col my-2">
        <Input
          id="schema-adress-input"
          label="Api schema name"
          error={inputError}
          className="py-2"
          name="test"
          onChange={onApiSchemaInputChange}
          placeholder="API schema name"
          value={apiSchema}
        />
        </div>
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
  );
}
