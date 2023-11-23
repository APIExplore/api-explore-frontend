import { useState, useEffect } from "react";
import { Item } from "../RightPanel/types/RightPanelTypes";
import { StatusButton, Typography } from "@tiller-ds/core";
import { Input } from "@tiller-ds/form-elements";
import DragDrop from "../RightPanel/DragDrop";
import axios from "axios";
import { backendDomain } from "../../constants/apiConstants";
import { useRequestsStore } from "../../stores/requestsStore";

export default function NewSchema({
  setIsClosed,
}: {
  setIsClosed: (data: any) => void;
}) {
  const [inputError, setInputError] = useState("");
  const [apiSchema, setApiSchema] = useState(
    "http://localhost:8080/swagger.json"
  );
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const setAllRequests = useRequestsStore((store: any) => store.setAllRequests);
  const setAllShownItems = useRequestsStore(
    (store: any) => store.setAllShownItems
  );

  // set value to apischmea string on change
  function onApiSchemaInputChange(val: any) {
    if (val.target.value.length === 0) {
      setInputError("Address not provided in request data");
    } else {
      setInputError("");
    }
    setApiSchema(val.target.value);
  }

  function onApiSchemaNameChange(val: any) {
    setName(val.target.value);
    if (val.target.value.length === 0) {
      setNameError("No API schema name specified");
    } else {
      setNameError("");
    }
  }

  function fun() {
    setNameError("No API schema name specified");
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
                in: param.in,
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
      if (name.length == 0 || apiSchema.length == 0) {
        if (name.length == 0) {
          setNameError("No API schema name specified");
        } else if (apiSchema.length == 0) {
          setInputError("Address not provided in request data");
        }
        return;
      }

      const data = await axios.post(`${backendDomain}/apiSchema/fetch`, {
        address: apiSchema,
        name: name,
      });

      convertSchemaToList(data.data);

      // Show confirmation message
      setIsFetched(true);
      setTimeout(() => {
        setIsFetched(false);
        setIsClosed(true);
      }, 1000);
    } catch (e: any) {
      setInputError(e.response ? e.response.data.error : e.message);
    }
  }

  useEffect(() => {
    if (isFetched) {
      setInputError("");
      setNameError("");
    }
  }, [isFetched]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col my-2">
        <div className="py-3 mt-6 text-center">
          <Typography variant="h6">Api Schema Name:</Typography>
        </div>
        <Input
          id="schema-name-input"
          error={nameError}
          className="py-2"
          name="test"
          onChange={onApiSchemaNameChange}
          placeholder="API schema name"
          value={name}
        />
      </div>

      <div className="flex flex-col my-2">
        <div className="py-3 mt-6 text-center">
          <Typography variant="h6">Api Schema Address:</Typography>
        </div>
        <Input
          id="schema-adress-input"
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

        {isFetched && (
          <p
            id="schema-fetched"
            className="text-green-600 mt-2 text-base text-center"
          >
            Schema fetched
          </p>
        )}

        <div className="py-3 mt-6 text-center">
          <Typography variant="h6">Or Upload Schema as JSON:</Typography>
        </div>
        <DragDrop
          onFileUpload={convertSchemaToList}
          name={name}
          setNameError={setNameError}
          setIsClosed={setIsClosed}
        />
      </div>
    </div>
  );
}
