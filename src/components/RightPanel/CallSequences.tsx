import React, { useEffect, useState } from "react";

import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactJson from "react-json-view";

import { Modal, useModal } from "@tiller-ds/alert";
import { Button, Typography } from "@tiller-ds/core";
import { Toggle } from "@tiller-ds/form-elements";
import { Icon, LoadingIcon } from "@tiller-ds/icons";

import CallSequenceCard from "./CallSequenceCard";
import { CallSequence } from "./types/RightPanelTypes";
import { backendDomain } from "../../constants/apiConstants";
import useApiCallsStore from "../../stores/apiCallsStore";
import { ApiCall } from "../../types/apiCallTypes";

export default function CallSequences() {
  const apiCalls = useApiCallsStore((state) => state.apiCalls);
  const modal = useModal<{ apiCall: ApiCall | null; sequenceName: string }>();
  const [callSequences, setCallSequences] = useState<CallSequence[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCallSequences() {
      try {
        const response = await axios.get(`${backendDomain}/callsequence/fetch`);
        const sequencesFromApi: CallSequence[] = response.data.map(
          (seq: any) => ({
            ...seq,
            favorite: false,
            details: [],
            expanded: false,
            selectedApiCall: null,
          }),
        );

        setCallSequences(sequencesFromApi);
        setLoading(false);
      } catch (error: any) {
        console.error(
          "Error fetching call sequences:",
          error.response?.data?.error || "Unknown error",
        );
        setLoading(false);
      }
    }

    fetchCallSequences();
  }, [apiCalls]);

  const onMoveUp = (index: number) => {
    if (index > 0) {
      setCallSequences((prevSequences) => {
        const newSequences = [...prevSequences];
        const temp = newSequences[index];
        newSequences[index] = newSequences[index - 1];
        newSequences[index - 1] = temp;
        return newSequences;
      });
    }
  };

  const onMoveDown = (index: number) => {
    if (index < callSequences.length - 1) {
      setCallSequences((prevSequences) => {
        const newSequences = [...prevSequences];
        const temp = newSequences[index];
        newSequences[index] = newSequences[index + 1];
        newSequences[index + 1] = temp;
        return newSequences;
      });
    }
  };

  const handleDragEnd = (draggedIndex, hoveredIndex) => {
    setCallSequences((prevSequences) => {
      const newSequences = [...prevSequences];
      const [draggedItem] = newSequences.splice(draggedIndex, 1);
      newSequences.splice(hoveredIndex, 0, draggedItem);
      return newSequences;
    });
  };

  const toggleFavorite = async (sequenceName: string) => {
    setCallSequences((prevSequences) =>
      prevSequences.map((seq) =>
        seq.name === sequenceName ? { ...seq, favorite: !seq.favorite } : seq,
      ),
    );
  };

  const toggleDetails = async (sequenceName: string) => {
    const sequence = callSequences.find((seq) => seq.name === sequenceName);

    if (sequence && !sequence.details?.length) {
      try {
        const response = await axios.get(
          `${backendDomain}/callsequence/fetch/${sequenceName}`,
        );
        const details = response.data;
        setCallSequences((prevSequences) =>
          prevSequences.map((seq) =>
            seq.name === sequenceName ? { ...seq, details } : seq,
          ),
        );
      } catch (error: any) {
        console.error(
          "Error fetching call sequence details:",
          error.response?.data?.error || "Unknown error",
        );
      }
    }

    setCallSequences((prevSequences) =>
      prevSequences.map((seq) =>
        seq.name === sequenceName
          ? { ...seq, expanded: !seq.expanded, selectedApiCall: null }
          : seq,
      ),
    );
  };

  const selectApiCall = (sequence: CallSequence, apiCall: ApiCall | null) => {
    modal.onOpen({ apiCall: apiCall, sequenceName: sequence.name });
    setCallSequences((prevSequences) =>
      prevSequences.map((seq) =>
        seq.name === sequence.name ? { ...seq, selectedApiCall: apiCall } : seq,
      ),
    );
  };

  const showOnlyFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const filteredSequences = showFavorites
    ? callSequences.filter((sequence) => sequence.favorite)
    : callSequences;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <div className="flex justify-between">
          <Typography variant="h5">Call Sequences</Typography>
          <div className="mb-4">
            <Toggle
              label={
                <span className="text-sm leading-5 font-medium text-gray-900">
                  Only favorites
                </span>
              }
              reverse={true}
              checkedIcon={
                <div className="flex ml-3">
                  <Icon
                    type="star"
                    variant="fill"
                    className="text-yellow-500"
                    fill="yellow"
                    size={3}
                    style={{ paddingLeft: "0.5px" }}
                  />
                </div>
              }
              uncheckedIcon={<Icon type="star" />}
              checked={showFavorites}
              onClick={showOnlyFavorites}
              tokens={{
                toggle:
                  "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 flex align-center toggle-favorite",
              }}
            />
          </div>
        </div>
        {loading ? (
          <LoadingIcon size={6} />
        ) : (
          <div className="space-y-4">
            {filteredSequences.map((sequence, index) => (
              <CallSequenceCard
                key={index}
                sequence={sequence}
                toggleFavorite={toggleFavorite}
                selectApiCall={selectApiCall}
                toggleDetails={toggleDetails}
                onDragEnd={handleDragEnd}
                onMoveDown={onMoveDown}
                onMoveUp={onMoveUp}
              />
            ))}
          </div>
        )}
        <Modal
          {...modal}
          icon={
            <Modal.Icon
              icon={<Icon type="info" variant="bold" />}
              className="text-white bg-info"
            />
          }
        >
          <Modal.Content title={`Details - ${modal.state?.sequenceName}`}>
            <Typography variant="subtitle">
              {modal.state?.apiCall?.operationId}
            </Typography>
            <div
              style={{ height: "700px", overflowY: "auto" }}
              className="scrollbar pt-4"
            >
              {modal.state ? (
                <ReactJson
                  src={modal.state.apiCall as ApiCall}
                  name={false}
                  collapsed={1}
                  style={{ backgroundColor: "#FFFF" }}
                />
              ) : (
                <LoadingIcon size={6} />
              )}
            </div>
          </Modal.Content>

          <Modal.Footer>
            <Button
              id="close-details-modal"
              variant="text"
              color="white"
              onClick={modal.onClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DndProvider>
  );
}
