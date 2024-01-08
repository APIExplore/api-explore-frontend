import { Edge } from "reactflow";

import { Dependency, InitialSchema } from "./depGraphTypes";

export function generateInitialDependencies(
  requests,
  definitions,
): Dependency[] {
  return requests.reduce((dependencies, request) => {
    const { path, definitionRef, method, operationId } = request;

    if (definitionRef) {
      const definitionName = definitionRef
        .split("/")
        .pop()
        .replace("#/definitions/", "");

      if (definitions.some((def) => def.name === definitionName)) {
        if (!dependencies[operationId]) {
          dependencies[operationId] = {
            method: method.toUpperCase(),
            path: path,
            dependencies: [],
          };
        }

        // Add direct dependency if not already present
        if (!dependencies[operationId].dependencies.includes(definitionName)) {
          dependencies[operationId].dependencies.push(definitionName);
        }

        // Check indirect dependencies
        definitions.forEach((definition) => {
          if (definition.properties) {
            Object.values(definition.properties).forEach((prop: any) => {
              if (
                prop.items &&
                prop.items.$ref &&
                prop.items.$ref === definitionRef &&
                !dependencies[operationId].dependencies.includes(
                  definition.name,
                )
              ) {
                dependencies[operationId].dependencies.push(definition.name);
              }
            });
          }
        });
      }
    }

    return dependencies;
  }, {});
}

export function generateSequenceDependencies(calls): Dependency[] {
  const dependencyMap = {};
  calls.forEach((call, index) => {
    const { operationId, params, method, path } = call;
    dependencyMap[operationId] = {
      method: method.toUpperCase(),
      path: path,
      dependencies: [],
    };
    // Check if this call has parameters
    if (params.length > 0) {
      params.forEach((param) => {
        const paramName = param.name;

        // Check if the parameter exists in other calls
        calls.forEach((otherCall, otherIndex) => {
          if (index !== otherIndex) {
            const otherParams = otherCall.params || [];
            otherParams.forEach((otherParam) => {
              if (otherParam.name === paramName) {
                if (operationId !== otherCall.operationId) {
                  if (
                    method.toUpperCase() === "GET" &&
                    !dependencyMap[operationId].dependencies.includes(
                      call.operationId,
                    )
                  ) {
                    dependencyMap[operationId].dependencies.push(
                      call.operationId,
                    );
                  } else if (
                    !dependencyMap[operationId].dependencies.includes(
                      otherCall.operationId,
                    )
                  ) {
                    dependencyMap[operationId].dependencies.push(
                      otherCall.operationId,
                    );
                  }
                }
              }
            });
          }
        });
      });
    } else {
      calls.forEach((otherCall, otherIndex) => {
        if (index !== otherIndex) {
          const { path: otherPath, operationId: otherOperationId } = otherCall;
          if (
            otherPath.startsWith(path) &&
            otherPath.replace(path, "").startsWith("/{")
          ) {
            dependencyMap[operationId].dependencies.push(otherOperationId);
          }
        }
      });
    }
  });
  return dependencyMap as Dependency[];
}

export function generateDiagramSchema(
  dependencies: Dependency[],
): InitialSchema {
  const endpointKeys = Object.keys(dependencies);
  return {
    initialNodes: endpointKeys.map((endpoint, index) => ({
      position: { x: index * 100, y: index * 100 },
      id: `node_${index}`,
      data: {
        path: endpoint,
        method: dependencies[endpoint].method,
        operationId: dependencies[endpoint].path,
        dependencies: dependencies[endpoint].dependencies,
      },
      type: "custom",
    })),
    initialEdges: endpointKeys.flatMap((endpoint, index) => {
      const { method, dependencies: endpointDependencies } =
        dependencies[endpoint];
      const endpointLinks: Edge[] = [];

      if (method === "GET") {
        endpointKeys.forEach((childEndpoint, childIndex) => {
          if (index !== childIndex) {
            const { method: childMethod, dependencies: childDependencies } =
              dependencies[childEndpoint];
            const commonDependencies = endpointDependencies.filter((dep) =>
              childDependencies.includes(dep),
            );
            if (
              commonDependencies.length > 0 &&
              !(method === "GET" && childMethod === "GET")
            ) {
              endpointLinks.push({
                id: `node_${childIndex} -> node_${index}`,
                source: `node_${childIndex}`,
                target: `node_${index}`,
              });
            }
          }
        });
      }

      return endpointLinks;
    }),
  };
}
