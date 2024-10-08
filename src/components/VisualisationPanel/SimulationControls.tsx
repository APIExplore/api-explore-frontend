import React from "react";

import { useNotificationContext } from "@tiller-ds/alert";
import { Button, ButtonGroups, Tooltip, Typography } from "@tiller-ds/core";
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

export default function SimulationControls({
  shouldReposition,
}: {
  shouldReposition: boolean;
}) {
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

  const {
    fetchData,
    callByCallMode,
    setCallByCallMode,
    setApiCalls,
    setSchemaName,
  } = useApiCallsStore();

  const clearRelationshipMappings = useRelationshipsStore(
    (store) => store.clearMappings,
  );

  const simulateCallSequence = async () => {
    notification.push(renderSimulationStartedNotification());
    clearRelationshipMappings();
    if (callByCallMode.enabled) {
      if (callByCallMode.nextCallIndex === selectedRequests.length) {
        setCallByCallMode(callByCallMode.enabled, 0);
        await fetchData(
          callSequenceName,
          Array.of(selectedRequests.at(0) as Request),
          logsStore,
        );
        setCallByCallMode(callByCallMode.enabled, 1);
      } else {
        await fetchData(
          callSequenceName,
          Array.of(
            selectedRequests.at(callByCallMode.nextCallIndex) as Request,
          ),
          logsStore,
        );
        setCallByCallMode(
          callByCallMode.enabled,
          callByCallMode.nextCallIndex + 1,
        );
      }
    } else {
      await fetchData(callSequenceName, selectedRequests, logsStore);
    }
  };
  const resetCallByCall = () => {
    setCallByCallMode(callByCallMode.enabled, 0);
    setApiCalls([]);
  };

  const openLandingPage = () => {
    setModalOpened(true);
  };

  const stopApi = () => {
    notification.push(renderApiStoppedNotification(startedApi as string));
    stopAgent();
    openLandingPage();
    setSchemaName(null);
  };

  return (
    <div
      className={`w-fit flex absolute right-0 ${
        shouldReposition ? "bottom-0" : "top-1"
      } mr-4 z-40`}
    >
      <Typography
        className="opacity-60 hover:opacity-100 ease-in-out duration-100 z-40 absolute top-1 right-32
      px-3 rounded-lg text-xs text-primary-dark tracking-widest border border-primary-light bg-primary-light"
      >
        Simulation
      </Typography>
      <Typography
        className="opacity-60 hover:opacity-100 ease-in-out duration-100 absolute z-40 top-1 right-7
      px-3 rounded-lg text-xs text-primary-dark tracking-widest border border-primary-light bg-primary-light"
      >
        Agent
      </Typography>
      <div className="mt-2 flex items-center h-full py-2">
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
              {callSequenceName.length === 0 ||
              selectedRequests.length === 0 ? (
                <Tooltip label="You must enter a call sequence name and have at least one endpoint to run simulation">
                  <div className="flex items-center justify-center">
                    <Icon type="play" className="text-primary-dark" />
                  </div>
                </Tooltip>
              ) : (
                <div className="flex flex-col relative">
                  <Icon type="play" />
                  {callByCallMode.enabled && (
                    <div className="absolute top-0 left-0 px-4 pt-3 rounded-lg text-xs">
                      {callByCallMode.nextCallIndex}/{selectedRequests.length}
                    </div>
                  )}
                </div>
              )}
            </ButtonGroups.Button>
            <ButtonGroups.Button
              variant="text"
              id="stop-button"
              onClick={resetCallByCall}
              disabled={!callByCallMode.enabled}
            >
              {!callByCallMode.enabled ? (
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
              id="agent-stop-button"
              disabled={!agentPid}
              onClick={stopApi}
            >
              <div className="flex flex-col relative">
                <Tooltip label="Stop active API">
                  <div className="flex items-center justify-center">
                    <Icon type="stop-circle" className="text-primary-dark" />
                  </div>
                  {agentPid && (
                    <div className="absolute top-1 left-0 px-4 pt-3 rounded-lg text-xs">
                      <div className="bg-success w-1.5 h-1.5 rounded-full" />
                    </div>
                  )}
                </Tooltip>
              </div>
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
              <Tooltip label="Restart active API">
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
    </div>
  );
}
