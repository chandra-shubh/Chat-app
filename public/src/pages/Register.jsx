import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { registerRoute } from '../utils/APIRoutes';

const Register = () => {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate("/");
        }
    }, []);

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;

        if (password !== confirmPassword) {
            toast.error("PASSWORD AND CONFIRM PASSWORD SHOULD BE SAME !!!",
                toastOptions,
            );
            return false;
        } else if (username.length < 4) {
            toast.error("USERNAME SHOULD BE GREATER THAN 6 CHARACTERS",
                toastOptions,
            );
            return false;
        } else if (password.length < 6) {
            toast.error("PASSWORD SHOULD BE GREATER THAN 6 CHARACTERS",
                toastOptions,
            );
            return false;
        } else if (email === "") {
            toast.error("EMAIL IS REQUIRED",
                toastOptions,
            );
            return false;
        }
        else {
            return true;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
         
            const { password, username, email } = values;
            try {

                const { data } = await axios.post(registerRoute, {
                    username,
                    email,
                    password,
                });

                if (data.status === false) {
                    toast.error(data.message, toastOptions);
                }
                else {
                    //pass user inf to local storage and then navigate to the chat container

                    localStorage.setItem('chat-app-user', JSON.stringify(data.user))
                    navigate("/");
                }
            } catch (error) {
                console.error("Error during registration:", error);
                toast.error("An error occurred during registration. Please try again later.", toastOptions);
            }

        }

    };






    return (
        <>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo" />
                        <h1>CHAT APP</h1>
                    </div>
                    <input type="text" placeholder="USERNAME" name="username" onChange={(e) => handleChange(e)} required />
                    <input type="email" placeholder="EMAIL" name="email" onChange={(e) => handleChange(e)} required />
                    <input type="password" placeholder="PASSWORD" name="password" onChange={(e) => handleChange(e)} required />
                    <input type="password" placeholder="CONFIRM PASSWORD" name="confirmPassword" onChange={(e) => handleChange(e)} required />

                    <button type="submit" >CREATE USER</button>
                    <span>
                        ALREADY HAVE AN ACCOUNT ? <Link to="/login">LOGIN</Link>
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
export default Register