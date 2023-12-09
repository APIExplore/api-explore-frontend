import React from "react";

import { ButtonGroups, Tooltip } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import useApiCallsStore from "../../stores/apiCallsStore";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";
import useSchemaModalStore from "../../stores/schemaModalStore";
import { Request } from "../RightPanel/types/RightPanelTypes";
import useAgentStore from "../../stores/agentStore";
import useLogsStore from "../../stores/logsStore";

export default function SimulationControls() {
  /* Get agent id and pid*/
  const agentPid = useAgentStore((store: any) => store.agentPid);
  const agentId = useAgentStore((store: any) => store.agentId);

  /* Function for setting new agent pid */
  const restoreAgent = useAgentStore((store: any) => store.restoreAgent);

  const setModalOpened = useSchemaModalStore((store) => store.setOpened);
  const selectedRequests: Request[] = useRequestsStore(
    (store) => store.selectedRequests,
  );
  const callSequenceName = useRequestsStore((store) => store.callSequenceName);
  const logsStore = useLogsStore();
  const fetchData = useApiCallsStore((store) => store.fetchData);

  const simulateCallSequence = async () => {
    await fetchData(callSequenceName, selectedRequests, logsStore);
  };

  const setAllRequests = useRequestsStore(
    (store: RequestsStore) => store.setAllRequests,
  );
  const setSelectedRequests = useRequestsStore(
    (store: RequestsStore) => store.setSelectedRequests,
  );
  const setDefinitions = useRequestsStore(
    (store: RequestsStore) => store.setDefinitions,
  );
  const setAllShownItems = useRequestsStore(
    (store: RequestsStore) => store.setAllShownItems,
  );
  const setCallSequenceName = useRequestsStore(
    (store: RequestsStore) => store.setCallSequenceName,
  );

  const openLandingPage = () => {
    setModalOpened(true);
    setAllRequests([]);
    setSelectedRequests([]);
    setDefinitions([]);
    setAllShownItems([]);
    setCallSequenceName("");
  };

  return (
    <div className="w-fit h-20 absolute right-0 top-0 mr-4 mt-4 z-40">
      <ButtonGroups tokens={{ base: "" }}>
        <ButtonGroups.Button
          id="choose-schema"
          variant="text"
          leadingIcon={<Icon type="files" />}
          onClick={openLandingPage}
        >
          Choose Schema
        </ButtonGroups.Button>
        <ButtonGroups.Button
          onClick={() => restoreAgent(agentId, agentPid)}
          disabled={!agentPid}
          variant="text"
          id="restart-button"
        >
          <Icon type="arrow-counter-clockwise" />
        </ButtonGroups.Button>
        <ButtonGroups.Button variant="text" id="pause-button">
          <Icon type="pause" />
        </ButtonGroups.Button>
        <ButtonGroups.Button
          onClick={simulateCallSequence}
          disabled={callSequenceName.length === 0}
          variant="text"
          id="play-button"
        >
          {callSequenceName.length === 0 ? (
            <Tooltip label="You must enter a call sequence name to run the simulation">
              <div className="flex items-center justify-center">
                <Icon type="play" className="text-primary-dark" />
              </div>
            </Tooltip>
          ) : (
            <Icon type="play" />
          )}
        </ButtonGroups.Button>
        <ButtonGroups.Button variant="text" id="stop-button">
          <Icon type="stop" />
        </ButtonGroups.Button>
      </ButtonGroups>
    </div>
  );
}
