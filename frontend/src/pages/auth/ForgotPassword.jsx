import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // For toast notifications
import { axiosInstance } from '../../lib/axios';
import {useNavigate} from "react-router-dom";

const ResetPasswordForm = () => {
  const [otp, setOtp] = useState('');
  const [Password, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mailError, setMailError] = useState('');
  const [error, setError] = useState('');
  const [gotEmail , setGotEmail]= useState(false);
  const [email , setEmail] = useState('');
  const navigate = useNavigate();

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if OTP and password are valid
    if (!otp || !Password) {
      setError('Please fill all fields.');
      setLoading(false);
      return;
    }

    try {
      const data = {otp , password : Password,  email }
      const response = await axiosInstance.post('/auth/update-password', data );
      toast.success(response.data.message || 'Password reset successfully!');
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }

    setLoading(false);
  };

  const sendOTP = async()=>{

    const userEmail = document.querySelector('#email').value;
    // alert(userEmail);
    setEmail(userEmail);
    setGotEmail(true);  
    try {
      const response = await axiosInstance.post(`/auth/forgot-password` ,{userEmail});
      console.log(response.data);
      toast.success("otp sent");
    } catch (error) {
      toast.error("couldnt send otp");   
      setGotEmail(false);  
       
    }
    toast(
      "we have sent an OTP to your registerd Email .",{duration: 2000,}
    ); 
  }

  if(!gotEmail){
    return(
        <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Forgot Password</h2>
            <form >
              {/* OTP Input */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your Email"
                  required
                />
              </div>

              {/* Display error message */}
              {mailError && <div className="alert alert-danger">{mailError}</div>}

              {/* Submit Button */}
              <div className="d-grid">
                {/* <button type="submit" className="btn bg-primary btn-primary" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button> */}
                <button onClick={sendOTP} className="btn bg-primary btn-primary" >Get OTP</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Reset Your Password</h2>
            <form onSubmit={handleSubmit}>
              {/* OTP Input */}
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  className="form-control"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter your OTP"
                  required
                />
              </div>

              {/* New Password Input */}
              <div className="mb-3">
                <label htmlFor="Password" className="form-label">New Password</label>
                <input
                  type="password"
                  id="Password"
                  name="Password"
                  className="form-control"
                  value={Password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  required
                />
              </div>

              {/* Display error message */}
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Submit Button */}
              <div className="d-grid">
                <button type="submit" className="btn bg-primary btn-primary" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
