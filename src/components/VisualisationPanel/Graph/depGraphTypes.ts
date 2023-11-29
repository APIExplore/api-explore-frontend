import { Edge, Node } from "reactflow";

export type InitialSchema = {
  initialNodes: Node[];
  initialEdges: Edge[];
};

export type Dependency = {
  [method: string]: {
    operationId: string;
    path: string;
    dependencies: string[];
  };
};
