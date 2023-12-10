import React from "react";

import { LoadingIcon } from "@tiller-ds/icons";

type ConditionalDisplayProps = {
  componentToDisplay: React.ReactNode;
  condition: boolean;
  spinnerSize?: number;
  spinnerCaption?: React.ReactNode;
  className?: string;
};
export default function ConditionalDisplay({
  componentToDisplay,
  condition,
  spinnerSize = 6,
  spinnerCaption,
  className = "",
}: ConditionalDisplayProps) {
  if (!condition) {
    return (
      <div className={className}>
        <LoadingIcon size={spinnerSize} />
        {spinnerCaption}
      </div>
    );
  }

  return <>{componentToDisplay}</>;
}
