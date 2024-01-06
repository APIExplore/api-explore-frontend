import React, { useState } from "react";

import { Tooltip, Typography } from "@tiller-ds/core";
import { Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { DropdownMenu } from "@tiller-ds/menu";

import useAgentStore from "../../stores/agentStore";

interface ApiListProps {
  apiList: any[];
}

export default function ApiList({ apiList }: ApiListProps) {
  const startAgent = useAgentStore((state) => state.startAgent);
  const { startedApi, setStartedApi } = useAgentStore();
  const { javaPath, setJavaPath } = useAgentStore();
  const currentAgentId = useAgentStore((state) => state.agentId);
  const currentAgentPid = useAgentStore((state) => state.agentPid);

  const [isStarted, setIsStarted] = useState(false);
  const [isFetchFailed, setIsFetchFailed] = useState(false);

  const handleSelect = async (api: any) => {
    setStartedApi(null);
    try {
      await startAgent(
        api.id,
        currentAgentId,
        currentAgentPid,
        javaPath.length > 0 ? javaPath : undefined,
      );
      setIsStarted(true);
      setIsFetchFailed(false);
      setStartedApi(api.name);
    } catch (error: any) {
      setIsFetchFailed(true);
      setIsStarted(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-between">
      <div className="flex flex-col my-2 w-full">
        <div className="py-3 mt-6 text-center">
          <Typography variant="h6">Start API:</Typography>
        </div>
        <div className="flex flex-col">
          <div className="pb-3 mt-6 text-center">
            <DropdownMenu
              title="Available APIs"
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
                isStarted ? "green" : "red"
              }-600 mt-2 text-base text-center h-2`}
            >
              {isStarted && "API '" + startedApi + "' started"}
              {isFetchFailed && (
                <>
                  API could not be started. <br /> Java version could be wrong,
                  check your Java path.
                </>
              )}
            </p>
          </div>
        </div>
        <hr className="mt-8 mb-10" />
        <Input
          name="javaVersion"
          label="Java path (optional)"
          tooltip={
            <Tooltip
              label={
                <span>
                  Some APIs require older versions of Java to run properly.
                  <br />
                  Set this value to a path of a desired Java version to run the
                  API with it.
                </span>
              }
            >
              <Icon
                type="info"
                className="text-slate-400 hover:text-slate-500"
              />
            </Tooltip>
          }
          help="If not specified the default 'java' command will be used"
          placeholder="e.g. C:/Program Files/Java/jre-1.8/bin/java.exe"
          className="px-4"
          inlineLeadingIcon={<Icon type="coffee" />}
          crossOrigin={undefined}
          value={javaPath}
          onChange={(e) => setJavaPath(e.target.value)}
        />
      </div>
      <div className="text-center">
        <Typography variant="subtext">
          Note: starting an API from this tab requires the agent running in the
          background.
        </Typography>
      </div>
    </div>
  );
}
