import { create } from "zustand";

import {
  Definition,
  Item,
  Request,
} from "../components/RightPanel/types/RightPanelTypes";

export type RequestsStore = {
  allRequests: Request[];
  allShownItems: Item[];
  selectedRequests: Request[];
  callSequenceName: string;
  definitions: Definition[];
  setAllRequests: (items: Request[]) => void;
  setSelectedRequests: (items: Request[]) => void;
  setDefinitions: (items: Definition[]) => void;
  setAllShownItems: (items: Item[]) => void;
  setCallSequenceName: (name: string) => void;
};

const useRequestsStore = create<RequestsStore>((set) => ({
  allRequests: [],
  allShownItems: [],
  selectedRequests: [],
  callSequenceName: "",
  definitions: [],
  setAllRequests: (items: Request[]) => {
    set(() => ({
      allRequests: [...items],
    }));
  },
  setAllShownItems: (items: Item[]) => {
    set(() => ({
      allShownItems: [...items],
    }));
  },
  setSelectedRequests: (items: Request[]) => {
    set(() => ({
      selectedRequests: [...items],
    }));
  },
  setDefinitions: (items: Definition[]) => {
    set(() => ({
      definitions: [...items],
    }));
  },
  setCallSequenceName: (name: string) => {
    set(() => ({
      callSequenceName: name,
    }));
  },
}));

export default useRequestsStore;
