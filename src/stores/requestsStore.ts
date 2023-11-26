import { create } from "zustand";

import { Item, Request } from "../components/RightPanel/types/RightPanelTypes";

const store = (set: any) => ({
  allRequests: [],
  selectedRequests: [],
  setAllRequests: (items: Request[]) => {
    set(() => ({
      allRequests: [...items],
    }));
  },
  setSelectedRequests: (items: Request[]) => {
    set(() => ({
      selectedRequests: [...items],
    }));
  },
  allShownItems: [],
  setAllShownItems: (items: Item[]) => {
    set(() => ({
      allShownItems: [...items],
    }));
  },
});

export const useRequestsStore = create(store);
