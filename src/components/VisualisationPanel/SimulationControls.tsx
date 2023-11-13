import { ButtonGroups } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import useApiCallsStore from "../../stores/apiCallsStore";
import { useRequestsStore } from "../../stores/requestsStore";
import { Request } from "../RightPanel/types/RightPanelTypes";

export default function SimulationControls() {
  const selectedRequests: Request[] = useRequestsStore(
    (store) => store.selectedRequests
  );
  const fetchData = useApiCallsStore((store) => store.fetchData);

  const simulateCallSequence = async () => {
    await fetchData(selectedRequests);
  };

  return (
    <div className="w-fit h-20 absolute right-0 top-0 mr-4 mt-6 z-50">
      <ButtonGroups className="" tokens={{ base: "" }}>
        <ButtonGroups.Button variant="text" id="pause-button">
          <Icon type="pause" />
        </ButtonGroups.Button>
        <ButtonGroups.Button
          onClick={simulateCallSequence}
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
