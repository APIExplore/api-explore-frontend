import { DataTable } from "@tiller-ds/data-display";
import { IconButton } from "@tiller-ds/core";
import { Item } from "./types/RightPanelTypes";
import { Icon } from "@tiller-ds/icons";

export default function ConfigurationDataTable({
  selectedRequests,
  setModalOperation,
  setClickedItem,
  removeItem,
}: {
  selectedRequests: Array<any>;
  setModalOperation: (data: any) => void;
  setClickedItem: (data: any) => void;
  removeItem: (data: any) => void;
}) {
  const handleDragEnd = (result) => {
    console.log("changing order... ", result);

    // Implementirajte logiku za promjenu poretka redaka ovdje
    // if (!result.destination) {
    //   return;
    // }

    // const items = Array.from(selectedRequests);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // items.splice(result.destination.index, 0, reorderedItem);

    // Ažuriranje stanja s novim redoslijedom
    // setSelectedRequests(items);
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
          </div>
        )}
      </DataTable.Column>
    </DataTable>
  );
}
