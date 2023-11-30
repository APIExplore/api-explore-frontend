import { useEffect, useState } from "react";

import axios from "axios";

import { StatusButton, Typography } from "@tiller-ds/core";
import { Input } from "@tiller-ds/form-elements";

import { backendDomain, agentDomain } from "../../constants/apiConstants";
import useSchemaModalStore from "../../stores/schemaModalStore";
import useAgentStore from "../../stores/agentStore";
import DragDrop from "../RightPanel/DragDrop";

export default function NewSchema({
  convertSchemaPathsToList,
  convertSchemaDefinitionsToList,
}: {
  convertSchemaPathsToList: (data: any) => void;
  convertSchemaDefinitionsToList: (data: any) => void;
}) {
  const setModalOpened = useSchemaModalStore((store) => store.setOpened);

  /* Get agent id and pid*/
  const agentId = useAgentStore((store: any) => store.agentId);
  const agentPid = useAgentStore((store: any) => store.agentPid);

  /* Function for setting new agent pid */
  const setAgentPid = useAgentStore((store: any) => store.setAgentPid);

  const [inputError, setInputError] = useState("");
  const [apiSchema, setApiSchema] = useState(
    "http://localhost:8080/swagger.json"
  );
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [isFetched, setIsFetched] = useState(false);

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
    if (val.target.value.trim().length === 0) {
      setNameError("No API schema name specified");
    } else {
      setNameError("");
    }
  }

  // Submit api adress to backend
  async function submitApiAdress() {
    try {
      if (name.trim().length == 0 || apiSchema.trim().length == 0) {
        if (name.length == 0) {
          setNameError("No API schema name specified");
        } else if (apiSchema.length == 0) {
          setInputError("Address not provided in request data");
        }
        return;
      }

      const backendData = await axios.post(`${backendDomain}/apiSchema/fetch`, {
        address: apiSchema,
        name: name,
      });

      const agentData = await axios.post(`${agentDomain}/api/restart-api`, {
        id: agentId,
        pid: agentPid,
      });

      console.info(agentData.data.message);
      setAgentPid(agentData.data.PID);

      extractDataFromSchema(backendData.data);

      // Show confirmation message
      setIsFetched(true);
      setTimeout(() => {
        setIsFetched(false);
        setModalOpened(false);
      }, 1000);
    } catch (e: any) {
      setInputError(e.response ? e.response.data.error : e.message);
    }
  }

  const extractDataFromSchema = (schema: any) => {
    convertSchemaPathsToList(schema);
    convertSchemaDefinitionsToList(schema);
  };

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
          onFileUpload={extractDataFromSchema}
          name={name}
          setNameError={setNameError}
        />
      </div>
    </div>
  );
}
