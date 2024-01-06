import React from "react";

import { useNotificationContext } from "@tiller-ds/alert";
import { Button, ButtonGroups, Tooltip } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import useAgentStore from "../../stores/agentStore";
import useApiCallsStore from "../../stores/apiCallsStore";
import useLogsStore from "../../stores/logsStore";
import useRelationshipsStore from "../../stores/relationshipsStore";
import useRequestsStore from "../../stores/requestsStore";
import useSchemaModalStore from "../../stores/schemaModalStore";
import {
  renderApiRestartedNotification,
  renderApiStoppedNotification,
  renderSimulationStartedNotification,
} from "../../util/notificationUtils";
import { Request } from "../RightPanel/types/RightPanelTypes";

export default function SimulationControls() {
  const notification = useNotificationContext();

  /* Get agent id and pid*/
  const agentPid = useAgentStore((store: any) => store.agentPid);
  const agentId = useAgentStore((store: any) => store.agentId);
  /* Function for setting new agent pid */
  const restoreAgent = useAgentStore((store: any) => store.restoreAgent);
  const stopAgent = useAgentStore((state) => state.stopAgent);
  const startedApi = useAgentStore((state) => state.startedApi);

  const setModalOpened = useSchemaModalStore((store) => store.setOpened);

  const selectedRequests: Request[] = useRequestsStore(
    (store) => store.selectedRequests,
  );
  const callSequenceName = useRequestsStore((store) => store.callSequenceName);

  const logsStore = useLogsStore();

  const fetchData = useApiCallsStore((store) => store.fetchData);
  const callByCall = useApiCallsStore((store) => store.callByCallMode);
  const setCallByCall = useApiCallsStore((store) => store.setCallByCallMode);
  const setApiCalls = useApiCallsStore((store) => store.setApiCalls);

  const clearRelationshipMappings = useRelationshipsStore(
    (store) => store.clearMappings,
  );

  const simulateCallSequence = async () => {
    notification.push(renderSimulationStartedNotification());
    clearRelationshipMappings();
    if (callByCall.enabled) {
      if (callByCall.nextCallIndex === selectedRequests.length) {
        setCallByCall(callByCall.enabled, 0);
        await fetchData(
          callSequenceName,
          Array.of(selectedRequests.at(0) as Request),
          logsStore,
        );
        setCallByCall(callByCall.enabled, 1);
      } else {
        await fetchData(
          callSequenceName,
          Array.of(selectedRequests.at(callByCall.nextCallIndex) as Request),
          logsStore
        );
        setCallByCall(callByCall.enabled, callByCall.nextCallIndex + 1);
      }
    } else {
      await fetchData(callSequenceName, selectedRequests, logsStore);
    }
  };
  const resetCallByCall = () => {
    setCallByCall(callByCall.enabled, 0);
    setApiCalls([]);
  };

  const openLandingPage = () => {
    setModalOpened(true);
  };

  return (
    <div className="w-fit h-9 flex absolute right-0 top-0 mr-4 mt-4 z-40">
      <Button
        id="choose-schema"
        variant="text"
        leadingIcon={<Icon type="files" />}
        className="mx-2"
        onClick={openLandingPage}
      >
        API Menu
      </Button>
      <div className="border-l px-2">
        <ButtonGroups>
          <ButtonGroups.Button
            onClick={simulateCallSequence}
            disabled={
              callSequenceName.length === 0 || selectedRequests.length === 0
            }
            variant="text"
            id="play-button"
          >
            {callSequenceName.length === 0 || selectedRequests.length === 0 ? (
              <Tooltip label="You must enter a call sequence name and have at least one endpoint to run simulation">
                <div className="flex items-center justify-center">
                  <Icon type="play" className="text-primary-dark" />
                </div>
              </Tooltip>
            ) : (
              <div className="flex flex-col relative">
                <Icon type="play" />
                {callByCall.enabled && (
                  <div className="absolute top-0 left-0 px-4 pt-3 rounded-lg text-xs">
                    {callByCall.nextCallIndex}/{selectedRequests.length}
                  </div>
                )}
              </div>
            )}
          </ButtonGroups.Button>
          <ButtonGroups.Button
            variant="text"
            id="stop-button"
            onClick={resetCallByCall}
            disabled={!callByCall.enabled}
          >
            {!callByCall.enabled ? (
              <Tooltip label="You can stop the simulation only in the Call-by-call mode">
                <div className="flex items-center justify-center">
                  <Icon type="stop" className="text-primary-dark" />
                </div>
              </Tooltip>
            ) : (
              <Icon type="stop" />
            )}
          </ButtonGroups.Button>
        </ButtonGroups>
      </div>
      <div className="border-l px-2">
        <ButtonGroups>
          <ButtonGroups.Button
            variant="text"
            id="stop-button"
            disabled={!agentPid}
            onClick={() => {
              notification.push(
                renderApiStoppedNotification(startedApi as string),
              );
              stopAgent();
            }}
          >
            <Tooltip label="Stop API">
              <div className="flex items-center justify-center">
                <Icon type="stop-circle" className="text-primary-dark" />
              </div>
            </Tooltip>
          </ButtonGroups.Button>
          <ButtonGroups.Button
            variant="text"
            id="restart-button"
            disabled={!agentPid}
            onClick={() => {
              notification.push(
                renderApiRestartedNotification(startedApi as string),
              );
              restoreAgent(agentId, agentPid);
            }}
          >
            <Tooltip label="Restart API">
              <div className="flex items-center justify-center">
                <Icon
                  type="arrow-counter-clockwise"
                  className="text-primary-dark"
                />
              </div>
            </Tooltip>
          </ButtonGroups.Button>
        </ButtonGroups>
      </div>
    </div>
  );
}
