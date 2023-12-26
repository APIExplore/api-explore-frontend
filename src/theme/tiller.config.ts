import { iconConfig } from "@tiller-ds/icons";
import { IconConfig, ThemeConfigFactory } from "@tiller-ds/theme";

export const defaultComponentConfig: ThemeConfigFactory = {
  component: {
    DataTable: {
      tableRow: {
        odd: "",
        even: "",
      },
    },
    Modal: {
      Content: {
        master: "text-normal text-body-light h-full",
      },
    },
    FieldGroup: {
      GroupItem: {
        content: "h-5 flex items-center",
        info: "pl-2 text-sm leading-5",
      },
    },
    DescriptionList: {
      padding: "p-0 border-md",
      Type: { clean: { master: "flex flex-row max-w-full" } },
      Item: {
        type: {
          sameColumn: {
            itemColumnContainer: "flex flex-col p-2 w-full",
          },
          default: {
            itemColumnContainer: "flex p-2 w-full",
          },
        },
      },
    },
    Card: {
      container: { borderRadius: "rounded-md" },
      header: {
        padding: "p-3",
        title: {
          fontSize: "text-base",
        },
      },
      footer: {
        padding: "p-3",
      },
    },
    Toggle: {
      master: "flex items-center space-x-2",
    },
    ButtonGroups: {
      base: "",
    },
  },
};

export const defaultIconConfig: IconConfig = {
  ...iconConfig,
};
