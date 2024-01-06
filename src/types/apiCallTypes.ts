export type ApiCall = {
  url: string;
  operationId: string;
  method: string;
  endpoint: string;
  parameters: ParameterType[];
  date: string;
  response: {
    status: number;
    headers: {
      [key: string]: string;
    };
    date: string;
    data: string[] | string;
    contentType: string;
    size: number;
  };
  duration: number;
  relationships: Relationships;
};

export type ParameterType = {
  type: string;
  name: string;
  value: string;
};

export type Metrics = {
  numCalls: number;
  successfulCalls: number;
  unsuccessfulCalls: number;
  totDuration: number;
  avgDuration: number;
  totSize: number;
  avgSize: number;
};

export type RelationshipType = "start" | "end" | "mid";

type Relationships = {
  responseEquality?: RelationshipType[];
  responseInequality?: RelationshipType[];
  stateMutation?: RelationshipType[];
  stateIdentity?: RelationshipType[];
  fuzz?: RelationshipType[];
};

export type RelationshipMapping = {
  responseEquality?: Record<number, RelationshipType[]>;
  responseInequality?: Record<number, RelationshipType[]>;
  stateMutation?: Record<number, RelationshipType[]>;
  stateIdentity?: Record<number, RelationshipType[]>;
  fuzz?: Record<number, RelationshipType[]>;
};
