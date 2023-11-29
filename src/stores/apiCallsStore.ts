import axios from "axios";
import { create } from "zustand";

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
  ) => Promise<void>;
};

const useApiCallsStore = create<ApiStore>((set) => ({
  apiCalls: [],
  setApiCalls: (callSequence) => set({ apiCalls: callSequence }),
  selectedApiCalls: [],
  setSelectedApiCalls: (apiCalls) => set({ selectedApiCalls: apiCalls }),
  fetching: false,
  fetchData: async (callSequenceName, selectedRequests) => {
    try {
      set({ fetching: true });
      const data = await axios.post(`${backendDomain}/explore/random`, {
        callSequence: selectedRequests,
        name: callSequenceName,
      });

      set({ apiCalls: data.data.callSequence });
      set({ selectedApiCalls: [] });
      set({ fetching: false });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}));

export default useApiCallsStore;
