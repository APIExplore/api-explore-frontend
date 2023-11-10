import { useEffect, useRef } from "react";

import {
  PanelDimensions,
  PanelDimensionsStore,
} from "../stores/panelDimensionsStore";

export function useResizeObserver(
  panel: keyof PanelDimensionsStore["panels"],
  setDimensions: (
    panel: keyof PanelDimensionsStore["panels"],
    dimensionType: keyof PanelDimensions,
    amount: number,
  ) => void,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;

    if (target) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newWidth = entry.target.clientWidth;
          const newHeight = entry.target.clientHeight;
          setDimensions(panel, "width", newWidth);
          setDimensions(panel, "height", newHeight);
        }
      });

      observer.observe(target);

      return () => observer.disconnect();
    }
  }, [panel, setDimensions]);

  return ref;
}
