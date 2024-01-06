import React from "react";

import { Tooltip, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import MetricCard from "./MetricCard";
import useApiCallsStore from "../../stores/apiCallsStore";

export default function Metrics() {
  const { metrics, apiCalls, callByCall } = useApiCallsStore((state) => ({
    metrics: state.metrics,
    apiCalls: state.apiCalls,
    callByCall: state.callByCallMode,
  }));

  const getFilteredOperationIds = (statusCheck: {
    (status: number): boolean;
    (status: number): boolean;
  }) =>
    apiCalls
      .filter((call) => statusCheck(call.response.status))
      .flatMap((call) => call.operationId);

  if (metrics && apiCalls.length > 0) {
    const { totDuration, totSize, avgDuration, avgSize } = metrics;

    const successfulOperationIds = getFilteredOperationIds(
      (status: number) => status >= 200 && status < 300,
    );
    const unsuccessfulOperationIds = getFilteredOperationIds(
      (status: number) => !(status >= 200 && status < 300),
    );

    const formatValueWithUnit = (value: string | number, unit: string) =>
      `${value} ${unit}`;

    return (
      <div className="max-w-md mx-auto rounded overflow-hidden p-4">
        <Typography variant="h5">Performance Metrics</Typography>
        <div className="flex flex-wrap justify-between mt-4" id="metrics">
          <MetricCard
            id="numCalls"
            title="Total Calls"
            value={apiCalls.length}
          />
          <MetricCard
            id="successfulCalls"
            title="Successful Calls"
            value={successfulOperationIds.length}
            callsToDisplay={successfulOperationIds}
            color="green"
          />
          <MetricCard
            id="unsuccessfulCalls"
            title="Unsuccessful Calls"
            value={unsuccessfulOperationIds.length}
            callsToDisplay={unsuccessfulOperationIds}
            color="red"
          />
          <MetricCard
            id="totDuration"
            title="Total Duration"
            value={formatValueWithUnit(totDuration, "ms")}
            callByCallWarning={callByCall.enabled}
          />
          <MetricCard
            id="avgDuration"
            title="Average Duration"
            value={formatValueWithUnit(avgDuration.toFixed(2), "ms")}
            callByCallWarning={callByCall.enabled}
          />
          <MetricCard
            id="totSize"
            title="Total Size"
            value={formatValueWithUnit(totSize, "bytes")}
            callByCallWarning={callByCall.enabled}
          />
          <MetricCard
            id="avgSize"
            title="Average Size"
            value={formatValueWithUnit(avgSize.toFixed(2), "bytes")}
            callByCallWarning={callByCall.enabled}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full h-full px-2 text-center">
      <div className="flex items-center space-x-2 py-4 px-2">
        <Icon type="gauge" />
        <Typography variant="h5">Performance Metrics</Typography>
      </div>
      <span className="flex flex-col space-y-1 w-full justify-center items-center p-4 group">
        <Tooltip label="Press the play button to start the simulation and see the metrics">
          <Icon
            type="calculator"
            className="text-slate-400 group-hover:text-slate-500"
          />
        </Tooltip>
        <Typography variant="subtext" className="cursor-default">
          <div className="group-hover:text-slate-800">
            Run the simulation to see the calculated metrics here
          </div>
        </Typography>
      </span>
    </div>
  );
}
