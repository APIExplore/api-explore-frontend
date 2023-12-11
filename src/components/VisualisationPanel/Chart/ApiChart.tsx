import React, { useEffect, useRef, useState } from "react";

import Chart from "react-apexcharts";
import colors from "tailwindcss/colors";

import { Alert } from "@tiller-ds/alert";
import { Badge, Tooltip } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { ApexData } from "./apexTypes";
import {
  displayTooltip,
  MethodColorMappings,
  prettifyDataLabel,
  selectDataPoint,
} from "./apiChartUtils";
import useApiCallsStore from "../../../stores/apiCallsStore";
import useApiConfigStore from "../../../stores/apiConfigStore";
import usePanelDimensionsStore from "../../../stores/panelDimensionsStore";
import { ApiCall } from "../../../types/apiCallTypes";
import { prettifyTimestamp } from "../../../util/dateUtils";

export default function ApiChart() {
  const schemaName = useApiCallsStore((store) => store.schemaName);
  const apiCalls = useApiCallsStore((state) => state.apiCalls);
  const fetching = useApiCallsStore((state) => state.fetching);
  const setSelectedApiCalls = useApiCallsStore(
    (state) => state.setSelectedApiCalls,
  );
  const visualisationPanelHeight = usePanelDimensionsStore(
    (store) => store.panels.middle.height,
  );

  const setApexConfig = useApiConfigStore((state) => state.setApexConfig);
  const [apexData, setApexData] = useState<ApexData[]>([]);

  useEffect(() => {
    const apexData: ApexData[] = [];
    apiCalls.forEach((call: ApiCall) => {
      const timestampMs = new Date(call.date).getTime();
      apexData.push({
        timestamp: call.date,
        url: call.url,
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
      id: "api-simulator",
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      toolbar: {
        show: true,
      },
      events: {
        dataPointSelection: selectDataPoints,
        updated(chart: any, options?: any) {
          setApexConfig(options);
        },
      },
    },
    stroke: { width: 1, curve: "smooth" },
    dataLabels: {
      enabled: true,
      formatter: prettifyDataLabel,
      dropShadow: {
        enabled: true,
        left: 1,
        top: 1,
        opacity: 0.5,
        blur: 1,
      },
    },
    xaxis: {
      axisBorder: { show: true },
      labels: {
        formatter: (value) => prettifyTimestamp(value),
      },
    },
    plotOptions: {
      bar: {
        rangeBarOverlap: false,
        horizontal: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
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
  const chartRef = useRef(null);
  return (
    <div className="pr-4">
      {apiCalls.length > 0 && !fetching ? (
        <Chart
          type="rangeBar"
          width="100%"
          height={`${visualisationPanelHeight - 110}px`}
          series={apiSeries}
          options={apexOptions}
          ref={chartRef}
        />
      ) : (
        <div className="w-full h-full">
          {apiCalls.length === 0 && (
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
          )}
          <Chart
            type="rangeBar"
            width="100%"
            height={`${visualisationPanelHeight - 110}px`}
            series={apiSeries}
            options={apexOptions}
          />
        </div>
      )}
      <Tooltip label="Currently selected schema">
        <Badge
          className="w-fit self-center absolute bottom-0 left-0 z-50 select-all"
          color="secondary"
          small={true}
          tokens={{
            master:
              "py-1 text-xs font-medium rounded-tr-md inline-flex items-center shadow-inner",
          }}
          variant="filled"
        >
          <Icon type="file-text" className="pr-1" /> {schemaName}
        </Badge>
      </Tooltip>
    </div>
  );
}
