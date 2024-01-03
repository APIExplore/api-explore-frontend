import React, { useEffect, useState } from "react";

import _ from "lodash";

import { Badge, Card, IconButton, Tooltip, Typography } from "@tiller-ds/core";
import { DescriptionList } from "@tiller-ds/data-display";
import { Icon } from "@tiller-ds/icons";

import { getRelationshipInformation } from "./RelationshipVisualizer";
import {
  findRelationshipsFromConnections,
  getAPICallsFromRelationships,
  RelationshipMappings,
} from "./relationshipsGraphUils";
import useApiCallsStore from "../../../stores/apiCallsStore";
import useRelationshipsStore from "../../../stores/relationshipsStore";
import { ApiCall } from "../../../types/apiCallTypes";

export default function Relationship({
  relationshipType,
  calls,
}: {
  relationshipType: string;
  calls: ApiCall[];
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const relationshipName = RelationshipMappings[relationshipType];

  const {
    callsToDisplay,
    setCallsToDisplay,
    currentRelationship,
    setCurrentRelationship,
    addMapping,
  } = useRelationshipsStore();
  const apiCalls = useApiCallsStore((store) => store.apiCalls);

  const connections = calls
    .flatMap((call) => call.relationships)
    .map((relation) => relation[relationshipType]);
  const relationshipsIndices = findRelationshipsFromConnections(connections);
  const retrievedCalls = getAPICallsFromRelationships(
    relationshipsIndices,
    calls,
  );

  useEffect(() => {
    addMapping(
      relationshipType as keyof typeof RelationshipMappings,
      retrievedCalls,
    );
  }, [apiCalls]);

  return (
    <Card>
      <Card.Header className="flex items-center">
        <IconButton
          icon={
            <Icon
              type={isExpanded ? "minus" : "plus"}
              size={2}
              className="mr-2"
            />
          }
          onClick={() => setIsExpanded(!isExpanded)}
          showTooltip={false}
        />
        {relationshipName}
        <Tooltip label={getRelationshipInformation(relationshipType)}>
          <Icon
            type="info"
            className="text-slate-400 hover:text-slate-500 pl-0.5"
            size={2}
          />
        </Tooltip>
      </Card.Header>
      {isExpanded && (
        <Card.Body>
          <DescriptionList>
            {retrievedCalls.map((relatedCalls, index) => {
              const isActive =
                _.isEqual(callsToDisplay, relatedCalls) &&
                currentRelationship === relationshipType;
              return (
                <DescriptionList.Item
                  label={
                    _.isEqual(callsToDisplay, relatedCalls) &&
                    currentRelationship === relationshipType ? (
                      <Badge>{index + 1}</Badge>
                    ) : (
                      <div className="px-3 py-1"> {index + 1}</div>
                    )
                  }
                  key={index}
                  type="default"
                  tokens={{
                    Item: {
                      type: { default: { label: "w-1/6", content: "w-5/6" } },
                    },
                  }}
                >
                  <div className="flex items-center pt-0.5">
                    <Typography>{relatedCalls.at(0)?.operationId}</Typography>
                    {!isActive && (
                      <IconButton
                        icon={<Icon type="arrow-arc-right" size={2} />}
                        label="View in graph"
                        onClick={() => {
                          setCallsToDisplay(relatedCalls, false);
                          setCurrentRelationship(
                            relationshipType as keyof typeof RelationshipMappings,
                          );
                        }}
                      />
                    )}
                  </div>
                </DescriptionList.Item>
              );
            })}
          </DescriptionList>
        </Card.Body>
      )}
    </Card>
  );
}
