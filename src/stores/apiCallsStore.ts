import axios from "axios";
import { create } from "zustand";

import { LogsStore } from "./logsStore";
import { Request } from "../components/RightPanel/types/RightPanelTypes";
import { backendDomain } from "../constants/apiConstants";
import { ApiCall, Metrics } from "../types/apiCallTypes";

type ApiStore = {
  schemaName: string;
  setSchemaName: (name: string) => void;
  apiCalls: ApiCall[];
  setApiCalls: (callSequence: ApiCall[]) => void;
  selectedApiCalls: ApiCall[];
  setSelectedApiCalls: (apiCalls: ApiCall[]) => void;
  fetching: boolean;
  fetchData: (
    callSequenceName: string,
    selectedRequests: Request[],
    logs: LogsStore,
  ) => Promise<void>;
  callByCallMode: {
    enabled: boolean;
    nextCallIndex: number;
  };
  setCallByCallMode: (enabled?: boolean, nextCallIndex?: number) => void;
  metrics: Metrics | null;
};

const useApiCallsStore = create<ApiStore>((set, get) => ({
  apiCalls: [],
  selectedApiCalls: [],
  schemaName: "",
  callByCallMode: { enabled: false, nextCallIndex: 0 },
  metrics: null,
  setSchemaName: (name: string) => set({ schemaName: name }),
  setApiCalls: (callSequence) => set({ apiCalls: callSequence }),
  setSelectedApiCalls: (apiCalls) => set({ selectedApiCalls: apiCalls }),
  fetching: false,
  fetchData: async (callSequenceName, selectedRequests, logs) => {
    try {
      set({ fetching: true });
      const response = await axios.post(`${backendDomain}/explore/`, {
        callSequence: selectedRequests,
        name: callSequenceName,
        favorite: false,
        callByCall: !get().callByCallMode.enabled
          ? false
          : get().callByCallMode.nextCallIndex !== 0,
      });

      set({ apiCalls: response.data.callSequence });
      set({ selectedApiCalls: [] });
      set({ fetching: false });
      set({ metrics: response.data.metrics });

      if (response.data.warnings) {
        logs.addWarnings(response.data.warnings);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      if (error.response.data) {
        logs.addError(error.response.data);
      }
    }
  },
  setCallByCallMode: (mode, nextCallIndex) =>
    set((state) => ({
      callByCallMode: {
        enabled: mode !== undefined ? mode : state.callByCallMode.enabled,
        nextCallIndex:
          nextCallIndex !== undefined
            ? nextCallIndex
            : state.callByCallMode.nextCallIndex,
      },
    })),
}));

export default useApiCallsStore;
