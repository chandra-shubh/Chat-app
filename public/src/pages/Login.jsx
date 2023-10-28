import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from "styled-components"
import Logo from "../assets/logo.svg"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { loginRoutes } from '../utils/APIRoutes';

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    password: '',
  })

  const options = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  }

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate("/");
    }
  }, [])


  const handleOnChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const handleValidation = () => {
    const { password, username } = values;

    if (password.length < 6) {
      toast.error("Password must be atleast 6 characters", options);
      return false;
    }
    else if (username.length < 3) {
      toast.error("Username must be atleast 3 characters", options);
      return false;
    }
    else {
      return true;
    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { password, username } = values;

      try {

        const { data } = await axios.post(loginRoutes, {
          username, password
        });

      

        if (data.status === false) {
          toast.error(data.msg, options);
        }

        if (data.status === true) {
          localStorage.setItem('chat-app-user', JSON.stringify(data));
          navigate('/');
        }

      } catch (error) {
        console.error("Error during login:", error);
        toast.error("An error occurred during login. Please try again later.", options);
      }


    }

  }


  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="Mylogo" />
            <h1>CHAT-APP</h1>
          </div>
          <input type="text" placeholder='Username' name='username' onChange={(e) => handleOnChange(e)} required />
          <input type="password" placeholder='Password' name='password' onChange={(e) => handleOnChange(e)} required />

          <button type="submit">Login</button>
          <span>
            Don't have an account <Link to="/register">REGISTER</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}
const FormContainer = styled.div`
    height : 100vh;
    width : 100vw;
    display : flex;
    flex-direction : column;
    justify-content : center;
    gap : 1rem;
    align-items : center;
    background-color : #116466;
    .brand{
        display : flex;
        align-items : center;
        gap : 1rem;
        justify-content : center;
        img{
            height : 5rem;
        }
        h1{
            color : black;
            text-transform : uppercase;
            }
    }
    form{
        display : flex;
        flex-direction : column;
        gap : 2rem;
        background-color : #2C3531;
        border-radius : 2rem;
        padding : 1rem 4rem;
        input{
            background-color : transparent;
            padding : 1rem;
            border : 0.1rem solid black;
            border-radius : 0.4rem;
            color : black;
            width : 100%;
            font-size : 1rem;
            &:focus{
                border : 0.1rem solid #997af0;
                outline : none;
            } 
        }
        button {
            background-color: #a67f78;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            &:hover {
            background-color: #4e0eff;
            }
        }
        span {
            color: white;
            text-transform: uppercase;
            a {
            color: #4e0eff;
            text-decoration: none;
            font-weight: bold;
            }
        }
    }

`;
export default Login;