import { DataTable } from "@tiller-ds/data-display";
import { IconButton } from "@tiller-ds/core";
import { Item } from "./types/RightPanelTypes";
import { Icon } from "@tiller-ds/icons";

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

  return (
    <DataTable
      data={selectedRequests}
      className="w-[300px]"
      lastColumnFixed={true}
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
        {(item: Item) => <>{item.operationId}</>}
      </DataTable.Column>
      <DataTable.Column
        header="Actions"
        id="actions"
        className="max-w-md"
        canSort={false}
      >
        {(item: Item, index) => (
          <div className="flex justify-center items-center space-x-1">
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
                console.log("Index of item is ", index);
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
                label="Move Up"
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
                label="Move Down"
              />
            </div>
          </div>
        )}
      </DataTable.Column>
    </DataTable>
  );
}
