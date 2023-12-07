import React, { useEffect, useState } from "react";

import { useDrag, useDrop } from "react-dnd";

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
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onDragEnd?: (draggedIndex: number, hoveredIndex: number) => void;
};

export default function CallSequenceCard({
  sequence,
  toggleFavorite,
  selectApiCall,
  toggleDetails,
  onDragEnd,
  onMoveDown,
  onMoveUp,
}: CallSequenceCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleMoveUp = () => {
    if (onMoveUp) {
      onMoveUp(sequence.index);
    }
  };

  const handleMoveDown = () => {
    if (onMoveDown) {
      onMoveDown(sequence.index);
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: DND_ITEM_TYPE,
    item: { index: sequence.index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== sequence.index) {
        if (onDragEnd) {
          onDragEnd(draggedItem.index, sequence.index);
        }
      }
    },
  });

  const handleExpandToggle = () => setIsExpanded(!isExpanded);

  const removeCallSequence = () => {
    console.log("Delete sequence");
    //target endpoint for removing a sequence
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card className="p-4">
        <Card.Header removeSpacing>
          <Card.Header.Title>{sequence.name}</Card.Header.Title>
          <Card.Header.Actions>
            <div className="flex space-x-2">
              {/*TODO: Implement tab switch when this button is clicked*/}
              {/*<IconButton*/}
              {/*  onClick={() => function noRefCheck(){}}*/}
              {/*  icon={<Icon type="plus" size={2} />}*/}
              {/*  label="Modify"*/}
              {/*  title="Modify"*/}
              {/*/>*/}
              {/*TODO: Check why moving up/down does not work*/}
              <IconButton
                onClick={() => onMoveUp}
                icon={<Icon type="arrow-up" size={2} />}
                label="Move Up"
                title="Move Up"
              />
              <IconButton
                onClick={() => onMoveDown}
                icon={<Icon type="arrow-down" size={2} />}
                label="Move Down"
                title="Move Down"
              />
              <IconButton
                onMouseDown={(e) => e.preventDefault()} // Prevents text selection during drag
                icon={<Icon type="hand-grabbing" size={2} />} // Adjust the icon type and size accordingly
                label="Drag to reorder"
                title="Drag to reorder"
                onPointerDown={() => console.log("Start dragging")} // You can add your custom drag start logic here
                onPointerUp={() => console.log("Stop dragging")} // You can add your custom drag end logic here
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
                onClick={() => removeCallSequence}
                icon={<Icon type="trash" size={2} />}
                label="Remove"
                title="Remove"
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
