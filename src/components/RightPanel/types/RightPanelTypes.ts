import { ApiCall } from "../../../types/apiCallTypes";

export type Request = {
  path: string;
  method: string;
  parameters?: Parameter[];
  params?: Parameter[];
};

export type Parameter = {
  name: string;
  in: string;
  required: boolean;
  type: string;
};

export type Item = {
  path: string;
  method: string;
  operationId: string;
};

export type Property = {
  [key: string]: {
    type: string;
    format?: number;
    readOnly?: boolean;
    uniqueItems: boolean;
    items: {
      $ref: string;
    };
  };
};

export type Definition = {
  name: string;
  type: string;
  properties: Property;
};

export type CallSequence = {
  name: string;
  sequenceId: string;
  favorite: boolean;
  details?: ApiCall[];
  expanded?: boolean;
  selectedApiCall?: ApiCall | null;
};
