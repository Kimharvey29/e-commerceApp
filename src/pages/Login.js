
import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';

import {Notyf} from 'notyf';

import UserContext from '../context/UserContext';

export default function Login() {

    const {user, setUser} = useContext(UserContext);

    const notyf = new Notyf();

    // State hooks to store the values of the input fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        // Prevents page redirection via form submission
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email,
                password: password

            })
        })
        .then(res => res.json())
        .then(data => {

            if(data.access){

                // console.log(data.access);
                localStorage.setItem('token', data.access);

                retrieveUserDetails(data.access);

                // Clear input fields after submission
                setEmail('');
                setPassword('');



                notyf.success('Successful Login');
            
            } else if (data.message == "Email and password do not match") {

               notyf.error(`Incorrect credentials. Try again!`);

            } else {

                notyf.error(`${email} does not exist`);
            }

        })

    }

    function retrieveUserDetails(token){

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            )
        .then(response => response.json())
        .then(data => {

        console.log(data)

            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            })
        })
    }





    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);



    return ( 

        (user.id !== null)
            ?
            <Navigate to='/'/>
            :    
            <Form onSubmit={(e) => authenticate(e)}>
                <h1 className="my-5 text-center">Login</h1>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                { isActive ? 
                    <Button variant="primary" type="submit" id="loginBtn">
                        Login
                    </Button>
                    : 
                    <Button variant="danger" type="submit" id="loginBtn" disabled>
                        Login
                    </Button>
                }

                <p className="mx-auto py-3 text-center">
                  Don't have an account yet? <Link to="/register">Click here</Link> to register
                </p>

            </Form>       

            
    )
    
}