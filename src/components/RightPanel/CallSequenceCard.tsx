import React, { useEffect, useState } from "react";

import axios from "axios";
import { saveAs } from "file-saver";

import { Card, IconButton } from "@tiller-ds/core";
import { Icon, LoadingIcon } from "@tiller-ds/icons";

import { SequenceDetails } from "./SequenceDetails";
import { CallSequenceCardProps } from "./types/RightPanelTypes";
import { backendDomain } from "../../constants/apiConstants";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";

export default function CallSequenceCard({
  sequence,
  toggleFavorite,
  selectApiCall,
  toggleDetails,
  onEdit,
  onRemove,
}: CallSequenceCardProps) {
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const selectedRequests = useRequestsStore(
    (store: RequestsStore) => store.selectedRequests,
  );

  const exportSequenceToJsonFile = (name) => {
    // TODO: Export sequence details as json
    const jsonDataForExport = JSON.stringify(selectedRequests);
    const blob = new Blob([jsonDataForExport], { type: "application/json" });
    saveAs(blob, `${name}.json`);
  };

  const handleAddClick = async () => {
    await onEdit(sequence.name);
    setLoading(false);
  };

  const removeSequence = async () => {
    try {
      // Make an axios.delete API call
      const response = await axios.delete(
        `${backendDomain}/callsequence/delete/${sequence.name}`,
      );

      if (response.data.success) {
        // Successful deletion
        console.log("Sequence removed successfully");
        onRemove();
      } else {
        // Handle error
        console.error(response.data.error);
      }
    } catch (error: any) {
      // Handle network error
      console.error("Network error:", error.message);
    } finally {
      setLoading(false);
    }
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
              onClick={async () => {
                setLoading(true);
                await handleAddClick();
              }}
              icon={<Icon type="plus" />}
              label="Edit"
              className={"text-green-600 hover:opacity-100 opacity-60"}
            />
            <IconButton
              onClick={async () => {
                setLoading(true);
                await removeSequence();
              }}
              icon={<Icon type="trash" />}
              label="Delete"
              className={"text-red-600 hover:opacity-100 opacity-60"}
            />
            <IconButton
              onClick={async () => {
                setLoading(true);
                await toggleFavorite(sequence.name);
              }}
              className={`text-yellow-500 ${
                sequence.favorite
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-100"
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
              // className={"text-black hover:opacity-100 opacity-60"}
              id="expand-sequence"
              label="Expand details"
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
            onEdit={handleAddClick}
            onRemove={onRemove}
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
