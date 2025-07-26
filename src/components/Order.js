import React from 'react';
import { Table } from 'react-bootstrap';

const CheckoutSummary = ({ cart }) => {
  if (!cart || cart.cartItems.length === 0) {
    return <p>No items in the cart.</p>;
  }
  const totalPrice = cart.cartItems.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  return (
    <div>
      <h5>Order Summary</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.cartItems.map((item) => (
            <tr key={item.productId}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>{(item.productPrice * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4>Total: ${totalPrice.toFixed(2)}</h4>
    </div>
  );
};

export default CheckoutSummary;
