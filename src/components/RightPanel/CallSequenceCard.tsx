import React, { useEffect, useState } from "react";

import { Card, IconButton, Typography } from "@tiller-ds/core";
import { DescriptionList } from "@tiller-ds/data-display";
import { Icon, LoadingIcon } from "@tiller-ds/icons";

import { CallSequence } from "./types/RightPanelTypes";
import { ApiCall } from "../../types/apiCallTypes";

const DND_ITEM_TYPE = "CALL_SEQUENCE_CARD";

type CallSequenceCardProps = {
  sequence: CallSequence;
  toggleFavorite: (sequenceName: string) => Promise<void>;
  selectApiCall: (sequence: CallSequence, apiCall: ApiCall | null) => void;
  toggleDetails: (sequenceName: string) => Promise<void>;
};

function editSequence() {
  return undefined;
}

export default function CallSequenceCard({
  sequence,
  toggleFavorite,
  selectApiCall,
  toggleDetails,
}: CallSequenceCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // const [{ isDragging }, drag] = useDrag({
  //   type: DND_ITEM_TYPE,
  //   item: { index: sequence.index },
  //   collect: (monitor) => ({
  //     isDragging: !!monitor.isDragging(),
  //   }),
  // });
  //
  // const [, drop] = useDrop({
  //   accept: DND_ITEM_TYPE,
  //   hover: (draggedItem: { index: number }) => {
  //     if (draggedItem.index !== sequence.index) {
  //       if (onDragEnd) {
  //         onDragEnd(draggedItem.index, sequence.index);
  //       }
  //     }
  //   },
  // });

  const handleExpandToggle = () => setIsExpanded(!isExpanded);

  // const removeCallSequence = async (sequenceName) => {
  //   try {
  //     const response = await axios.delete(
  //       `${backendDomain}/callsequence/delete/${sequenceName.trim()}`,
  //     );
  //
  //     if (response.data.success) {
  //       console.log("Call sequence deleted successfully");
  //     } else {
  //       console.error(`Error deleting call sequence: ${response.data.error}`);
  //     }
  //   } catch (error: any) {
  //     console.error(
  //       "An error occurred while deleting call sequence:",
  //       error.message,
  //     );
  //   }
  // };

  return (
    <div
    // ref={(node) => drag(drop(node))}
    // style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card className="p-4">
        <Card.Header removeSpacing>
          <Card.Header.Title>{sequence.name}</Card.Header.Title>
          <Card.Header.Actions>
            <div className="flex space-x-2">
              {/*TODO: Implement tab switch when this button is clicked*/}
              <IconButton
                // onClick={() => function noRefCheck(){}}
                onClick={editSequence()}
                icon={<Icon type="plus" size={2} />}
                label="Modify"
                title="Modify"
                className="text-green-600"
              />
              <IconButton
                onClick={() => toggleFavorite(sequence.name)}
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
                  sequence.favorite
                    ? "Remove from Favorites"
                    : "Add to Favorites"
                }
              />
              <IconButton
                // onClick={() => removeCallSequence(sequence.name)}
                icon={<Icon type="trash" size={2} />}
                label="Remove"
                title="Remove"
                className="text-red-600"
              />
              <IconButton
                onClick={() => setIsExpanded(!isExpanded)}
                icon={
                  <Icon
                    type={isExpanded ? "caret-up" : "caret-down"}
                    size={2}
                  />
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
          </Card.Body>
        )}
      </Card>
    </div>
  );
}

function SequenceDetails({
  sequence,
  selectApiCall,
  toggleDetails,
}: Omit<CallSequenceCardProps, "toggleFavorite">) {
  useEffect(() => {
    toggleDetails(sequence.name);
  }, []);

  return (
    <>
      <div className="mt-2 flex flex-col w-full">
        <Typography className="text-md font-semibold text-center">
          Details / Calls:
        </Typography>
        {sequence.details && sequence.details?.length > 0 ? (
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
                {/* Render API call details */}
                <button
                  id="view-details"
                  className="text-blue-500 hover:underline mr-2"
                  onClick={() => selectApiCall(sequence, apiCall)}
                >
                  View Details
                </button>
                {/* Additional API call details can be added here */}
              </DescriptionList.Item>
            ))}
          </DescriptionList>
        ) : (
          <div className="self-center p-2">
            <LoadingIcon size={4} />
          </div>
        )}
      </div>
    </>
  );
}
