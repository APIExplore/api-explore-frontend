import { Modal } from "@tiller-ds/alert";
import { Button } from "@tiller-ds/core";

export default function HtmlDetails({ modal, clickedApiCall }: any) {
  return (
    <Modal {...modal}>
      <Modal.Content title="Response body">{clickedApiCall} </Modal.Content>
      <Modal.Footer>
        <Button
          id="close-details-modal"
          variant="text"
          color="white"
          onClick={modal.onClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
