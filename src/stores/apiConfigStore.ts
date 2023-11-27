import { GridApi } from "ag-grid-community";
import { create } from "zustand";

import { ApexConfiguration } from "../components/VisualisationPanel/Chart/apexTypes";

type ApiConfigStore = {
  apexConfig: ApexConfiguration | null;
  setApexConfig: (apiCalls: ApexConfiguration) => void;
  agConfig: GridApi | null;
  setAgConfig: (config: GridApi) => void;
};

const useApiConfigStore = create<ApiConfigStore>((set) => ({
  apexConfig: null,
  setApexConfig: (config) => set({ apexConfig: config }),
  agConfig: null,
  setAgConfig: (config) => set({ agConfig: config }),
}));

export default useApiConfigStore;
