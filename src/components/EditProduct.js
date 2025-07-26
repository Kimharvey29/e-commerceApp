import {Button, Form, Modal} from 'react-bootstrap';
import { useState } from 'react';

import {Notyf} from 'notyf';


export default function EditProduct({product, fetchData}){

		const notyf =new Notyf();

		const [show, setShow] = useState(false);

		const handleClose = () => setShow(false);
		const handleShow = () => setShow(true);

		const [productId, setProductId] = useState(product._id);

		const [name, setName] = useState(product.name);
		const [description, setDescription] = useState(product.description);
		const [price, setPrice] = useState(product.price);


		// This function will update the product based on the state of the states:
		const editProduct = (event, productId) => {
			// to avoide refreshing
			event.preventDefault();
			fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/update`,{
				method: "PATCH",
				headers: {
					'Content-Type' : 'application/json',
					'Authorization' : `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify({
					name, 
					description, 
					price
				})
			})
			.then(response => response.json())
			.then(data => {
                console.log(data)
				if(data.message === 'Product updated successfully'){
					notyf.success('Successfully Updated!')
					fetchData();
					handleClose();
				}else{
					notyf.error('Something went wrong!');
					fetchData();
					handleClose();
				}
			})
		}


	
	return (
		<>
			<Button variant = "primary" size = "sm" onClick={handleShow} >Edit</Button>

			{/*Edit Modal*/}

			<Modal show={show} onHide={handleClose}>
			       <Modal.Header closeButton>
			         <Modal.Title>Edit Product</Modal.Title>
			       </Modal.Header>
			       <Modal.Body>
			         <Form >
			           <Form.Group className="mb-3" controlId="productName">
			             <Form.Label>Name</Form.Label>
			             <Form.Control
			               type="text"
			               required
			               value = {name}
			               onChange = {event => setName(event.target.value)}
			             />
			           </Form.Group>

			           <Form.Group
			             className="mb-3"
			             controlId="productDescription"
			           >
			             <Form.Label>Description</Form.Label>
			             <Form.Control  
			             	type = "text"
			             	value = {description}
			             	onChange = {event => setDescription(event.target.value)} 
			             	required/>
			           </Form.Group>

			           <Form.Group
			             className="mb-3"
			             controlId="productPrice"
			           >
			             <Form.Label>Price</Form.Label>
			             <Form.Control  
			             	type = "number"
			             	value = {price} 
			             	onChange = {event => setPrice(event.target.value)}
			             	required/>
			           </Form.Group>


			         </Form>
			       </Modal.Body>
			       <Modal.Footer>
			         <Button variant="secondary" onClick={handleClose}>
			           Close
			         </Button>
			         <Button variant="success" onClick= {event => editProduct(event, productId)}>
			           Save Changes
			         </Button>
			       </Modal.Footer>
			     </Modal>


		</>
		)
}