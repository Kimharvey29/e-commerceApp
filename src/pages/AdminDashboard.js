
import { useState, useEffect, useContext } from 'react';
import AdminView from '../components/AdminView';

import UserContext from '../context/UserContext';

export default function AdminDashboard() {

    const { user } = useContext(UserContext);

    const [products, setProducts] = useState([]);

    const fetchData = () => {
        let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/all`
        	: 
        	`${process.env.REACT_APP_API_BASE_URL}/products/active`;

        // Fetch courses
        fetch(fetchUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setProducts(data); // Sets the courses data
        });
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    return (
        <div>
            <AdminView productsData={products} fetchData={fetchData} />
        </div>

    )
}
