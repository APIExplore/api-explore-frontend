import { create } from "zustand";

export type PanelDimensions = {
  width: number;
  height: number;
};

export type PanelDimensionsStore = {
  panels: {
    left: PanelDimensions;
    middle: PanelDimensions;
    right: PanelDimensions;
    bottom: PanelDimensions;
    container: PanelDimensions;
  };
  setDimensions: (
    panel: keyof PanelDimensionsStore["panels"],
    dimensionType: keyof PanelDimensions,
    amount: number,
  ) => void;
};

const usePanelDimensionsStore = create<PanelDimensionsStore>((set) => ({
  panels: {
    left: {
      width: Number(document.getElementById("left-panel")?.clientWidth),
      height: Number(document.getElementById("left-panel")?.clientHeight),
    },
    middle: {
      width: Number(document.getElementById("middle-panel")?.clientWidth),
      height: Number(document.getElementById("middle-panel")?.clientHeight),
    },
    right: {
      width: Number(document.getElementById("right-panel")?.clientWidth),
      height: Number(document.getElementById("right-panel")?.clientHeight),
    },
    bottom: {
      width: Number(document.getElementById("bottom-panel")?.clientWidth),
      height: Number(document.getElementById("bottom-panel")?.clientHeight),
    },
    container: {
      width: Number(document.getElementById("container")?.clientWidth),
      height: Number(document.getElementById("container")?.clientHeight),
    },
  },
  setDimensions: (panel, dimensionType, amount) => {
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: {
          ...state.panels[panel],
          [dimensionType]: amount,
        },
      },
    }));
  },
}));

export default usePanelDimensionsStore;
