import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

import {
  applyNodeChanges,
  Background,
  Controls,
  DefaultEdgeOptions,
  MarkerType,
  Node,
  NodeTypes,
  OnNodesChange,
  ReactFlow,
} from "reactflow";

import CustomNode from "./CustomNode";
import { InitialSchema } from "./depGraphTypes";
import {
  generateDiagramSchema,
  generateInitialDependencies,
  generateSequenceDependencies,
} from "./depGraphUtils";
import useRequestsStore, { RequestsStore } from "../../../stores/requestsStore";
import "reactflow/dist/base.css";
import { Request } from "../../RightPanel/types/RightPanelTypes";

function DependencyGraph() {
  const definitions = useRequestsStore(
    (store: RequestsStore) => store.definitions,
  );
  const requests = useRequestsStore(
    (store: RequestsStore) => store.allRequests,
  );
  const selectedRequests: Request[] = useRequestsStore(
    (store) => store.selectedRequests,
  );
  const dependencies = useMemo(
    () =>
      selectedRequests.length > 0
        ? generateSequenceDependencies(selectedRequests)
        : generateInitialDependencies(requests, definitions),
    [definitions, requests, selectedRequests],
  );

  const diagramSchema = generateDiagramSchema(dependencies);
  return (
    <div className="flex w-full h-full">
      {diagramSchema.initialNodes.length > 0 && (
        <ReactFlowGraph initialSchema={diagramSchema} />
      )}
    </div>
  );
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  className: "border-2 border-gray-900",
  updatable: false,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    height: 50,
    strokeWidth: 20,
  },
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function ReactFlowGraph({ initialSchema }: { initialSchema: InitialSchema }) {
  const [nodes, setNodes] = useState<Node[]>(initialSchema.initialNodes);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes],
  );

  useEffect(() => {
    setNodes(initialSchema.initialNodes);
  }, [initialSchema]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={initialSchema.initialEdges}
      onNodesChange={onNodesChange}
      nodesConnectable={false}
      defaultEdgeOptions={defaultEdgeOptions}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default memo(DependencyGraph);
