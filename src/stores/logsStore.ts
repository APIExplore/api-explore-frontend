import { create } from "zustand";

export type LogWarning = {
  warning: string;
  timestamp: Date;
};

export type LogError = {
  error: string;
  timestamp: Date;
};

export type LogsStore = {
  errors: LogError[];
  warnings: LogWarning[];
  addErrors: (errors: LogError[]) => void;
  addWarnings: (warnings: LogWarning[]) => void;
  addError: (error: LogError) => void;
  addWarning: (warning: LogWarning) => void;
  addErrorsAndWarnings: (
    errors: LogError[] | undefined | null,
    warnings: LogWarning[] | undefined | null,
  ) => void;
  clearErrors: () => void;
  clearWarnings: () => void;
  clearAllLogs: () => void;
};

const useLogsStore = create<LogsStore>((set) => ({
  errors: [],
  warnings: [],
  addErrors: (errors) =>
    set((state) => ({
      errors: [
        ...state.errors,
        ...errors.map((error) => ({
          ...error,
          timestamp: new Date(),
        })),
      ],
    })),
  addWarnings: (warnings) =>
    set((state) => ({
      warnings: [
        ...state.warnings,
        ...warnings.map((warning) => ({
          ...warning,
          timestamp: new Date(),
        })),
      ],
    })),
  addError: (error) =>
    set((state) => ({
      errors: [
        ...state.errors,
        {
          ...error,
          timestamp: new Date(),
        },
      ],
    })),
  addWarning: (warning) =>
    set((state) => ({
      warnings: [
        ...state.warnings,
        {
          ...warning,
          timestamp: new Date(),
        },
      ],
    })),
  addErrorsAndWarnings: (errors, warnings) =>
    set((state) => ({
      errors: errors ? [...state.errors, ...errors] : state.errors,
      warnings: warnings ? [...state.warnings, ...warnings] : state.warnings,
    })),
  clearWarnings: () => set({ warnings: [] }),
  clearErrors: () => set({ errors: [] }),
  clearAllLogs: () => set({ errors: [], warnings: [] }),
}));

export default useLogsStore;
