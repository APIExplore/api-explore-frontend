import React, { useMemo, useRef } from "react";

import {
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  SelectionChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ResizableBox } from "react-resizable";

import { Tooltip } from "@tiller-ds/core";

import { ITemporary } from "./types";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import useApiCallsStore from "../../stores/apiCallsStore";
import useApiConfigStore from "../../stores/apiConfigStore";
import usePanelDimensionsStore from "../../stores/panelDimensionsStore";
import { ApiCall } from "../../types/apiCallTypes";
import MethodBadge from "../MethodBadge";

export default function BottomPanel() {
  const apiCalls = useApiCallsStore((state) => state.apiCalls);
  const setSelectedApiCalls = useApiCallsStore(
    (state) => state.setSelectedApiCalls,
  );
  const setDimensions = usePanelDimensionsStore((store) => store.setDimensions);
  const containerWidth = usePanelDimensionsStore(
    (store) => store.panels.container.width,
  );
  const fetchedApiCalls = useApiCallsStore((store) => store.apiCalls);
  const apexConfig = useApiConfigStore((store) => store.apexConfig);

  const gridRef = useRef<AgGridReact<ApiCall>>(null);

  const renderCell = (params) => {
    const field = params.colDef.field;
    const value = params.value;
    if (field === "method") {
      return (
        <Tooltip label={value.toUpperCase()}>
          <MethodBadge method={value} />
        </Tooltip>
      );
    }

    if (field === "response.status") {
      return (
        <Tooltip label={value}>
          <div className={`truncate ${value === 500 && "text-primary-dark"}`}>
            {value}
          </div>
        </Tooltip>
      );
    }

    return (
      <Tooltip label={params.value}>
        <div className="truncate">{params.value}</div>
      </Tooltip>
    );
  };

  const unselectRef = useRef<any>(null);
  const toggleRowSelected = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    const selectedCalls: ApiCall[] = [];
    selectedRows.forEach((row) => {
      console.log(row);
      const foundApiCall = apiCalls.find((call) => call.date === row.date);
      if (foundApiCall) {
        selectedCalls.push(foundApiCall);
      }
    });

    const chart = ApexCharts.getChartByID("api-simulator");

    apexConfig?.config.series.forEach((series, seriesIndex) => {
      series.data.forEach((dataPoint, dataPointIndex) => {
        const timestamp = dataPoint.timestamp;
        const isSelected = selectedRows.some((c) => c.date === timestamp);
        const isUnselected =
          unselectRef.current &&
          unselectRef.current.some((c) => c.date === timestamp);

        if (chart && isSelected && !isUnselected) {
          chart.toggleDataPointSelection(seriesIndex, dataPointIndex);
        }

        if (chart && !isSelected && isUnselected) {
          chart.toggleDataPointSelection(seriesIndex, dataPointIndex);
        }
      });
    });

    setSelectedApiCalls(selectedCalls);
    unselectRef.current = selectedRows;
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Timestamp",
      field: "date",
      cellRenderer: renderCell,
    },
    {
      headerName: "URL",
      field: "url",
      cellRenderer: renderCell,
    },
    {
      headerName: "Operation ID",
      field: "operationId",
      cellRenderer: renderCell,
    },
    {
      headerName: "Endpoint",
      field: "endpoint",
      cellRenderer: renderCell,
    },
    {
      headerName: "Response Status",
      field: "response.status",
      cellRenderer: renderCell,
    },
    {
      headerName: "Method",
      field: "method",
      cellRenderer: renderCell,
    },
  ];

  const context = useMemo(() => ({ temp: 0.9 }) as ITemporary, []);
  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams<ApiCall>) => {
      return params.data.date;
    };
  }, []);
  const ref = useResizeObserver("bottom", setDimensions);

  return (
    <ResizableBox
      width={containerWidth - 8}
      height={300}
      resizeHandles={["n"]}
      transformScale={0.3}
    >
      <div
        className="w-full h-full mx-1 drop-shadow-md"
        ref={ref}
        id="bottom-panel"
      >
        <div className="flex-col h-full">
          <div className="h-full w-full ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowData={fetchedApiCalls}
              columnDefs={columnDefs}
              rowSelection={"multiple"}
              rowMultiSelectWithClick={true}
              getRowId={getRowId}
              context={context}
              onSelectionChanged={toggleRowSelected}
            />
          </div>
        </div>
      </div>
    </ResizableBox>
  );
}
