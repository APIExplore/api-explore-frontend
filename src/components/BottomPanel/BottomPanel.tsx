import React, { useCallback, useMemo, useRef, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  RowSelectedEvent,
} from "ag-grid-community";

import { IApiCall, ITemporary } from "./types";

export default function BottomPanel() {
  const gridRef = useRef<AgGridReact<IApiCall>>(null);

  const containerStyle = useMemo(() => "w-full h-full", []);
  const gridStyle = useMemo(() => "h-full w-full ag-theme-alpine", []);
  const buttonStyle = useMemo(
    () => "bg-blue-500 text-white px-4 py-2 rounded",
    [],
  );
  const apiCalls: IApiCall = {
    timestamp: "timestamp",
    method: "GET",
    endpoint: "/end/point",
    parameters: "parameters",
    requestBody: "requestBody",
    statusCode: "200",
    response: "response",
  };
  const initialRowData: IApiCall[] = useMemo(() => {
    const data: IApiCall[] = [];
    for (let i = 0; i < 50; i++) {
      data.push({ ...apiCalls });
    }
    return data;
  }, []);

  const [rowData, setRowData] = useState<IApiCall[]>(initialRowData);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: "Timestamp", field: "timestamp" },
    { headerName: "Method", field: "method" },
    { headerName: "Endpoint", field: "endpoint" },
    { headerName: "Parameters", field: "parameters" },
    { headerName: "Request body", field: "requestBody" },
    { headerName: "Status code", field: "statusCode" },
    { headerName: "Response", field: "response" },
  ]);

  const context = useMemo(() => ({ temp: 0.9 }) as ITemporary, []);

  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams<IApiCall>) => {
      return params.data.timestamp;
    };
  }, []);

  const onRowSelected = useCallback(
    (event: RowSelectedEvent<IApiCall, ITemporary>) => {
      if (event.data && event.node.isSelected()) {
        const timestamp: string = event.data.timestamp;
        const method: string = event.data.method;
        const endpoint: string = event.data.endpoint;
        const parameters: string = event.data.parameters;
        const requestBody: string = event.data.requestBody;
        const statusCode: string = event.data.statusCode;
        const response: string = event.data.response;
        console.log(
          "Selected API call data: " +
            timestamp +
            ", " +
            method +
            ", " +
            endpoint +
            ", " +
            parameters +
            ", " +
            requestBody +
            ", " +
            statusCode +
            ", " +
            response,
        );
      }
    },
    [],
  );

  const onShowSelection = useCallback(() => {
    const apiCalls: IApiCall[] = gridRef.current!.api.getSelectedRows();
    console.log(
      "Selected API calls are ",
      apiCalls.map(
        (apiCall: IApiCall) =>
          `${apiCall.timestamp} ${apiCall.method} ${apiCall.endpoint} ${apiCall.parameters} ${apiCall.requestBody} ${apiCall.statusCode} ${apiCall.response}`,
      ),
    );
  }, []);

  return (
    <div className={containerStyle}>
      <div className="flex flex-col h-full">
        {/*<div className="mb-4">*/}
        {/*  <button className={buttonStyle} onClick={onShowSelection}>*/}
        {/*    Log Selected Cars*/}
        {/*  </button>*/}
        {/*</div>*/}

        <div className={`${gridStyle} m-5`}>
          <AgGridReact<IApiCall>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection={"multiple"}
            context={context}
            getRowId={getRowId}
            onRowSelected={onRowSelected}
          />
        </div>
      </div>
    </div>
  );
}
