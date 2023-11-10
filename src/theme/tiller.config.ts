import { iconConfig } from "@tiller-ds/icons";
import { IconConfig, ThemeConfigFactory } from "@tiller-ds/theme";

export const defaultComponentConfig: ThemeConfigFactory = {
  component: {
    DataTable: {
      tableRow: {
        odd: "bg-white",
        even: "bg-white",
      },
    },
  },
};

export const defaultIconConfig: IconConfig = {
  ...iconConfig,
};
