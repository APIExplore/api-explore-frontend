import axios from "axios";
import { create } from "zustand";

import { CallSequence } from "../components/RightPanel/types/RightPanelTypes";
import { backendDomain } from "../constants/apiConstants";
import { ApiCall } from "../types/apiCallTypes";

type SequenceDetailsCache = {
  sequenceName: string;
  details: ApiCall[];
};

type CallSequenceCacheStore = {
  fetchedCallSequences: CallSequence[];
  refreshSequenceDetailsCache: (
    sequenceName: string,
    callSequences?: CallSequence[],
  ) => void;
  fetchSequenceDetails: (sequenceName: string) => Promise<ApiCall[]>;
  toggleSequenceFavorite: (sequenceName: string) => void;
  setFetchedCallSequences: (sequences: CallSequence[]) => void;
  retrieveSequenceDetails: (sequenceName: string) => Promise<ApiCall[]>;
  cachedSequenceDetails: Set<SequenceDetailsCache>;
  collapseFlag: boolean;
  setCollapseFlag: (flag: boolean) => void;
};

const useCallSequenceCacheStore = create<CallSequenceCacheStore>(
  (set, get) => ({
    fetchedCallSequences: [],
    cachedSequenceDetails: new Set(),
    toggleSequenceFavorite: (sequenceName) =>
      set((state) => ({
        fetchedCallSequences: state.fetchedCallSequences.map((sequence) =>
          sequence.name === sequenceName
            ? {
                ...sequence,
                favorite: !sequence.favorite,
              }
            : sequence,
        ),
      })),
    refreshSequenceDetailsCache: (sequenceName, callSequences) => {
      const finalCallSequences = callSequences
        ? callSequences
        : get().fetchedCallSequences;
      set({
        fetchedCallSequences: finalCallSequences.map((sequence) =>
          sequence.name === sequenceName
            ? {
                ...sequence,
                details: [],
              }
            : sequence,
        ),
      });
      get().fetchSequenceDetails(sequenceName);
    },
    fetchSequenceDetails: async (sequenceName) => {
      const sequence = get().fetchedCallSequences.find(
        (seq: { name: string }) => seq.name === sequenceName,
      );

      if (sequence && !sequence.details?.length) {
        try {
          const response = await axios.get(
            `${backendDomain}/callsequence/fetch/${sequenceName}`,
          );
          const details = response.data;
          set((state) => {
            const newDetails = { sequenceName, details };
            const updatedCache = new Set(state.cachedSequenceDetails);

            const existingDetail = Array.from(updatedCache).find(
              (entry) => entry.sequenceName === sequenceName,
            );

            if (existingDetail) {
              updatedCache.delete(existingDetail);
            }

            updatedCache.add(newDetails);

            return { cachedSequenceDetails: updatedCache };
          });
          return details;
        } catch (error: any) {
          console.error(
            "Error fetching call sequence details:",
            error.response?.data?.error || "Unknown error",
          );
        }
      }
    },
    setFetchedCallSequences: (sequences) =>
      set((state) => ({
        fetchedCallSequences: sequences.map((newSequence) => {
          const existingSequence = state.fetchedCallSequences.find(
            (seq) => seq.name === newSequence.name,
          );

          return existingSequence
            ? {
                ...existingSequence,
                details: existingSequence.details || [],
                favorite: existingSequence.favorite,
              }
            : newSequence;
        }),
      })),
    retrieveSequenceDetails: async (sequenceName) => {
      const cachedSequence = get().cachedSequenceDetails[sequenceName];

      if (cachedSequence) {
        return cachedSequence.details;
      } else {
        return await get().fetchSequenceDetails(sequenceName);
      }
    },
    collapseFlag: false,
    setCollapseFlag: (flag) => set({ collapseFlag: flag }),
  }),
);

export default useCallSequenceCacheStore;
