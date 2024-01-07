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
      width: Number(document.getElementById("left-panel")?.clientWidth) || 0,
      height: Number(document.getElementById("left-panel")?.clientHeight) || 0,
    },
    middle: {
      width: Number(document.getElementById("middle-panel")?.clientWidth) || 0,
      height:
        Number(document.getElementById("middle-panel")?.clientHeight) || 0,
    },
    right: {
      width: Number(document.getElementById("right-panel")?.clientWidth) || 0,
      height: Number(document.getElementById("right-panel")?.clientHeight) || 0,
    },
    bottom: {
      width: Number(document.getElementById("bottom-panel")?.clientWidth) || 0,
      height:
        Number(document.getElementById("bottom-panel")?.clientHeight) || 0,
    },
    container: {
      width: Number(document.getElementById("container")?.clientWidth) || 0,
      height: Number(document.getElementById("container")?.clientHeight) || 0,
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
