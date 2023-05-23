import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// A generic confirmation modal that is passed content as children and is pass props to hide and unhide and whether it is currently visible.
export default function ConfirmationModal({ onConfirm, children, confirmVisible, onHide }) {

  return (
      <Modal show={confirmVisible} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onHide}>
            Cancel
          </Button>
          <Button variant='primary' onClick={onConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
  );
}
