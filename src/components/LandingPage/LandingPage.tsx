import { Modal, useModal } from "@tiller-ds/alert";
import { Button, Tabs } from "@tiller-ds/core";
import { useState } from "react";
import NewSchema from "./newSchema";
import { Icon } from "@tiller-ds/icons";
import ExistingSchema from "./existingSchema";

export default function LandingPage() {
  const [isReady, setIsReady] = useState(false);
  const modal = useModal();

  const close = () => {
    setIsReady(true);
  };

  return (
    <Modal {...modal} isOpen={!isReady} state={undefined} canDismiss={false}>
      <div style={{ height: "500px", overflowY: "auto" }}>
        <Modal.Content title="">

           <Tabs iconPlacement="trailing" fullWidth={true} className="w-full">
          <Tabs.Tab
            label="New schema"
            icon={<Icon type="magnifying-glass" variant="fill" />}
          >
           <NewSchema />
           </Tabs.Tab>
          <Tabs.Tab label="Existing schema" icon={<Icon type="list" variant="fill" />}>
            <ExistingSchema />
          </Tabs.Tab>
        </Tabs>
        </Modal.Content>
      </div>
      <Modal.Footer>
        <Button variant="filled" onClick={close}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
