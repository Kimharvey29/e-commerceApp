import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { Link } from 'react-router-dom';
import CheckoutSummary from '../components/Order';
import '../index.css'; // Custom styles for CartPage
import EditCart from '../components/EditCart';

const CartPage = () => {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);



  useEffect(() => {
    if (user.id) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.cart) {
            setCart(data.cart);
          } else {
            setMessage('Your cart is empty.');
          }
          setLoading(false);
        })
        .catch((error) => {
          setMessage('An error occurred while fetching the cart.');
          setLoading(false);
        });
    }
  }, [user]);

  const handleRemoveFromCart = (productId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.updatedCart) {
          setCart(data.updatedCart);
        }
      })
      .catch((error) => setMessage('Failed to remove item.'));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ productId, newQuantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.cart) {
          setCart(data.cart);
        }
      })
      .catch((error) => setMessage('Failed to update quantity.'));
  };

  const handleClearCart = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Cart cleared successfully') {
          setCart(data.cart);
        }
      })
      .catch((error) => setMessage('Failed to clear the cart.'));
  };

  const handleCheckout = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Ordered successfully.') {
          setCart({ cartItems: [], totalPrice: 0 });
          setAlert('Order placed successfully.');
        } else {
          setAlert('Failed to place the order.');
        }
      })
      .catch(() => setAlert({ type: 'danger', text: 'An error occurred while placing the order.' }));
  };

  const handleCloseModal = () => setShowModal(false);
  const handleOpenModal = () => setShowModal(true);

  if (loading) {
    return <div>Loading cart...</div>;
  }

  const totalPrice = cart.cartItems.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  const handleEditCart = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };


  
  return (
    <Container fluid className="bg-light-gray">
      <Row className="justify-content-center mt-5">
        <Col lg={8}>
          <Card>
            <Card.Body>
              <div className='text-center'> 
              <Card.Title>Your Cart</Card.Title>
              </div>
              {message && <p>{message}</p>}
              {cart && cart.cartItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/products">Browse products</Link></p>
              ) : (
                <div>
                  {cart.cartItems.map((item) => (
                    <div key={item.productId} className="cart-item mb-4">
                      <Row className="align-items-center">
                        <Col sm={8}>
                          <h5>{item.productName}</h5>
                          <p>{item.productDescription}</p>
                          <p>Price: {item.productPrice}</p>
                          <p>Subtotal: {(item.productPrice * item.quantity).toFixed(2)}</p>
                          <p>Quantity: {(item.quantity)}</p>
                          <div className="quantity-control">
                            <Button className="edit-cart-btn" onClick={() => handleEditCart(item)}>Edit Cart</Button>
                          </div>
                        </Col>
                        <Col sm={4} className="text-center">
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveFromCart(item.productId)}
                            className="remove-btn"
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <div className="mt-4">
                  <h4>Total: ${totalPrice.toFixed(2)}</h4>

                    <Button variant="success" onClick={handleOpenModal} className="checkout-btn">
                      Proceed to Checkout
                    </Button>
                    <Button variant="warning" onClick={handleClearCart} className="clear-btn">
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CheckoutSummary cart={cart} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCheckout}>
            Checkout
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {currentProduct && (
        <EditCart
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdateQuantity={handleUpdateQuantity}
          product={currentProduct}
        />
      )}
    </Container>
  );
};

export default CartPage;
