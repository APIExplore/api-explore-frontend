import { ApexConfiguration, ApexData } from "./apexTypes";
import { ApiCall } from "../../../types/apiCallTypes";
import { prettifyTimestamp } from "../../../util/dateUtils";

export function displayTooltip(
  series: number[],
  seriesIndex: number,
  dataPointIndex: number,
  configuration: ApexConfiguration,
) {
  const timestamps =
    configuration.config.series[seriesIndex].data[dataPointIndex].y;
  const beginTimestamp = prettifyTimestamp(timestamps[0]);
  const endTimestamp = prettifyTimestamp(timestamps[1]);

  return (
    '<div class="p-2 bg-primary-light opacity-50 text-center">' +
    '<span class="text-body-dark font-medium">' +
    configuration.globals.labels[seriesIndex] +
    "<br />" +
    beginTimestamp +
    " - " +
    endTimestamp +
    "</span>" +
    "</span>"
  );
}

export function selectDataPoint(
  config: { selectedDataPoints: number[][]; w: ApexConfiguration },
  apiCalls: ApiCall[],
) {
  const dataSeries = config.w.config.series;
  const selectedDataPoints = config.selectedDataPoints;
  const selectedDataSeries: ApexData[] = [];
  selectedDataPoints.forEach((selectedSeriesIds: number[], index: number) => {
    selectedSeriesIds.forEach((point: number) => {
      selectedDataSeries.push(dataSeries[index].data[point]);
    });
  });

  const selectedSeriesIds = selectedDataSeries.map((data) => data.operationId);

  return apiCalls.filter((call) =>
    selectedSeriesIds.includes(call.operationId),
  );
}

export enum MethodColorMappings {
  GET = "green",
  POST = "sky",
  PUT = "orange",
  DELETE = "red",
}
