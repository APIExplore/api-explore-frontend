import React from "react";

import { Handle, Position } from "reactflow";

import MethodBadge from "../../MethodBadge";

const CustomNode = ({
  data,
}: {
  data: {
    path: string;
    method: string;
    operationId: string;
    dependencies: string[];
  };
}) => {
  return (
    <div className="px-4 mt-0.5 py-2 shadow-md rounded-sm bg-white border-2 border-stone-400">
      <div className="flex space-x-3">
        <div className="rounded-full w-fit h-12 flex justify-center items-center">
          <MethodBadge method={data.method} />
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.path}</div>
          <div className="text-gray-500">{data.operationId}</div>
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

export default CustomNode;
