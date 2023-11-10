import { Tooltip, Typography } from "@tiller-ds/core";
import { DataTable, DescriptionList } from "@tiller-ds/data-display";
import { Icon } from "@tiller-ds/icons";

import useApiCallsStore from "../../stores/apiCallsStore";

export default function Details() {
  const selectedApiCalls = useApiCallsStore((state) => state.selectedApiCalls);
  const fetching = useApiCallsStore((state) => state.fetching);

  const ExpandedApiCall = ({ id }: { id: string }) => {
    const clickedApiCall = selectedApiCalls.find(
      (elem) => elem.operationId === id,
    );
    const tokens = {
      padding: "p-0 border-md",
      Type: { clean: { master: "flex flex-row max-w-full" } },
      Item: {
        type: {
          default: {
            itemColumnContainer: "flex p-2 w-full",
          },
        },
      },
    };

    return (
      // Expanded ApiCall content goes here
      <DescriptionList type="clean" tokens={tokens}>
        <div style={{ overflowWrap: "anywhere" }}>
          <DescriptionList.Item
            label="Timestamp"
            type="default"
            tokens={tokens}
          >
            {clickedApiCall?.date}
          </DescriptionList.Item>
          <DescriptionList.Item label="Method" tokens={tokens}>
            {clickedApiCall?.method.toUpperCase()}
          </DescriptionList.Item>
          <DescriptionList.Item label="URL" tokens={tokens}>
            <span className="text-ellipsis"> {clickedApiCall?.url}</span>
          </DescriptionList.Item>
          <DescriptionList.Item label="Status code" tokens={tokens}>
            {clickedApiCall?.response.status}
          </DescriptionList.Item>
          {clickedApiCall?.parameters &&
            clickedApiCall?.parameters.length > 0 && (
              <DescriptionList.Item
                label="Parameters"
                type="same-column"
                tokens={tokens}
              >
                <DataTable data={clickedApiCall.parameters}>
                  <DataTable.Column id="name" accessor="name" header="Name" />
                  <DataTable.Column accessor="type" header="Type" />
                  <DataTable.Column accessor="value" header="Value" />
                </DataTable>
              </DescriptionList.Item>
            )}
          <DescriptionList.Item label="Response body" tokens={tokens}>
            {(clickedApiCall?.response.data &&
            typeof clickedApiCall.response.data === "string"
              ? clickedApiCall?.response.data
              : Array.isArray(clickedApiCall?.response.data) &&
                clickedApiCall?.response.data.join(", ")) || "-"}
          </DescriptionList.Item>
        </div>
      </DescriptionList>
    );
  };

  return (
    <div className="w-full max-w-full h-full">
      {selectedApiCalls.length > 0 && !fetching ? (
        <DataTable
          data={selectedApiCalls}
          showHeader={false}
          alignHeader="left"
        >
          <DataTable.Column
            header="Operation ID"
            accessor="operationId"
            align="left"
            className="font-extrabold"
          />
          <DataTable.Expander>
            {({ operationId }: { operationId: string }) => (
              <ExpandedApiCall id={operationId} />
            )}
          </DataTable.Expander>
        </DataTable>
      ) : (
        <span className="flex w-full justify-center p-4 group">
          <Typography
            variant="subtext"
            icon={
              <Tooltip label="Click on the API call(s) from the timeline to see their details here">
                <Icon type="info" className="group-hover:text-slate-500" />
              </Tooltip>
            }
          >
            <span className="group-hover:text-slate-800">
              Select an API call to see its details
            </span>
          </Typography>
        </span>
      )}
    </div>
  );
}
