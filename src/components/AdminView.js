import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import AddProduct from '../pages/AddProduct';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';

export default function AdminView({ productsData, fetchData }) {


    const [products, setProducts] = useState([])

    useEffect(() => {

        const productsArr = productsData.map(product => {
            return (
                <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td className={product.isActive ? "text-success" : "text-danger"}>
                        {product.isActive ? "Available" : "Unavailable"}
                    </td>
                   <td className="text-center">
                        <EditProduct product = {product} fetchData = {fetchData}/>
                    </td>
                    <td><ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData}/></td>
                </tr>
                )
        })

        setProducts(productsArr)

    }, [productsData])

	    return(
        <>
            <h1 className="text-center my-4"> Admin Dashboard</h1>

            <AddProduct fetchData={fetchData}/>
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products}
                </tbody>
            </Table>    
        </>

        )
}