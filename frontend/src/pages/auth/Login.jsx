import React, { useState } from 'react';
import axios from 'axios';
import {axiosInstance} from "../../lib/axios.js";
import './Login.css'; // Custom styles
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-hot-toast";
import Cookies from 'js-cookie';
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode";


const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
 
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const toggleForm = () => {
        setIsSignUp(!isSignUp)
    };
    
    

    const handleSignUp = async (e) => {
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        try {
            const response = await axiosInstance.post("/auth/signup", userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Sign up successful');
            loginMutation({ email, password });
            console.log('Sign up successful:', response.data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error in sign up: ' + error.response.data.message);
        }
    };

    const { mutate: loginMutation, isLoading } = useMutation({
        mutationFn: async (userData) => {
            const response = await axiosInstance.post("/auth/login", userData);
            localStorage.setItem('logedinUser', JSON.stringify(response.data));
            return response.data; // Ensure you return the response data
        },
        onSuccess: async (data) => { // Use the data from the mutation
            const token = data.token;
            let bool = data.user.interest.length;
            Cookies.set('jwt-connectpro', token, { expires: 7, secure: false }); // Set secure to false for local testing
            toast.success("Login success.");
            if(bool == 0 ){
                navigate('/profile-setup');
                await queryClient.invalidateQueries('authUser');
            }else{
                navigate('/home'); // Navigate after successful login
            }
            await queryClient.invalidateQueries('authUser');
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Something went wrong");
        },
    });

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation({ email, password });
    };

    const forgotPassword = () => {
        navigate('/forgot-password')
    };

    const signUpDetails = async(data)=>{
        const {email,sub} = data
        console.log(email , sub);
        const userData = {
            email :email,
            password :sub,
        };
        const password = sub;
        // console.log(userData);
        try {
            const response = await axiosInstance.post("/auth/signup", userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Sign up successful');
            // console.log('Sign up successful:', response.data);
            // firstLogin = true;
            loginMutation({ email, password });
        } catch (error) {
            console.error('Error:', error);
            // toast.error('Error in sign up: ' + error.response.data.message);
        }
    }
    
  
    const loginDetails = async(data)=>{
        const {email,sub} = data
        console.log(email ,  sub);
        const password = sub;
        await loginMutation({ email, password });
    }
  

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center " style={{ height: "100vh", }}>
                <div className="justify-content-center align-items-center d-flex" style={{ height: "100vh" }}>
                    <img src='./images/logo.png' alt="Logo" width={"80%"} height={"10%"} />
                </div>
                <section className="forms-section">
                    <div className="forms">
                        <div className={`form-wrapper ${isSignUp ? '' : 'is-active'}`}>
                            <button type="button" className="switcher switcher-login bg-transparent " onClick={toggleForm}>
                                Login
                                <span className="underline"></span>
                            </button>
                            <form className="form form-login">
                                <fieldset>
                                    <legend>Please, Enter your email and password for login.</legend>
                                    <div className="input-block">
                                        <label htmlFor="login-email">E-mail</label>
                                        <input id="login-email" type="email" required onChange={(event) => setEmail(event.target.value)} />
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="login-password">Password</label>
                                        <input id="login-password" type="password" required onChange={(event) => setPassword(event.target.value)} />
                                    </div>
                                    <p onClick={forgotPassword} className='text-primary cursor-pointer'>Forgot Password</p>
                                </fieldset>
                                <button type="submit" onClick={handleLogin} className="btn-login ">Login</button>
                            <div id="googleLoginDiv">
                                {!isSignUp ? (
                                <GoogleLogin
                                    onSuccess={(response) => {
                                    const data = jwtDecode(response.credential);
                                    loginDetails(data);
                                    }}
                                    onError={() => {
                                    console.log("Login fail");
                                    }}
                                />
                                ) : null}
                            </div>
                            </form>
                        </div>
                        <div className={`form-wrapper ${isSignUp ? 'is-active' : ''}`}>
                            <button type="button" className="switcher switcher-signup bg-transparent " onClick={toggleForm}>
                                Sign Up
                                <span className="underline"></span>
                            </button>
                            <form onSubmit={handleSignUp} className="form form-signup">
                                <fieldset>
                                    <legend>Please, enter your email, password and password confirmation for sign up.</legend>
                                 
                                    <div className="input-block">
                                        <label htmlFor="signup-email">E-mail</label>
                                        <input id="signup-email" type="email" required onChange={(event) => setEmail(event.target.value)} />
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="signup-password">Password</label>
                                        <input id="signup-password" type="password" required onChange={(event) => setPassword(event.target.value)} />
                                    </div>
                                </fieldset>
                                <button type="submit" className="btn-signup ">Sign Up</button>
                                <div id="googleSignUpDiv" >
                                {isSignUp ? (
                                    <GoogleLogin
                                        onSuccess={(response) => {
                                        const data = jwtDecode(response.credential);
                                        signUpDetails(data);
                                        }}
                                        onError={() => {
                                        console.log("Login fail");
                                        }}
                                    />
                                    ) : null}
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Login;
