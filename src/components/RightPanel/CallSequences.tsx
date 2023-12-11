import React, { useEffect, useState } from "react";

import axios from "axios";
import ReactJson from "react-json-view";

import { Modal, useModal } from "@tiller-ds/alert";
import { Button, Typography } from "@tiller-ds/core";
import { Toggle } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import CallSequenceCard from "./CallSequenceCard";
import { CallSequence } from "./types/RightPanelTypes";
import { backendDomain } from "../../constants/apiConstants";
import useApiCallsStore from "../../stores/apiCallsStore";
import useLogsStore from "../../stores/logsStore";
import { ApiCall } from "../../types/apiCallTypes";
import ConditionalDisplay from "../ConditionalDisplay";

export default function CallSequences({
  fetchingTab,
}: {
  fetchingTab: number;
}) {
  const logs = useLogsStore();
  const apiCalls = useApiCallsStore((state) => state.apiCalls);

  const modal = useModal<{ apiCall: ApiCall | null; sequenceName: string }>();
  const [callSequences, setCallSequences] = useState<CallSequence[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCallSequences = async () => {
    try {
      const response = await axios.get(`${backendDomain}/callsequence/fetch`);
      const sequencesFromApi: CallSequence[] = response.data.map(
        (seq: any) => ({
          ...seq,
          details: [],
          expanded: false,
          selectedApiCall: null,
        }),
      );

      setCallSequences(sequencesFromApi);
      setLoading(false);

      if (response.data.warnings) {
        logs.addWarnings(response.data.warnings);
      }

      return sequencesFromApi;
    } catch (error: any) {
      console.error(
        "Error fetching call sequences:",
        error.response?.data?.error || "Unknown error",
      );
      setLoading(false);

      if (error.response.data) {
        logs.addError(error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchCallSequences();
  }, [apiCalls, fetchingTab]);

  const toggleFavorite = async (sequenceName: string) => {
    await axios.put(
      `${backendDomain}/callsequence/toggle-favorite/${sequenceName}`,
    );
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
      <ConditionalDisplay
        componentToDisplay={
          <div className="space-y-4">
            {filteredSequences.map((sequence, index) => (
              <CallSequenceCard
                key={index}
                sequence={sequence}
                toggleFavorite={toggleFavorite}
                selectApiCall={selectApiCall}
                toggleDetails={toggleDetails}
              />
            ))}
          </div>
        }
        condition={!loading || filteredSequences.length > 0}
      />
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
            <ConditionalDisplay
              componentToDisplay={
                <ReactJson
                  src={modal.state?.apiCall as ApiCall}
                  name={false}
                  collapsed={1}
                  style={{ backgroundColor: "#FFFF" }}
                />
              }
              condition={modal.state !== null}
            />
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
  );
}
