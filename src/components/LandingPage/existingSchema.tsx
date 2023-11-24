import { Typography } from "@tiller-ds/core";
import { DropdownMenu } from "@tiller-ds/menu";
import axios from "axios";
import { useEffect, useState } from "react";
import { backendDomain } from "../../constants/apiConstants";

export default function ExistingSchema({
  existingApiSchemasNames,
  setIsClosed,
  convertSchemaToList,
}: {
  existingApiSchemasNames: Array<any>;
  setIsClosed: (data: any) => void;
  convertSchemaToList: (data: any) => void;
}) {
  const [selectedApiSchema, setSelectedApiSchema] = useState(null);
  const [title, setTitle] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isFetched) {
      setError("");
    }
  }, [isFetched]);

  async function selectApiSchema(item) {
    setSelectedApiSchema(item.name);
    setTitle(item.name);
    try {
      const data = await axios.get(
        `${backendDomain}/apiSchema/fetch/` + item.name
      );

      convertSchemaToList(data.data);

      setIsFetched(true);

      setTimeout(() => {
        setIsFetched(false);
        setIsClosed(true);
      }, 1000);
    } catch (e: any) {
      setError(e.response ? e.response.data.error : e.message);

      console.log("error: ", e.response.data.error);
    }
  }
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col my-2">
        <div className="py-3 mt-6 text-center">
          <Typography variant="h6">Select Api Schema Name:</Typography>
        </div>
        <div className="flex flex-col my-2">
          <div className="py-3 mt-6 text-center">
            <DropdownMenu title={title} className="w-48">
              {existingApiSchemasNames.map((item, index) => (
                <DropdownMenu.Item
                  key={index}
                  onSelect={() => {
                    selectApiSchema(item);
                  }}
                >
                  <div className="text-body">{item.name}</div>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu>
            {isFetched && (
              <p
                id="schema-fetched"
                className="text-green-600 mt-2 text-base text-center"
              >
                {"Schema " + selectedApiSchema + " fetched"}
              </p>
            )}
            {error?.length > 0 && (
              <p
                id="schema-fetched"
                className="text-red-600 mt-2 text-base text-center"
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
