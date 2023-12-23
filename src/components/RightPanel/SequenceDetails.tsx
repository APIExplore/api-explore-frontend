import React from "react";

import { Typography } from "@tiller-ds/core";
import { DescriptionList } from "@tiller-ds/data-display";

import { CallSequence } from "./types/RightPanelTypes";
import { ApiCall } from "../../types/apiCallTypes";
import ConditionalDisplay from "../ConditionalDisplay";

export function SequenceDetails({
  sequence,
  selectApiCall,
}: {
  sequence: CallSequence;
  selectApiCall: (sequence: CallSequence, apiCall: ApiCall | null) => void;
}) {
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
