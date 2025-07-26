import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditCart = ({ show, onClose, onUpdateQuantity, product }) => {
  const [quantity, setQuantity] = useState(product.quantity);

  const handleSave = () => {
    if (quantity > 0) {
      onUpdateQuantity(product.productId, quantity); // Call the parent's update function
      onClose(); // Close the modal
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Quantity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Product: {product.productName}</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCart;
