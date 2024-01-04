import React, { useState } from "react";

import { Typography } from "@tiller-ds/core";
import { DropdownMenu } from "@tiller-ds/menu";

import useAgentStore from "../../stores/agentStore";

interface ApiListProps {
  apiList: any[];
}

export default function ApiList({ apiList }: ApiListProps) {
  const startAgent = useAgentStore((state) => state.startAgent);
  const currentAgentId = useAgentStore((state) => state.agentId);
  const currentAgentPid = useAgentStore((state) => state.agentPid);
  const [startedApi, setStartedApi] = useState(null);
  const [isStarted, setisStarted] = useState(false);

  const handleSelect = async (api: any) => {
    setStartedApi(null);
    try {
      await startAgent(api.id, currentAgentId, currentAgentPid);
      setisStarted(true);
      setStartedApi(api.name);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="flex flex-col my-2 w-full">
        <div className="py-3 mt-6 text-center">
          <Typography variant="h6">Select API:</Typography>
        </div>
        <div className="flex flex-col">
          <div className="pb-3 mt-6 text-center">
            <DropdownMenu
              title="Available API's"
              id="dropdown-available-apis"
              visibleItemCount={13}
            >
              {apiList.map((item, index) => (
                <div className="flex w-full justify-between" key={index}>
                  <DropdownMenu.Item
                    key={index}
                    onSelect={() => handleSelect(item)}
                  >
                    <div
                      id={"schema-" + index}
                      className="text-left text-body w-full"
                    >
                      {item.name}
                    </div>
                  </DropdownMenu.Item>
                </div>
              ))}
            </DropdownMenu>
            <p
              id="api-started"
              className={`text-${
                isStarted ? "green" : undefined
              }-600 mt-2 text-base text-center h-2`}
            >
              {isStarted && "API '" + startedApi + "' started"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
