import React from "react";

import { Handle, Position } from "reactflow";

import { prettifyTimestamp } from "../../../util/dateUtils";
import MethodBadge from "../../MethodBadge";

const CustomRelationshipNode = ({
  data,
}: {
  data: {
    label: string;
    responseBody: string | string[];
    responseType: string;
    timestamp: string;
    method: string;
  };
}) => {
  return (
    <div className="px-4 mt-0.5 py-2 shadow-md rounded-sm bg-white border-2 border-stone-400">
      <div className="flex flex-col space-y-3 justify-center items-center">
        <div className="rounded-full w-fit h-12 flex space-x-2 text-center justify-center items-center">
          <MethodBadge method={data.method} />
          <div>
            {data.label} <br /> {prettifyTimestamp(data.timestamp)}
          </div>
        </div>
        <div className="flex space-x-2 w-full items-center">
          <hr className="w-full border-slate-600" />
          <div className="text-nowrap">Body:</div>
          <hr className="w-full border-slate-600" />
        </div>
        <div className="ml-2">
          <div className="text-lg font-medium">
            {typeof data.responseBody === "string"
              ? data.responseBody
              : data.responseBody.join(",")}
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
};

export default CustomRelationshipNode;
