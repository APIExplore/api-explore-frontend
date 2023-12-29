import React, { useEffect, useState } from "react";

import axios from "axios";
import ReactJson from "react-json-view";

import { Modal, useModal } from "@tiller-ds/alert";
import { Button, ButtonGroups, Tooltip, Typography } from "@tiller-ds/core";
import { Toggle } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import CallSequenceCard from "./CallSequenceCard";
import { CallSequence } from "./types/RightPanelTypes";
import { backendDomain } from "../../constants/apiConstants";
import useCallSequenceCacheStore from "../../stores/callSequenceCacheStore";
import useLogsStore from "../../stores/logsStore";
import useRequestsStore from "../../stores/requestsStore";
import { ApiCall } from "../../types/apiCallTypes";
import ConditionalDisplay from "../ConditionalDisplay";

type CallSequencesProps = {
  fetchingTab: number;
  onEditSequence: (sequenceName: string) => Promise<void>;
  updateCallSequences: (updatedCallSequences: CallSequence[]) => void;
};

export default function CallSequences({
  fetchingTab,
  onEditSequence,
  updateCallSequences,
}: CallSequencesProps) {
  const logs = useLogsStore();
  const {
    fetchedCallSequences,
    setFetchedCallSequences,
    toggleSequenceFavorite,
  } = useCallSequenceCacheStore();
  const { collapseFlag, setCollapseFlag } = useCallSequenceCacheStore();
  const callSequenceName = useRequestsStore((store) => store.callSequenceName);

  const modal = useModal<{ apiCall: ApiCall | null; sequenceName: string }>();

  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSequenceEdit = async (sequenceName: string) => {
    await onEditSequence(sequenceName);
  };

  const fetchCallSequences = async () => {
    try {
      const response = await axios.get(`${backendDomain}/callsequence/fetch`);
      const sequencesFromApi: CallSequence[] = response.data.map(
        (seq: any) => ({
          ...seq,
          details: [],
          expanded: false,
          selectedApiCall: null,
        })
      );

      setFetchedCallSequences(sequencesFromApi);
      updateCallSequences(sequencesFromApi);
      setLoading(false);

      if (response.data.warnings) {
        logs.addWarnings(response.data.warnings);
      }

      return sequencesFromApi;
    } catch (error: any) {
      console.error(
        "Error fetching call sequences:",
        error.response?.data?.error || "Unknown error"
      );
      setLoading(false);

      if (error.response.data) {
        logs.addError(error.response.data);
      }
    }
  };

  useEffect(() => {
    if (fetchingTab === 1) {
      fetchCallSequences();
    }
  }, [fetchingTab]);

  const handleSequenceRemove = async () => {
    await fetchCallSequences();
  };

  const toggleSortOrder = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCollapseFlag(!collapseFlag);
  };

  const sortSequences = (sequences: CallSequence[]) => {
    if (sortOrder === "asc") {
      return sequences.sort((a, b) => a.name?.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      return sequences.sort((a, b) => b.name?.localeCompare(a.name));
    } else {
      return sequences;
    }
  };

  const toggleFavorite = async (sequenceName: string) => {
    await axios.put(
      `${backendDomain}/callsequence/toggle-favorite/${sequenceName}`
    );
    toggleSequenceFavorite(sequenceName);
  };

  const selectApiCall = (sequence: CallSequence, apiCall: ApiCall | null) => {
    modal.onOpen({ apiCall: apiCall, sequenceName: sequence.name });
    setFetchedCallSequences(
      fetchedCallSequences.map((seq) =>
        seq.name === sequence.name ? { ...seq, selectedApiCall: apiCall } : seq
      )
    );
  };

  const showOnlyFavorites = () => {
    setShowFavorites(!showFavorites);
    setCollapseFlag(!collapseFlag);
  };

  const filteredSequences = showFavorites
    ? fetchedCallSequences.filter((sequence) => sequence.favorite)
    : fetchedCallSequences;

  return (
    <div className="p-4">
      <div className="flex flex-col justify-between items-center">
        <Typography variant="h5">Call Sequences</Typography>
        <div className="flex justify-between items-end w-full mt-4">
          <div className="mb-4">
            <Toggle
              label={
                <span className="text-sm leading-5 font-medium text-gray-900">
                  Only favorites
                </span>
              }
              reverse={false}
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
              onClick={() => {
                showOnlyFavorites();
              }}
              tokens={{
                toggle:
                  "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 flex align-center toggle-favorite",
              }}
            />
          </div>
          <div className="mb-2">
            <ButtonGroups>
              <ButtonGroups.Button
                color="secondary"
                onClick={() => toggleSortOrder("asc")}
                id="asc"
                className={sortOrder === "asc" ? "inner-shadow-custom" : ""}
                variant="text"
                size="xs"
              >
                <Tooltip label="Sort by name ascending">
                  <Icon type="sort-ascending" />
                </Tooltip>
              </ButtonGroups.Button>
              <ButtonGroups.Button
                color="secondary"
                id="desc"
                onClick={() => toggleSortOrder("desc")}
                className={sortOrder === "desc" ? "inner-shadow-custom" : ""}
                variant="text"
                size="xs"
              >
                <Tooltip label="Sort by name descending">
                  <Icon type="sort-descending" />
                </Tooltip>
              </ButtonGroups.Button>
            </ButtonGroups>
          </div>
        </div>
      </div>
      <ConditionalDisplay
        componentToDisplay={
          <div className="flex flex-col space-y-3 mt-4">
            {sortSequences(filteredSequences).map((sequence, index) => (
              <CallSequenceCard
                key={index}
                sequence={sequence}
                toggleFavorite={toggleFavorite}
                selectApiCall={selectApiCall}
                onEdit={handleSequenceEdit}
                onRemove={handleSequenceRemove}
                active={sequence.name === callSequenceName}
              />
            ))}
          </div>
        }
        condition={!loading || filteredSequences.length > 0}
        className="flex w-full justify-center"
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
