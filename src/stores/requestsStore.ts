import { create } from "zustand";

interface Request {
  path: string;
  method: string;
  parameters: Parameter[];
}

interface Parameter {
  name: string;
  in: string;
  required: boolean;
  type: string;
}

/*
    "path" : "/products/{productName}"
    "method" : "get"
    "parameters" : [ {
        "name" : "productName",
        "in" : "path",
        "required" : true,
        "type" : "string"
    } ]
,
*/

const store = (set: any) => ({
  allRequests: [],
  selectedRequests: [],
  setAllRequests: (items: Request[]) => {
    set((store: any) => ({
      allRequests: [...items],
    }));
  },
  setRequests: (items: Request[]) => {
    set((store: any) => ({
      selectedRequests: [...items],
    }));
  },
});

export const useRequestsStore = create(store);
