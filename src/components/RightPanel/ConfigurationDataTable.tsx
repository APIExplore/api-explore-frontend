import { useEffect } from "react";

import { IconButton, Typography } from "@tiller-ds/core";
import { DataTable } from "@tiller-ds/data-display";
import { Icon } from "@tiller-ds/icons";

import { Item } from "./types/RightPanelTypes";
import useApiCallsStore from "../../stores/apiCallsStore";

export default function ConfigurationDataTable({
  selectedRequests,
  setModalOperation,
  setSelectedRequests,
  setClickedItem,
  removeItem,
}: {
  selectedRequests: Array<any>;
  setModalOperation: (data: any) => void;
  setSelectedRequests: (data: any) => void;
  setClickedItem: (data: any) => void;
  removeItem: (data: any) => void;
}) {
  const callByCall = useApiCallsStore((store) => store.callByCallMode);

  const handleMoveUp = (index) => {
    if (index > 0) {
      const updatedRequests = [...selectedRequests];
      [updatedRequests[index - 1], updatedRequests[index]] = [
        updatedRequests[index],
        updatedRequests[index - 1],
      ];
      setSelectedRequests(updatedRequests);
    }
  };

  const handleMoveDown = (index) => {
    if (index < selectedRequests.length - 1) {
      const updatedRequests = [...selectedRequests];
      [updatedRequests[index], updatedRequests[index + 1]] = [
        updatedRequests[index + 1],
        updatedRequests[index],
      ];
      setSelectedRequests(updatedRequests);
    }
  };

  useEffect(() => {
    setSelectedRequests(selectedRequests);
  }, [callByCall.nextCallIndex, callByCall.enabled]);

  return (
    <DataTable
      data={selectedRequests}
      className="w-[300px]"
      lastColumnFixed={true}
      getRowClassName={(values, index) =>
        index === callByCall.nextCallIndex && callByCall.enabled
          ? "bg-info-light"
          : index <= callByCall.nextCallIndex - 1 && callByCall.enabled
          ? "bg-success-light"
          : "bg-white"
      }
    >
      <DataTable.Column
        header="Method"
        id="method"
        className="max-w-md uppercase"
      >
        {(item: Item) => <>{item.method}</>}
      </DataTable.Column>
      <DataTable.Column
        header="Operation Id"
        id="operationId"
        className="max-w-md"
      >
        {(item: Item) => (
          <div className="flex flex-col">
            {item.operationId}
            {item.params.map((param, index) => (
              <Typography variant="subtext" key={index}>
                {param.name + ": " + param.value}
              </Typography>
            ))}
          </div>
        )}
      </DataTable.Column>
      <DataTable.Column
        header="Actions"
        id="actions"
        className="max-w-md"
        canSort={false}
      >
        {(item: Item, index) => (
          <div className="flex items-center space-x-1">
            <IconButton
              id={"edit-" + String(index)}
              icon={
                <Icon
                  type="pencil-simple"
                  variant="fill"
                  className="text-gray-500"
                />
              }
              onClick={() => {
                setModalOperation("edit");
                setClickedItem(JSON.parse(JSON.stringify({ ...item, index })));
              }}
              label="Edit"
            />
            <IconButton
              id={"delete-" + String(index)}
              icon={
                <Icon type="trash" variant="fill" className="text-gray-500" />
              }
              onClick={() => removeItem(index)}
              label="Delete"
            />
            <div className="flex flex-col gap-0">
              <IconButton
                id={"move-up-" + String(index)}
                icon={
                  <Icon
                    type="caret-up"
                    variant="fill"
                    className="text-gray-500 cursor-pointer p-0"
                  />
                }
                onClick={() => handleMoveUp(index)}
                disabled={
                  (callByCall.enabled && index <= callByCall.nextCallIndex) ||
                  index === 0
                }
                label={
                  callByCall.enabled && index < callByCall.nextCallIndex
                    ? "Cannot move already executed call"
                    : callByCall.enabled && index === callByCall.nextCallIndex
                    ? "Cannot move before already executed calls"
                    : "Move Up"
                }
              />
              <IconButton
                id={"move-down-" + String(index)}
                icon={
                  <Icon
                    type="caret-down"
                    variant="fill"
                    className="text-gray-500 cursor-pointer p-0"
                  />
                }
                onClick={() => handleMoveDown(index)}
                disabled={
                  (callByCall.enabled && index < callByCall.nextCallIndex) ||
                  index === selectedRequests.length - 1
                }
                label={
                  callByCall.enabled && index < callByCall.nextCallIndex
                    ? "Cannot move already executed call"
                    : "Move Down"
                }
              />
            </div>
          </div>
        )}
      </DataTable.Column>
    </DataTable>
  );
}
