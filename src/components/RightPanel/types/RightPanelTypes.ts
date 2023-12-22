import { ApiCall } from "../../../types/apiCallTypes";

export type Request = {
  path: string;
  method: string;
  parameters: Parameter[];
};

export type Parameter = {
  name: string;
  in: string;
  required: boolean;
  type: string;
  value: any;
};

export type Item = {
  path: string;
  params: Parameter[];
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
  index: number;
};

export type CallSequenceCardProps = {
  sequence: CallSequence;
  toggleFavorite: (sequenceName: string) => Promise<void>;
  selectApiCall: (sequence: CallSequence, apiCall: ApiCall | null) => void;
  toggleDetails: (sequenceName: string) => Promise<void>;
  onEdit: (sequenceName: string) => Promise<void>;
  onRemove: () => Promise<void>;
  initialExpanded?: boolean;
};
