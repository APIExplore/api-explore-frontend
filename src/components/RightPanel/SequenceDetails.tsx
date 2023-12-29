import React, { useMemo } from "react";

import { Typography } from "@tiller-ds/core";
import { DescriptionList } from "@tiller-ds/data-display";

import { CallSequence } from "./types/RightPanelTypes";
import useCallSequenceCacheStore from "../../stores/callSequenceCacheStore";
import { ApiCall } from "../../types/apiCallTypes";
import ConditionalDisplay from "../ConditionalDisplay";

type SequenceDetailsProps = {
  sequence: CallSequence;
  selectApiCall: (sequence: CallSequence, apiCall: ApiCall | null) => void;
};

export function SequenceDetails({
  sequence,
  selectApiCall,
}: SequenceDetailsProps) {
  const cachedSequenceDetails = useCallSequenceCacheStore(
    (state) => state.cachedSequenceDetails,
  );
  const { isRefreshing, refreshSequenceName } = useCallSequenceCacheStore(
    (store) => store.refreshStatus,
  );

  const sequenceDetails = useMemo(
    () => cachedSequenceDetails.get(sequence.name),
    [cachedSequenceDetails, sequence.name],
  );

  return (
    <>
      <div className="mt-2 flex flex-col w-full">
        <Typography className="text-md font-semibold text-center">
          Details / Calls:
        </Typography>
        <ConditionalDisplay
          componentToDisplay={
            <DescriptionList type="default">
              {sequenceDetails?.map((apiCall, apiIndex) => (
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
            sequenceDetails !== undefined &&
            sequenceDetails.length > 0 &&
            !(refreshSequenceName === sequence.name && isRefreshing)
          }
          className="self-center p-2"
        />
      </div>
    </>
  );
}
