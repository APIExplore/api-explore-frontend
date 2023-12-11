import React, { useEffect, useState } from "react";

import { saveAs } from "file-saver";

import { Card, IconButton, Typography } from "@tiller-ds/core";
import { DescriptionList } from "@tiller-ds/data-display";
import { Icon, LoadingIcon } from "@tiller-ds/icons";

import { CallSequence } from "./types/RightPanelTypes";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";
import { ApiCall } from "../../types/apiCallTypes";
import ConditionalDisplay from "../ConditionalDisplay";

type CallSequenceCardProps = {
  sequence: CallSequence;
  toggleFavorite: (sequenceName: string) => Promise<void>;
  selectApiCall: (sequence: CallSequence, apiCall: ApiCall | null) => void;
  toggleDetails: (sequenceName: string) => Promise<void>;
};

export default function CallSequenceCard({
  sequence,
  toggleFavorite,
  selectApiCall,
  toggleDetails,
}: CallSequenceCardProps) {
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const selectedRequests = useRequestsStore(
    (store: RequestsStore) => store.selectedRequests,
  );

  const exportSequenceToJsonFile = (name) => {
    const jsonDataForExport = JSON.stringify(selectedRequests);
    const blob = new Blob([jsonDataForExport], { type: "application/json" });
    saveAs(blob, `${name}.json`);
  };

  useEffect(() => {
    setLoading(false);
  }, [sequence]);

  return (
    <Card className="p-4">
      <Card.Header removeSpacing>
        <Card.Header.Title>{sequence.name}</Card.Header.Title>
        <Card.Header.Actions>
          <div className="flex space-x-2 ">
            {loading && (
              <span className="pt-1 text-slate-500">
                <LoadingIcon size={3} />
              </span>
            )}
            <IconButton
              onClick={() => {
                setLoading(true);
                toggleFavorite(sequence.name);
              }}
              className={`text-yellow-500 ${
                sequence.favorite ? "opacity-100" : "opacity-50"
              } favourite-button`}
              icon={
                <Icon
                  type="star"
                  variant={sequence.favorite ? "fill" : "thin"}
                />
              }
              label={
                sequence.favorite ? "Remove from Favorites" : "Add to Favorites"
              }
            />
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              icon={
                <Icon type={isExpanded ? "caret-up" : "caret-down"} size={2} />
              }
              id="expand-sequence"
              label="Toggle Favorite"
            />
          </div>
        </Card.Header.Actions>
      </Card.Header>
      {isExpanded && (
        <Card.Body removeSpacing>
          <SequenceDetails
            sequence={sequence}
            selectApiCall={selectApiCall}
            toggleDetails={toggleDetails}
          />
          <IconButton
            onClick={() => exportSequenceToJsonFile(sequence.name)}
            icon={<Icon type={"export"} />}
            id="export-to-json"
            label="Export to JSON file"
            className="float-right"
          />
        </Card.Body>
      )}
    </Card>
  );
}

function SequenceDetails({
  sequence,
  selectApiCall,
  toggleDetails,
}: Omit<CallSequenceCardProps, "toggleFavorite">) {
  useEffect(() => {
    toggleDetails(sequence.name);
  }, [sequence]);

  return (
    <>
      <div className="mt-2 flex flex-col w-full">
        <Typography className="text-md font-semibold text-center">
          Details / Calls:
        </Typography>
        <ConditionalDisplay
          componentToDisplay={
            <DescriptionList type="default">
              {sequence.details?.map((apiCall, apiIndex) => (
                <DescriptionList.Item
                  key={apiIndex}
                  label={
                    <span className="break-all line-clamp-1">
                      {apiCall.operationId}
                    </span>
                  }
                  type="same-column"
                >
                  <button
                    id="view-details"
                    className="text-blue-500 hover:underline mr-2"
                    onClick={() => selectApiCall(sequence, apiCall)}
                  >
                    View Details
                  </button>
                </DescriptionList.Item>
              ))}
            </DescriptionList>
          }
          condition={
            sequence.details !== undefined && sequence.details.length > 0
          }
          className="self-center p-2"
        />
      </div>
    </>
  );
}
