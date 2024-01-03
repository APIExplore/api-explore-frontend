import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

import _ from "lodash";
import {
  applyNodeChanges,
  Background,
  Controls,
  Node,
  OnNodesChange,
  ReactFlow,
} from "reactflow";
import "reactflow/dist/base.css";

import { Alert } from "@tiller-ds/alert";
import { Badge, Typography } from "@tiller-ds/core";
import { Toggle } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import CustomRelationshipNode from "./CustomRelationshipNode";
import Relationship from "./Relationship";
import {
  generateDiagramSchema,
  getRelationships,
  RelationshipMappings,
} from "./relationshipsGraphUils";
import useApiCallsStore from "../../../stores/apiCallsStore";
import useRelationshipsStore from "../../../stores/relationshipsStore";
import { ApiCall } from "../../../types/apiCallTypes";
import { InitialSchema } from "../DependencyGraph/depGraphTypes";

function RelationshipVisualizer() {
  const apiCalls = useApiCallsStore((store) => store.apiCalls);
  const {
    callsToDisplay,
    setCallsToDisplay,
    setCurrentRelationship,
    mappings,
    currentRelationship,
  } = useRelationshipsStore();
  const displayingAll = useRelationshipsStore((store) => store.displayingAll);

  const relationships = getRelationships(apiCalls);

  const filteredMappings = Object.keys(mappings)
    .filter((key) => key === currentRelationship)
    .reduce(
      (obj, key) => {
        obj[key] = mappings[key].filter((mapping: ApiCall[]) =>
          _.isEqual(mapping, callsToDisplay),
        );
        return obj;
      },
      {} as { [K in keyof typeof RelationshipMappings]: ApiCall[][] },
    );
  const diagramSchema = generateDiagramSchema(
    currentRelationship ? filteredMappings : mappings,
  );

  return (
    <div className="flex w-full h-full pt-1.5">
      {apiCalls.length ? (
        <>
          <div className="flex flex-col justify-between w-1/3 h-full bg-white border-r-2">
            <div className="p-4">
              <Typography variant="h5">Detected relationships</Typography>
            </div>
            <div className="flex flex-col space-y-2 h-full overflow-y-auto scrollbar px-4 pb-4">
              {Object.keys(relationships).map((relationship, index) => {
                const filteredCalls = apiCalls.filter(
                  (call) =>
                    call.relationships &&
                    Object.keys(relationships).includes(relationship),
                );
                return (
                  <Relationship
                    relationshipType={relationship}
                    calls={filteredCalls}
                    key={index}
                  />
                );
              })}
            </div>
            <div className="sticky w-full h-12 border-t-2 shadow-inner flex justify-end items-center">
              <Toggle
                label={
                  <span className="text-sm leading-5 font-medium">
                    All relationships
                  </span>
                }
                reverse={true}
                disabled={displayingAll}
                checked={displayingAll}
                onClick={() => {
                  if (!displayingAll) {
                    setCallsToDisplay(apiCalls, true);
                    setCurrentRelationship(null);
                  }
                }}
                tokens={{ container: "mt-1", disabled: "opacity-50" }}
                className="mr-2"
              />
            </div>
          </div>
          <div className="flex w-2/3">
            <ReactFlowRelationshipGraph initialSchema={diagramSchema} />
          </div>
        </>
      ) : (
        <div className="absolute top-0 flex justify-center items-center w-full h-full pr-12 z-30">
          <Alert
            icon={<Icon className="text-info text-2xl" type="swap" />}
            title="No relationships"
            variant="info"
            className="text-info-dark drop-shadow-md"
          >
            Run the simulation to see the derived <br /> relationships from
            executed calls
          </Alert>
        </div>
      )}
    </div>
  );
}

function ReactFlowRelationshipGraph({
  initialSchema,
}: {
  initialSchema: InitialSchema;
}) {
  const [nodes, setNodes] = useState<Node[]>(initialSchema.initialNodes);

  const currentRelationship = useRelationshipsStore(
    (store) => store.currentRelationship,
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes],
  );

  const nodeTypes = useMemo(
    () => ({
      custom: CustomRelationshipNode,
    }),
    [],
  );

  useEffect(() => {
    setNodes(initialSchema.initialNodes);
  }, [initialSchema]);

  return (
    <div className="relative flex w-full">
      {currentRelationship && (
        <RelationshipInfo relationshipName={currentRelationship} />
      )}
      <ReactFlow
        nodes={nodes}
        edges={initialSchema.initialEdges}
        onNodesChange={onNodesChange}
        nodesConnectable={false}
        nodeTypes={nodeTypes}
        minZoom={0.1}
        fitView
        className="h-full w-full"
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

function RelationshipInfo({
  relationshipName,
}: {
  relationshipName: keyof typeof RelationshipMappings;
}) {
  return (
    <div className="absolute top-4 left-4 z-50 shadow-md bg-white rounded-md overflow-hidden">
      <div className="group w-full p-4 transition-all duration-300 hover:bg-gray-100">
        <Typography className="mb-2">Active: </Typography>
        <Typography variant="subtext" className="mb-2">
          <Badge dot>{RelationshipMappings[relationshipName]}</Badge>
        </Typography>
        <div className="hidden group-hover:flex">
          <Typography variant="subtext">
            {getRelationshipInformation(relationshipName)}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export function getRelationshipInformation(
  relationship: string,
): React.ReactNode {
  switch (relationship) {
    case "responseEquality":
      return (
        <>The response of an operation remains the same when called again</>
      );
    case "responseInequality":
      return <>The response of an operation has changed when called again</>;
    case "stateMutation":
      return <>The response of a GET operation has changed</>;
    case "stateIdentity":
      return (
        <>
          The response of a GET has changed, then returned to its original value
        </>
      );
    case "fuzz":
      return <>Error responses (status {">"}= 500)</>;
    default:
      return null;
  }
}

export default memo(RelationshipVisualizer);
