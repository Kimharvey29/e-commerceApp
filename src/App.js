import AppNavBar from './components/AppNavBar';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Products from './pages/ProductsCatalog';
import ProductDetails from './components/ProductDetails';
import AdminDashboard from './pages/AdminDashboard'
import CartPage from './pages/CartView'

import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

import {useState, useEffect} from 'react';

function App() {
    // State hook for the user state is defined here to allow it to have a global scope
    // This can be achieve using react context
    //this will be used to store user information and will be used for validating if a user is logged in on the app or not.
    const [user, setUser] = useState({
      id: null,
      isAdmin: null
    })

    //function for clearing localstorage on logout
    function unsetUser(){
      localStorage.clear();
    }


    useEffect(()=> {
        //fetch to retrieve the user details
      
      if(localStorage.getItem('token')){
          fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then(response => response.json())
          .then(data => {
              console.log(data)
              if(data.user._id === undefined){
                setUser({
                  id:null,
                  isAdmin: null
                })
              }else{
                setUser({
                  id: data.user._id,
                  isAdmin: data.user.isAdmin
                })
              }
          })

      }else{
        setUser({
          id: null,
          isAdmin:null
        })
      }

    }, [])



  return (
    <>
        <UserProvider value = {{user, setUser, unsetUser}}>
            <Router>
              <AppNavBar/>
              <Container>
                <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/products" element={<Products/>} />
                  <Route path="/register" element={<Register/>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/adminDashboard" element={<AdminDashboard />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/products/:id" element={<ProductDetails/>} />
                  <Route path="/cart" element={<CartPage/>} />
                </Routes>
              </Container>
            </Router>
        </UserProvider>
    </>
  );
}

export default App;
