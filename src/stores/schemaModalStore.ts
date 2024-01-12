import { create } from "zustand";

type ModalStore = {
  opened: boolean;
  setOpened: (isOpened: boolean) => void;
};

const useSchemaModalStore = create<ModalStore>((set) => ({
  opened: false,
  setOpened: (isOpened) => set({ opened: isOpened }),
}));

export default useSchemaModalStore;
