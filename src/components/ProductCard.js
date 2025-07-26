import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    const { name, description, price, imageUrl, _id } = product;

    return (
        <Card className="my-3 shadow-sm product-card">
            {/* Product Image */}
            <Card.Img variant="top" src={imageUrl || 'https://clipground.com/images/product-png-9.png'} alt={name} />

            <Card.Body className="d-flex flex-column">
                {/* Product Name */}
                <Card.Title className="product-name">{name || "Unnamed Product"}</Card.Title>

                {/* Product Description */}
                <Card.Subtitle className="description-title">Description:</Card.Subtitle>
                <Card.Text className="description-scroll">
                    {description || "No description available"}
                </Card.Text>

                {/* Product Price */}
                <Card.Subtitle className="price-title">Price:</Card.Subtitle>
                <Card.Text className="product-price">
                    <strong>${price ? price.toFixed(2) : "N/A"}</strong>
                </Card.Text>

                {/* Details Button */}
                <Link className="btn btn-dark w-100 mt-auto" to={`/products/${_id}`}>
                    View Details
                </Link>
            </Card.Body>
        </Card>
    );
}
