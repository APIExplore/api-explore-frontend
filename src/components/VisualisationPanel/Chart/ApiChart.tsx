import React, { useEffect, useState } from "react";

import Chart from "react-apexcharts";
import colors from "tailwindcss/colors";

import { Alert } from "@tiller-ds/alert";
import { Icon } from "@tiller-ds/icons";

import {
  displayTooltip,
  MethodColorMappings,
  selectDataPoint,
} from "./apiChartUtils";
import useApiCallsStore from "../../../stores/apiCallsStore";
import usePanelDimensionsStore from "../../../stores/panelDimensionsStore";
import { ApexData } from "./apexTypes";
import { ApiCall } from "../../../types/apiCallTypes";
import { prettifyTimestamp } from "../../../util/dateUtils";

export default function ApiChart() {
  const apiCalls = useApiCallsStore((state) => state.apiCalls);
  const fetching = useApiCallsStore((state) => state.fetching);
  const setSelectedApiCalls = useApiCallsStore(
    (state) => state.setSelectedApiCalls,
  );
  const visualisationPanelHeight = usePanelDimensionsStore(
    (store) => store.panels.middle.height,
  );

  const [apexData, setApexData] = useState<ApexData[]>([]);

  useEffect(() => {
    const apexData: ApexData[] = [];
    apiCalls.forEach((call: ApiCall) => {
      const timestampMs = new Date(call.date).getTime();
      apexData.push({
        operationId: call.operationId,
        x: call.method.toUpperCase(),
        y: [timestampMs, timestampMs + call.duration],
      });
    });
    setApexData(apexData);
  }, [apiCalls]);

  const selectDataPoints = (event, chartContext, config) => {
    const selectedApiCalls = selectDataPoint(config, apiCalls);
    setSelectedApiCalls(selectedApiCalls);
  };

  const apiSeries: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: "GET",
      data: apexData.filter((dataSet) => dataSet.x === "GET"),
      color: colors[MethodColorMappings.GET]["300"],
    },
    {
      name: "POST",
      data: apexData.filter((dataSet) => dataSet.x === "POST"),
      color: colors[MethodColorMappings.POST]["300"],
    },
    {
      name: "PUT",
      data: apexData.filter((dataSet) => dataSet.x === "PUT"),
      color: colors[MethodColorMappings.PUT]["300"],
    },
    {
      name: "DELETE",
      data: apexData.filter((dataSet) => dataSet.x === "DELETE"),
      color: colors[MethodColorMappings.DELETE]["300"],
    },
  ];

  const apexOptions: ApexCharts.ApexOptions = {
    states: {
      active: {
        allowMultipleDataPointsSelection: true,
        filter: {
          type: "darken",
          value: 0.4,
        },
      },
    },
    labels: ["GET", "POST", "PUT", "DELETE"],
    chart: {
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      toolbar: {
        show: true,
      },
      events: {
        dataPointSelection: selectDataPoints,
      },
    },
    stroke: { width: 1, curve: "smooth" },
    dataLabels: { enabled: false },
    xaxis: {
      axisBorder: { show: true },
      labels: {
        formatter: prettifyTimestamp,
      },
    },
    plotOptions: {
      bar: {
        rangeBarOverlap: false,
        horizontal: true,
      },
    },
    yaxis: {
      show: true,
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) =>
        displayTooltip(series, seriesIndex, dataPointIndex, w),
    },
  };

  return (
    <div className="pr-4">
      {apiCalls.length > 0 && !fetching ? (
        <Chart
          type="rangeBar"
          width="100%"
          height={`${visualisationPanelHeight - 110}px`}
          series={apiSeries}
          options={apexOptions}
        />
      ) : (
        <div className="w-full h-full">
          <div className="absolute top-0 flex justify-center items-center w-full h-full pr-12 z-30">
            <Alert
              icon={<Icon className="text-info text-2xl" type="info" />}
              title="Simulation not started"
              variant="info"
              className="text-info-dark drop-shadow-md"
            >
              Select endpoints from <br />
              the configuration tab to see the results
            </Alert>
          </div>
          <Chart
            type="rangeBar"
            width="100%"
            height={`${visualisationPanelHeight - 110}px`}
            series={apiSeries}
            options={apexOptions}
          />
        </div>
      )}
    </div>
  );
}
