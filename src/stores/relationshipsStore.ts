import { create } from "zustand";

import { RelationshipMappings } from "../components/VisualisationPanel/RelationshipVisualizer/relationshipsGraphUils";
import { ApiCall } from "../types/apiCallTypes";

type RelationshipsStore = {
  callsToDisplay: ApiCall[];
  setCallsToDisplay: (calls: ApiCall[], displayAll?: boolean) => void;
  displayingAll: boolean;
  setDisplayingAll: (displayAll: boolean) => void;
  currentRelationship: keyof typeof RelationshipMappings | null;
  setCurrentRelationship: (
    relationship: keyof typeof RelationshipMappings | null,
  ) => void;
  mappings: { [K in keyof typeof RelationshipMappings]: ApiCall[][] };
  addMapping: (
    relationship: keyof typeof RelationshipMappings,
    calls: ApiCall[][],
  ) => void;
  clearMappings: () => void;
};

const useRelationshipsStore = create<RelationshipsStore>((set) => ({
  callsToDisplay: [],
  displayingAll: false,
  currentRelationship: null,
  mappings: {
    responseEquality: [],
    responseInequality: [],
    stateMutation: [],
    stateIdentity: [],
    fuzz: [],
  },
  setCallsToDisplay: (calls: ApiCall[], displayAll = false) =>
    set({ callsToDisplay: calls, displayingAll: displayAll }),
  setDisplayingAll: (displayAll: boolean) => set({ displayingAll: displayAll }),
  setCurrentRelationship: (relationship) =>
    set({ currentRelationship: relationship }),
  addMapping: (relationship, calls) =>
    set((state) => ({
      mappings: {
        ...state.mappings,
        [relationship]: calls,
      },
    })),
  clearMappings: () =>
    set({
      mappings: {
        responseEquality: [],
        responseInequality: [],
        stateMutation: [],
        stateIdentity: [],
        fuzz: [],
      },
    }),
}));

export default useRelationshipsStore;
