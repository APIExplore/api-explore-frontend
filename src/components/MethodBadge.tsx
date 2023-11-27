import React from "react";

import colors from "tailwindcss/colors";

import { MethodColorMappings } from "./VisualisationPanel/Chart/apiChartUtils";

export default function MethodBadge({ method }: { method: string }) {
  return (
    <span
      style={{
        backgroundColor:
          colors[MethodColorMappings[method.toUpperCase()]]["200"],
        color: colors[MethodColorMappings[method.toUpperCase()]]["800"],
      }}
      className="px-2 py-0.5 rounded-full"
    >
      {method.toUpperCase()}
    </span>
  );
}
