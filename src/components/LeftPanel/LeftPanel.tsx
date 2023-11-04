import Details from "./Details";
import { Icon } from "@tiller-ds/icons";
import { Tabs } from "@tiller-ds/core";

export default function LeftPanel() {
  return (
    <div>
      <Tabs iconPlacement="trailing">
        <Tabs.Tab
          label="Details"
          icon={<Icon type="magnifying-glass" variant="fill" />}
        >
          <Details></Details>
        </Tabs.Tab>
        <Tabs.Tab label="Metrics" icon={<Icon type="list" variant="fill" />}>
          Metrics
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
