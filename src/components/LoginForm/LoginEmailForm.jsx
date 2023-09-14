import React, { useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import './style.scss'
import LoginBtn from '../Button/LoginBtn'
import LogoGray from '../../assets/images/Yogeek-logo-gray.png'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'

const LOGIN_URL = '/api/login';

const LoginEmailForm = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, {
        email,
        password,
      });

      // If login is successful, you can handle the success here, e.g., redirect to a dashboard.
      console.log('Login successful', response.data);
    } catch (err) {
      // Handle login error based on the response from the backend.
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  //SOCIAL LOGIN POPUP WINDOW
  const openPopup = (url, width, height) => {
    const left = window.innerWidth / 2 - width / 2 + window.screenX;
    const top = window.innerHeight / 2 - height / 2 + window.screenY;
  
    window.open(
      url,
      "_blank",
      `width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };
  
  const google = () => {
    openPopup("http://localhost:8081/auth/google", 600, 400);
  };
  
  const facebook = () => {
    openPopup("http://localhost:8081/auth/facebook", 600, 400);
  };

  return (
    <>
      <form className='login-form' onSubmit={handleSubmit}>
        <div className='row1'>
          <div className="col1"><Link to="/"><img src={LogoGray} alt="" /></Link></div>
          <div className="col2">Sign in to Yogeek or <Link to="/RegisterByEmail">create an account</Link></div>
        </div>
        {error && <p>{error}</p>}
        <div className='row2'>
          <div className='col1'><b>Email</b><Link to="/LoginPhone">Sign in with phone number</Link></div>
          <div className='col2'>
            <input 
              type="text" 
              placeholder='Enter your email' 
              value={email} 
              onChange={handleEmailChange} 
              />
          </div>
        </div>
        <div className='row3'>
          <div className='col1'><b>Password</b><Link to="/ResetByEmail">Forgot the password?</Link></div>
          <div className='col2'>
            <input 
              type="text" 
              placeholder='Enter your password'
              value={password} 
              onChange={handlePasswordChange} 
              />
          </div>
        </div>
        <div className='row4'><LoginBtn type='submit' label="Continue" className='continue-btn' /></div>
        <div className='row5'><div className='horizontal-line'></div><small>or</small><div className='horizontal-line'></div></div>
        <div className='row6'><LoginBtn icon={<FBIcon />} label='Continue with Facebook' className='facebook-btn' IconclassName='fb-icon' onClick={facebook} /></div>
        <div className='row7'><LoginBtn icon={<GoogleIcon />} label='Continue with Google' className='google-btn' IconclassName='google-icon' onClick={google} /></div>
        <div className='row8'><small>By continuing, you agree to Yogeek <Link to="#">Conditions of Use</Link> and <Link to="#">Privacy Notice</Link>.</small></div>
      </form>
    </>
  )
}

export default LoginEmailForm
