import { create } from "zustand";
import { Request } from "../components/RightPanel/types/RightPanelTypes";

const store = (set: any) => ({
  allRequests: [],
  selectedRequests: [],
  setAllRequests: (items: Request[]) => {
    set((store: any) => ({
      allRequests: [...items],
    }));
  },
  setSelectedRequests: (items: Request[]) => {
    set((store: any) => ({
      selectedRequests: [...items],
    }));
  },
});

export const useRequestsStore = create(store);
