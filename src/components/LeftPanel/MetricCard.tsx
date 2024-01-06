import React, { useRef, useState } from "react";

import { Tooltip, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";
import { cx } from "@tiller-ds/theme";

import useApiCallsStore from "../../stores/apiCallsStore";
import useApiConfigStore from "../../stores/apiConfigStore";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import { ApiCall, Metrics as MetricsType } from "../../types/apiCallTypes";

type MetricCardProps = {
  id: keyof MetricsType;
  title: string;
  value: number | string;
  color?: string;
  callsToDisplay?: string[];
  callByCallWarning?: boolean;
};

export default function MetricCard({
  id,
  title,
  value,
  color,
  callsToDisplay,
  callByCallWarning,
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

  const infoValue =
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

  const warningValue = (
    <Tooltip label="Since call-by-call is enabled this metric is only for the last executed call">
      <span className="flex space-x-4">
        {value}
        <Icon type="warning" size={2} className="text-warning" />
      </span>
    </Tooltip>
  );
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
        {callByCallWarning ? (
          <Typography className={valueClasses}>{warningValue}</Typography>
        ) : (
          <Typography className={valueClasses}>{infoValue || value}</Typography>
        )}
      </p>
    </div>
  );
}
