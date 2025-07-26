import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

const ProductDetails = () => {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch product details by ID
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`)
            .then((response) => response.json())
            .then((data) => setProduct(data))
            .catch((error) => console.error('Error fetching product details:', error));
    }, [id]);

    const handleAddToCart = () => {
        // Ensure the user is logged in before proceeding
        if (!user.id) {
            setMessage('Please log in to add items to the cart.');
            return;
        }

        setLoading(true); // Set loading state while the request is being processed

        // Send request to add the product to the cart
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
            },
            body: JSON.stringify({ productId: product._id, quantity }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setMessage(data.message); // Display the response message from the backend
                } else {
                    setMessage('Item added to cart successfully!');
                }
                setLoading(false); // Reset loading state
            })
            .catch((error) => {
                setMessage('An error occurred while adding to cart.');
                console.error(error);
                setLoading(false);
            });
    };


    const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    if (!product) {
        return <div>Loading...</div>; // Show loading state while the product is being fetched
    }

    return (
        <Container>
            <Row>
                <Col className="col-6 offset-3 mt-5">
                    <Card>
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Description</Card.Subtitle>
                            <Card.Text>{product.description}</Card.Text>
                            <Card.Subtitle className="mb-2 text-muted">Price</Card.Subtitle>
                            <Card.Text>{product.price}</Card.Text>
                            <Card.Title> Quantity </Card.Title>
                            <div>
                                <Button className="btn btn-primary" onClick={handleDecrement}>
                                    -
                                </Button>
                                <span className="mx-3">{quantity}</span>
                                <Button className="btn btn-primary" onClick={handleIncrement}>
                                    +
                                </Button>
                            </div>
                            {user.id ? (
                                <Button
                                    variant="success my-3"
                                    onClick={handleAddToCart}
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add to Cart'}
                                </Button>
                            ) : (
                                <Button as={Link} variant="primary" to="/login">
                                    Login to Add to Cart
                                </Button>
                            )}
                            {message && <p className="mt-3 text-success">{message}</p>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetails;
