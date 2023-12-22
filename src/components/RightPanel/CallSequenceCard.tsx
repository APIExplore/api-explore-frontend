import React, { useEffect, useState } from "react";

import axios from "axios";
import { saveAs } from "file-saver";

import { useNotificationContext } from "@tiller-ds/alert";
import { Card, IconButton } from "@tiller-ds/core";
import { Icon, LoadingIcon } from "@tiller-ds/icons";

import { SequenceDetails } from "./SequenceDetails";
import { CallSequenceCardProps } from "./types/RightPanelTypes";
import { backendDomain } from "../../constants/apiConstants";
import useRequestsStore, { RequestsStore } from "../../stores/requestsStore";
import { renderRemoveSequenceNotification } from "../../util/notificationUtils";

export default function CallSequenceCard({
  sequence,
  toggleFavorite,
  selectApiCall,
  toggleDetails,
  onEdit,
  onRemove,
  initialExpanded,
}: CallSequenceCardProps) {
  const notification = useNotificationContext();
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(
    initialExpanded as boolean,
  );
  const selectedRequests = useRequestsStore(
    (store: RequestsStore) => store.selectedRequests,
  );

  console.log("FINAL", initialExpanded);

  useEffect(() => {
    console.log("SETTING UP", sequence.name);
    setIsExpanded(false);
  }, [initialExpanded]);

  const exportSequenceToJsonFile = (name) => {
    const jsonDataForExport = JSON.stringify(selectedRequests);
    const blob = new Blob([jsonDataForExport], { type: "application/json" });
    saveAs(blob, `${name}.json`);
  };

  useEffect(() => {
    setLoading(false);
  }, [sequence]);

  const handleEditClick = async () => {
    await onEdit(sequence.name);
    setIsExpanded(false);
    setLoading(false);
  };

  const removeSequence = async () => {
    try {
      // Make an axios.delete API call
      setLoading(true);
      const response = await axios.delete(
        `${backendDomain}/callsequence/delete/${sequence.name}`,
      );
      if (response.data.success) {
        // Successful deletion
        console.log("Sequence removed successfully");
        await onRemove();
        notification.push(renderRemoveSequenceNotification(sequence.name));
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

  console.log(isExpanded);

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
                await handleEditClick();
              }}
              icon={<Icon type="pencil-simple" />}
              label="Edit"
              className={"text-green-600 hover:opacity-100 opacity-60"}
            />
            <IconButton
              onClick={async () => {
                setLoading(true);
                toggleFavorite(sequence.name);
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
              onClick={() => {
                setIsExpanded(!isExpanded);
                if (!isExpanded) {
                  toggleDetails(sequence.name);
                }
              }}
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
        <>
          <Card.Body removeSpacing>
            <SequenceDetails
              sequence={sequence}
              selectApiCall={selectApiCall}
            />
          </Card.Body>
          <Card.Footer>
            <div className="flex justify-between items-center">
              <IconButton
                onClick={async () => {
                  setIsExpanded(false);
                  await removeSequence();
                  setLoading(true);
                }}
                icon={<Icon type="trash" />}
                label="Delete"
                className={"text-red-600 hover:opacity-100 opacity-60"}
              />
              <IconButton
                onClick={() => exportSequenceToJsonFile(sequence.name)}
                icon={
                  <Icon
                    type={"export"}
                    className="text-slate-500 hover:text-slate-700"
                  />
                }
                id="export-to-json"
                label="Export to JSON file"
              />
            </div>
          </Card.Footer>
        </>
      )}
    </Card>
  );
}
