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
  const operation = findOperationByPosition(timestamps, configuration);
  const beginTimestamp = prettifyTimestamp(timestamps[0]);
  const endTimestamp = prettifyTimestamp(timestamps[1]);

  return (
    '<div class="p-2 bg-white opacity-50 text-center">' +
    '<span class="text-body-dark font-medium">' +
    operation.operationId +
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
  const selectedSeriesIds = selectedDataSeries.map((data) => data.timestamp);
  return apiCalls.filter((call) => selectedSeriesIds.includes(call.date));
}

export function prettifyDataLabel(val: string | number | number[], opts?: any) {
  const operation = findOperationByPosition(val, opts);
  return (
    operation.operationId.substring(0, operation.y[1] - operation.y[0]) + "..."
  );
}

const findOperationByPosition = (
  val: string | number | number[],
  conf: ApexConfiguration,
) =>
  conf.config.series
    .flatMap((s) => s.data)
    .find((d) => d["y"][0] === val[0] && d["y"][1] === val[1]) as ApexData;

export enum MethodColorMappings {
  GET = "green",
  POST = "sky",
  PUT = "orange",
  DELETE = "red",
}
