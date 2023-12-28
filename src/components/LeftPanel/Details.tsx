import React, { useState } from "react";

import { Button, Tooltip, Typography } from "@tiller-ds/core";
import { DataTable, DescriptionList } from "@tiller-ds/data-display";
import { Icon } from "@tiller-ds/icons";
import { Modal, useModal } from "@tiller-ds/alert";

import useApiCallsStore from "../../stores/apiCallsStore";

export default function Details() {
  const selectedApiCalls = useApiCallsStore((state) => state.selectedApiCalls);
  const fetching = useApiCallsStore((state) => state.fetching);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const modal = useModal();

  console.log("Selected API calls > ", selectedApiCalls);

  const ExpandedApiCall = ({ timestamp }: { timestamp: string }) => {
    const clickedApiCall = selectedApiCalls.find(
      (elem) => elem.date === timestamp
    );

    const parseResponse = ({ contentType }: { contentType: string }) => {
      if (contentType?.includes("html")) {
        return "HTML";
      } else if (contentType?.includes("json")) {
        return "JSON";
      } else {
        return contentType;
      }
    };

    const closeModal = () => {
      console.log("zatvaram modal...");
      setIsModalOpened(false);
    };

    const viewDetails = (data: string | string[] | undefined) => {
      console.log("details > ", data);
      setIsModalOpened(true);
      modal.onOpen(data);
    };

    return (
      // Expanded ApiCall content goes here
      <DescriptionList type="clean">
        <div style={{ overflowWrap: "anywhere" }}>
          <DescriptionList.Item label="Timestamp" type="default">
            {clickedApiCall?.date}
          </DescriptionList.Item>
          <DescriptionList.Item label="Method">
            {clickedApiCall?.method.toUpperCase()}
          </DescriptionList.Item>
          <DescriptionList.Item label="URL">
            <span className="text-ellipsis"> {clickedApiCall?.url}</span>
          </DescriptionList.Item>
          <DescriptionList.Item label="Status code">
            {clickedApiCall?.response.status}
          </DescriptionList.Item>
          <DescriptionList.Item label="Duration">
            {clickedApiCall?.duration}
          </DescriptionList.Item>
          <DescriptionList.Item label="Packet size">
            {clickedApiCall?.response.size}
          </DescriptionList.Item>
          {clickedApiCall?.parameters &&
            clickedApiCall?.parameters.length > 0 && (
              <DescriptionList.Item label="Parameters" type="same-column">
                <DataTable data={clickedApiCall.parameters}>
                  <DataTable.Column id="name" accessor="name" header="Name" />
                  <DataTable.Column accessor="type" header="Type" />
                  <DataTable.Column accessor="value" header="Value" />
                </DataTable>
              </DescriptionList.Item>
            )}
          <DescriptionList.Item label="Response body">
            <div className="line-clamp-3">
              {(clickedApiCall?.response.data &&
              typeof clickedApiCall.response.data === "string" ? (
                <div> {clickedApiCall?.response.data} </div>
              ) : (
                // ako je html, pustiti da se expanda
                Array.isArray(clickedApiCall?.response.data) &&
                clickedApiCall?.response.data.join(", ")
              )) || "-"}
            </div>
            {clickedApiCall?.response.contentType.includes("html") && (
              <button
                id="view-details"
                className="text-blue-500 hover:underline mr-2"
                onClick={modal.onOpen}
              >
                View Details
              </button>
            )}
          </DescriptionList.Item>
          {isModalOpened ? (
            <div style={{ height: "1000px", overflowY: "auto" }}>
              <Modal {...modal} isOpen={isModalOpened}>
                <Modal.Content title="Response body">
                  {clickedApiCall?.response.data}
                </Modal.Content>
                <Modal.Footer>
                  <Button
                    id="close-landing-page"
                    variant="filled"
                    onClick={modal.onClose}
                    trailingIcon={<Icon type="stop" />}
                  >
                    Enter
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          ) : null}
          <DescriptionList.Item label="Response type">
            <div>
              {clickedApiCall?.response &&
                parseResponse(clickedApiCall?.response)}
            </div>
          </DescriptionList.Item>
        </div>
      </DescriptionList>
    );
  };

  return (
    <div className="w-full max-w-full h-full px-2">
      <div className="py-4 pl-2">
        <Typography variant="h5">Details</Typography>
      </div>
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
            {({ date }: { date: string }) => (
              <ExpandedApiCall timestamp={date} />
            )}
          </DataTable.Expander>
        </DataTable>
      ) : (
        <span className="flex flex-col space-y-1 w-full justify-center items-center p-4 group">
          <Tooltip label="Click on the API call(s) from the timeline to see their details here">
            <Icon
              type="info"
              className="text-slate-400 group-hover:text-slate-500"
            />
          </Tooltip>
          <Typography variant="subtext" className="cursor-default">
            <span className="group-hover:text-slate-800">
              Select an API call to see its details
            </span>
          </Typography>
        </span>
      )}
    </div>
  );
}
