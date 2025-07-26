import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard'; 

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="product-catalog">
            <h2 className="text-center py-4">Product Catalog</h2>
            <Row>
                {products.map((product) => (
                    <Col className="pb-3" key={product._id} md={4} sm={6} xs={12}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProductCatalog;