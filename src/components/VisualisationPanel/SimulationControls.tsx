import React from "react";

import { ButtonGroups } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import useApiCallsStore from "../../stores/apiCallsStore";
import useRequestsStore from "../../stores/requestsStore";
import useSchemaModalStore from "../../stores/schemaModalStore";
import { Request } from "../RightPanel/types/RightPanelTypes";

export default function SimulationControls() {
  const setModalOpened = useSchemaModalStore((store) => store.setOpened);
  const selectedRequests: Request[] = useRequestsStore(
    (store) => store.selectedRequests
  );
  const callSequenceName = useRequestsStore((store) => store.callSequenceName);
  const fetchData = useApiCallsStore((store) => store.fetchData);

  const simulateCallSequence = async () => {
    await fetchData(callSequenceName, selectedRequests);
  };

  const openLandingPage = () => {
    setModalOpened(true);
  };

  return (
    <div className="w-fit h-20 absolute right-0 top-0 mr-4 mt-6 z-40">
      <ButtonGroups tokens={{ base: "" }}>
        <ButtonGroups.Button
          variant="text"
          leadingIcon={<Icon type="files" />}
          onClick={openLandingPage}
        >
          Choose Schema
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
          <Icon type="play" />
        </ButtonGroups.Button>
        <ButtonGroups.Button variant="text" id="stop-button">
          <Icon type="stop" />
        </ButtonGroups.Button>
      </ButtonGroups>
    </div>
  );
}
