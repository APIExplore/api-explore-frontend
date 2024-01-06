// Create a new file, e.g., 'relationshipsUtils.ts'

import { Edge, Node } from "reactflow";

import { ApiCall, RelationshipMapping } from "../../../types/apiCallTypes";
import { InitialSchema } from "../DependencyGraph/depGraphTypes";

export function generateDiagramSchema(relationships: {
  [K in keyof typeof RelationshipMappings]: ApiCall[][];
}): InitialSchema {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  let positionIndex = 0;

  Object.entries(relationships).forEach(([relationship, apiCallArray]) => {
    apiCallArray.forEach((calls, index) => {
      calls.forEach((call, callIndex) => {
        const currentNode: Node = {
          id: `${relationship}-${index}-${callIndex}`,
          data: {
            label: call.operationId,
            responseBody: call.response.data,
            responseType: call.response.contentType,
            timestamp: call.date,
            method: call.method,
          },
          position: { x: positionIndex * 100, y: positionIndex * 300 },
          type: "custom", // Set the node type as needed
        };
        initialNodes.push(currentNode);
        positionIndex += 1;

        if (callIndex < calls.length - 1) {
          const edge: Edge = {
            id: `${relationship}-${index}-${callIndex}-to-${relationship}-${index}-${
              callIndex + 1
            }`,
            source: `${relationship}-${index}-${callIndex}`,
            target: `${relationship}-${index}-${callIndex + 1}`,
            label: RelationshipMappings[relationship],
            animated: true,
          };
          initialEdges.push(edge);
        }
      });
    });
  });

  return { initialNodes, initialEdges };
}

export function getRelationships(apiCallSequences: ApiCall[]) {
  const relationships: RelationshipMapping = {};

  apiCallSequences.forEach((call, index) => {
    if (call.relationships) {
      Object.entries(call.relationships).forEach(
        ([relationshipType, relationshipValues]) => {
          if (!relationships[relationshipType]) {
            relationships[relationshipType] = {};
          }

          if (!relationships[relationshipType][index]) {
            relationships[relationshipType][index] = [];
          }
          relationshipValues?.forEach((relationshipValue) => {
            if (relationships[relationshipType][index]) {
              relationships[relationshipType][index].push(relationshipValue);
            }
          });
        },
      );
    }
  });

  return relationships;
}

export function getAPICallsFromRelationships(
  relationships: number[][],
  apiCalls: ApiCall[],
): ApiCall[][] {
  const extractedCalls: ApiCall[][] = [];

  for (const relation of relationships) {
    const relatedCalls: ApiCall[] = [];
    for (const index of relation) {
      if (apiCalls[index]) {
        relatedCalls.push(apiCalls[index]);
      }
    }
    extractedCalls.push(relatedCalls);
  }

  return extractedCalls;
}

export function findRelationshipsFromConnections(
  connections: string[][],
): number[][] {
  const relationships: number[][] = [];

  let currentRelationship: number[] = [];
  for (let i = 0; i < connections.length; i++) {
    if (connections[i] && connections[i].includes("start")) {
      if (
        connections[i].indexOf("end") !== -1 &&
        connections[i].indexOf("start") === connections[i].indexOf("end") + 1
      ) {
        currentRelationship.push(i);
      }
      if (currentRelationship.length > 0) {
        relationships.push(currentRelationship);
        currentRelationship = [];
      }
      currentRelationship.push(i);
    } else if (
      connections[i] &&
      (connections[i].includes("mid") || connections[i].includes("end"))
    ) {
      currentRelationship.push(i);
    }
  }

  if (currentRelationship.length > 0) {
    relationships.push(currentRelationship);
  }

  return relationships;
}

export enum RelationshipMappings {
  responseEquality = "Response Equality",
  responseInequality = "Response Inequality",
  stateMutation = "State Mutation",
  stateIdentity = "State Identity",
  fuzz = "Fuzz",
}
