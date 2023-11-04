import { Card, Container } from "@tiller-ds/core";
import { DataTable } from "@tiller-ds/data-display";
import { all } from "axios";
import "./overrided-css.css";

export default function Details() {
  type ApiCall = {
    id: number;
    name: string;
    method: string;
    timestamp: Date;
    endpoint: string;
    parameter: string;
    requestBody: string;
    statusCode: number;
    responseBody: string;
  };

  const allApiCallsSelected: ApiCall[] = [
    {
      id: 1,
      name: "API Call A",
      method: "GET",
      timestamp: new Date("11-3-2023"),
      endpoint: "/some-endpoint",
      parameter: "parameter",
      requestBody: "{request data}",
      statusCode: 200,
      responseBody: "{responseBody}",
    },
    {
      id: 2,
      name: "API Call B",
      method: "POST",
      timestamp: new Date("11-3-2023"),
      endpoint: "/some-endpoint",
      parameter: "parameter",
      requestBody: "{request data}",
      statusCode: 200,
      responseBody: "{responseBody}",
    },
    {
      id: 3,
      name: "API Call C",
      method: "GET",
      timestamp: new Date("11-3-2023"),
      endpoint: "/some-endpoint",
      parameter: "parameter",
      requestBody: "{request data}",
      statusCode: 200,
      responseBody: "{responseBody}",
    },
  ];
  function findApiCall(id: number) {
    return allApiCallsSelected.find((elem) => elem.id === id);
  }

  const ExpandedApiCall = ({ id }: { id: number }) => {
    let clickedApiCall = findApiCall(id); // find ApiCall by id
    // console.log("ApiCall clicked > ", clickedApiCall);
    return (
      // Expanded ApiCall content goes here
      <div>
        <div>
          <p>Timestamp: {JSON.stringify(clickedApiCall?.timestamp)}</p>
        </div>
        <div>
          <p>Method: {clickedApiCall?.method}</p>
        </div>
        <div>
          <p>Endpoint: {clickedApiCall?.endpoint}</p>
        </div>
        <div>
          <p>Parameter: {clickedApiCall?.parameter}</p>
        </div>
        <div>
          <p>Request body: {clickedApiCall?.requestBody}</p>
        </div>
        <div>
          <p>Status code: {clickedApiCall?.statusCode}</p>
        </div>
        <div>
          <p>Response body: {clickedApiCall?.responseBody}</p>
        </div>
      </div>
    );
  };

  return (
    <DataTable data={allApiCallsSelected} showHeader={false}>
      <DataTable.Column
        header="Name"
        accessor="name"
        className="font-extrabold"
      />
      <DataTable.Expander>
        {({ id }: { id: number }) => <ExpandedApiCall id={id} />}
      </DataTable.Expander>
    </DataTable>
  );
}
