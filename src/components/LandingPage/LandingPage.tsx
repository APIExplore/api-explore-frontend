import { Modal, useModal } from "@tiller-ds/alert";
import { Button } from "@tiller-ds/core";
import { useState } from "react";
import NewSchema from "./newSchema";

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
          <NewSchema />
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
