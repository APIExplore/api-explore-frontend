import React, { useRef, useState } from "react";

import { Tooltip, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";
import { cx } from "@tiller-ds/theme";

import useApiCallsStore from "../../stores/apiCallsStore";
import useApiConfigStore from "../../stores/apiConfigStore";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import { ApiCall, Metrics as MetricsType } from "../../types/apiCallTypes";

export default function Metrics() {
  const { metrics, apiCalls } = useApiCallsStore((state) => ({
    metrics: state.metrics,
    apiCalls: state.apiCalls,
  }));

  const getFilteredOperationIds = (statusCheck: {
    (status: number): boolean;
    (status: number): boolean;
    (arg0: number): unknown;
  }) =>
    apiCalls
      .filter((call) => statusCheck(call.response.status))
      .flatMap((call) => call.operationId);

  if (metrics && apiCalls.length > 0) {
    const {
      numCalls,
      successfulCalls,
      unsuccessfulCalls,
      totDuration,
      totSize,
      avgDuration,
      avgSize,
    } = metrics;

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
        <div className="flex flex-wrap justify-between mt-4">
          <MetricCard id="numCalls" title="Total Calls" value={numCalls} />
          <MetricCard
            id="successfulCalls"
            title="Successful Calls"
            value={successfulCalls}
            callsToDisplay={successfulOperationIds}
            color="green"
          />
          <MetricCard
            id="unsuccessfulCalls"
            title="Unsuccessful Calls"
            value={unsuccessfulCalls}
            callsToDisplay={unsuccessfulOperationIds}
            color="red"
          />
          <MetricCard
            id="totDuration"
            title="Total Duration"
            value={formatValueWithUnit(totDuration, "ms")}
          />
          <MetricCard
            id="avgDuration"
            title="Average Duration"
            value={formatValueWithUnit(avgDuration.toFixed(2), "ms")}
          />
          <MetricCard
            id="totSize"
            title="Total Size"
            value={formatValueWithUnit(totSize, "bytes")}
          />
          <MetricCard
            id="avgSize"
            title="Average Size"
            value={formatValueWithUnit(avgSize.toFixed(2), "bytes")}
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

type MetricCardProps = {
  id: keyof MetricsType;
  title: string;
  value: number | string;
  color?: string;
  callsToDisplay?: string[];
};

function MetricCard({
  id,
  title,
  value,
  color,
  callsToDisplay,
}: MetricCardProps) {
  const leftPanelWidth = usePanelDimensionsStore(
    (state) => state.panels.left.width,
  );
  const apiCalls = useApiCallsStore((state) => state.apiCalls);
  const setSelectedApiCalls = useApiCallsStore(
    (state) => state.setSelectedApiCalls,
  );
  const apexConfig = useApiConfigStore((store) => store.apexConfig);

  const [selected, setSelected] = useState<boolean>(false);

  const finalValue =
    (id === "unsuccessfulCalls" || id === "successfulCalls") &&
    callsToDisplay &&
    callsToDisplay?.length > 0 ? (
      <Tooltip label={<span>{callsToDisplay.join("\n")}</span>}>
        <span className="flex space-x-4">
          {value}
          <Icon type="info" size={2} />
        </span>
      </Tooltip>
    ) : null;

  const chart = ApexCharts.getChartByID("api-simulator");
  const unselectRef = useRef<any>(null);

  const selectApiCalls = (select: boolean) => {
    const selectedCalls: ApiCall[] = apiCalls.filter(
      (call) => callsToDisplay?.includes(call.operationId),
    );

    apexConfig?.config.series.forEach((series, seriesIndex) => {
      series.data.forEach((dataPoint, dataPointIndex) => {
        const timestamp = dataPoint.timestamp;
        const isSelected = selectedCalls.some((c) => c.date === timestamp);
        const isUnselected =
          unselectRef.current &&
          unselectRef.current.some((c: { date: any }) => c.date === timestamp);

        if (chart) {
          if (select && isSelected) {
            chart.toggleDataPointSelection(seriesIndex, dataPointIndex);
          }

          if (!select && isUnselected) {
            chart.toggleDataPointSelection(seriesIndex, dataPointIndex);
            chart.resetSeries();
          }
        }
      });
    });

    if (selected) {
      setSelectedApiCalls([]);
    } else {
      setSelectedApiCalls(selectedCalls);
    }
    unselectRef.current = selectedCalls;
  };

  const onMetricClick = () => {
    if (callsToDisplay && callsToDisplay.length > 0) {
      if (selected) {
        selectApiCalls(false);
      } else {
        selectApiCalls(true);
      }
      setSelected(!selected);
    }
  };

  const cardClasses = cx(
    "p-2 mx-1 my-1.5",
    leftPanelWidth > 350 ? "w-[47%]" : "w-full",
    "border rounded shadow-sm hover:shadow-md ease-in-out duration-100",
    callsToDisplay && callsToDisplay.length > 0 && "cursor-pointer",
    selected && "bg-primary-light",
  );

  const titleClasses = cx("text-gray-600");

  const valueClasses = cx(
    "text-xl font-semibold",
    color ? `text-${color}-600` : "text-body",
  );

  return (
    <div className={cardClasses} onClick={onMetricClick}>
      <Typography className={titleClasses}>{title}</Typography>
      <p>
        <Typography className={valueClasses}>{finalValue || value}</Typography>
      </p>
    </div>
  );
}
