import axios from "axios";
import { create } from "zustand";

import { LogsStore } from "./logsStore";
import { Request } from "../components/RightPanel/types/RightPanelTypes";
import { backendDomain } from "../constants/apiConstants";
import { ApiCall } from "../types/apiCallTypes";

type ApiStore = {
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
};

const useApiCallsStore = create<ApiStore>((set) => ({
  apiCalls: [],
  setApiCalls: (callSequence) => set({ apiCalls: callSequence }),
  selectedApiCalls: [],
  setSelectedApiCalls: (apiCalls) => set({ selectedApiCalls: apiCalls }),
  fetching: false,
  fetchData: async (callSequenceName, selectedRequests, logs) => {
    try {
      set({ fetching: true });
      const response = await axios.post(`${backendDomain}/explore/random`, {
        callSequence: selectedRequests,
        name: callSequenceName,
        favorite: false,
      });

      set({ apiCalls: response.data.callSequence });
      set({ selectedApiCalls: [] });
      set({ fetching: false });

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
}));

export default useApiCallsStore;
