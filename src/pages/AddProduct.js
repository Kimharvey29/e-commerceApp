import { useState, useEffect, useContext } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';

export default function AddProduct({fetchData}){

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const notyf = new Notyf();

    const navigate = useNavigate();

    const {user} = useContext(UserContext);

    //input states
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");

    function createProduct(e){

        //prevent submit event's default behavior
        e.preventDefault();

        let token = localStorage.getItem('token');
        console.log(token);

        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`,{

            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({

                name: name,
                description: description,
                price: price

            })
        })
        .then(res => res.json())
        .then(data => {

            //data is the response of the api/server after it's been process as JS object through our res.json() method.
            console.log(data);
            if (data) {
                
                setName("")
                setDescription("")
                setPrice(0);

                notyf.success("Product Added")
                navigate("/AdminDashboard");
                fetchData()

            } else {

                notyf.error("Error: Something Went Wrong.")


            }

        })

    }

    return (
        user.isAdmin === true ? (
            <>
                <div className="d-flex justify-content-center my-4">
                    <Button className="bg-dark" variant="primary" onClick={handleShow}>
                        Add New Product
                    </Button>
                </div>
    
                <Modal className="mx-auto" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => createProduct(e)}>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter product name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
    
                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Label>Description:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Enter product description"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>
    
                            <Form.Group className="mb-3" controlId="formPrice">
                                <Form.Label>Price:</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter product price"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit" onClick={(e) => createProduct(e)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        ) : (
            <Navigate to="/AdminDashboard" />
        )
    );
    
    
                
}