import {Button, Form} from 'react-bootstrap';
import {useState, useEffect, useContext} from 'react';
import {Navigate} from 'react-router-dom';

import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';

export default function Register(){
	const {user} = useContext(UserContext);

	const notyf = new Notyf();

	// State hooks to store the values of the input fields:
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [mobileNo, setMobileNo] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	//this state will determine whether the register button is enabled or not
	const [isActive, setIsActive] = useState(false);

	// useEffect - side effect wherein it triggers function whenever the component is rendered or the state of a monitored state changed.
	//it has 2 arguments
	//function - represents the side effect you want to perform. This will be executed when the component is rendered.
	//dependency - optional. The effect will run when there are achanges in the component dependencies.

	// the side- effect will run automatically when the component is rendered
	// if the dependency array is empty, the side-effect will only run when the component is rendered:
		// Take note: that empty dependency array and no dependency array is different:

	// This useEffet will be used to activate and reactivate the register button
	useEffect(()=> {
		// What logic are we going to add so that we can activate and reactivate the the register button?
		if(firstName !== "" && lastName !== "" && email !== "" && mobileNo !== '' && password === confirmPassword  ){
			setIsActive(true);
		}else{
			setIsActive(false);
		}
		

	}, [firstName, lastName, email, mobileNo, password, confirmPassword])


	//Create a function that will be triggered when the register button is clicked:

	const registerUser = (event) => {
		// to prevent the page from refreshing during submission
		event.preventDefault();

		console.log("register button is clicked");

		// this will send a request to register a user in our API

		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
			method: 'POST',
			headers: {
				"Content-Type" : 'application/json'
			},
			body: JSON.stringify({
				firstName,
				lastName,
				email,
				mobileNo,
				password
			})
		})
		.then(response => response.json())
		.then(data => {
			
			if(data.message === 'Registered successfully'){
				setFirstName('');
				setLastName('');
				setEmail('');
				setMobileNo('');
				setPassword('');
				setConfirmPassword('');

				notyf.success("Registration successful!");

			} else if(data.message === "Email invalid"){

				notyf.error('Email is invalid');

			} else if (data.message === "Mobile number invalid"){

				notyf.error('Mobile number is invalid');

			} else if(data.message === "Password must be at least 8 characters long"){

				notyf.error("Password must be at least 8 characters");

			} else {

				notyf.error("Something went wrong!");
			}
			
		})

	}



	return (
		(user.id !== null) 
		?
		<Navigate to="/products" />
		:
		<Form className ="col-6 mx-auto" onSubmit = {event => registerUser(event)}>
			<h1 className = 'my-5 text-center'>Register</h1>

			<Form.Group className="mb-3">
		        <Form.Label>First Name:</Form.Label>
		        <Form.Control 
		        	type="text" 
		        	placeholder="Enter first name" 
		        	value = {firstName}
		        	onChange = {event => setFirstName(event.target.value)}
		        	required/>
		      </Form.Group>

		      <Form.Group className="mb-3">
		        <Form.Label>Last Name:</Form.Label>
		        <Form.Control 
		        	type="text" 
		        	placeholder="Enter last name" 
		        	value = {lastName}
		        	onChange = {event => setLastName(event.target.value)}
		        	required/>
		      </Form.Group>


		      <Form.Group className="mb-3" >
		        <Form.Label>Email address:</Form.Label>
		        <Form.Control 
		        	type="email" 
		        	placeholder="Enter email" 
		        	value = {email}
		        	onChange = {event => setEmail(event.target.value)}
		        	required/>
		      </Form.Group>

		      <Form.Group className="mb-3">
		        	<Form.Label>Mobile No:</Form.Label>
		        	<Form.Control 
		        		type="number" 
		        		placeholder="Enter 11 Digit no." 
		        		value = {mobileNo}
		        		onChange = {event => setMobileNo(event.target.value)}
		        		required/>
		       </Form.Group>


		      <Form.Group className="mb-3">
		        <Form.Label>Password:</Form.Label>
		        <Form.Control 
		        	type="password" 
		        	placeholder="Password (atleast 8 characters)" 
		        	value = {password}
		        	onChange = {event => setPassword(event.target.value)}
		        	required/>
		      </Form.Group>

		      <Form.Group className="mb-3">
		        <Form.Label>Confirm Password:</Form.Label>
		        <Form.Control 
		        	type="password" 
		        	placeholder="Confirm your Password" 
		        	value = {confirmPassword}
		        	onChange = {event => setConfirmPassword(event.target.value)}
		        	required/>
		      </Form.Group>

		      {
		      	isActive ?
		      		<Button variant="primary" type="submit">
		      		  Register
		      		</Button>
		      	:
		      		<Button variant="danger" type="submit" disabled>
		        		Register
		      		</Button>
		      }
		      
		      
		</Form>
		)
}