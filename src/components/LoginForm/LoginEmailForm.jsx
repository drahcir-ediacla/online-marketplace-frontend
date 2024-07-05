import React, { useState } from 'react'
import axios from "../../apicalls/axios";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
import LoginBtn from '../Button/LoginBtn'
import LogoGray from '../../assets/images/Yogeek-logo-gray.png'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'
import { useDispatch } from 'react-redux';
import { Setloader } from '../../redux/reducer/loadersSlice';
import AlertMessage from '../AlertMessage';

const LOGIN_URL = '/api/login';

const LoginEmailForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const validateForm = () => {
    let hasErrors = false;

    if (!email) {
      setEmailError('Email is required');
      hasErrors = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else {
      setPasswordError('');
    }

    return !hasErrors;
  };


  // LOCAL LOGIN METHOD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      dispatch(Setloader(true))
      const response = await axios.post(LOGIN_URL, {
        email,
        password,
      });
      dispatch(Setloader(false))

      console.log('Login successful', response.data);
      document.cookie = `jwt=${response.data.accessToken}; Max-Age=86400; Path=/`;
      document.cookie = `refreshJWT=${response.data.refreshToken}; Max-Age=86400; Path=/`;
      navigate('/');
    } catch (err) {
      dispatch(Setloader(false))
      // Handle login error based on the response from the backend.
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
      setShowAlert(true);
    }
  };

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setError('');
    setShowAlert(false);
  };



  //SOCIAL LOGIN REDIRECT PAGE
  // const redirectToUrl = (url) => {
  //   window.location.href = url;
  // };

  // const google = () => {
  //   redirectToUrl("http://localhost:8081/auth/google");
  // };

  // const facebook = () => {
  //   redirectToUrl("http://localhost:8081/auth/facebook/callback");
  // };

  const google = () => {
    const BaseUrl = process.env.REACT_APP_BASE_URL;
    const googleAuthPath = '/auth/google';

    const googleCallback = `${BaseUrl}${googleAuthPath}`;

    window.open(googleCallback, '_self');
  };

  const facebook = () => {
    const BaseUrl = process.env.REACT_APP_BASE_URL;
    const facebookAuthPath = '/auth/facebook/callback';

    const facebookCallback = `${BaseUrl}${facebookAuthPath}`;

    window.open(facebookCallback, '_self');
  };



  return (
    <>
      {showAlert && <AlertMessage type="error" message={error} />}
      <div className='login-form-container'>
        <form className='login-form' onSubmit={handleSubmit}>
          <div className='row1'>
            <div className="col1"><Link to="/"><img src={LogoGray} alt="" /></Link></div>
            <div className="col2">Sign in to Yogeek or <Link to="/RegisterByEmail">create an account</Link></div>
          </div>
          {/* {error && <p className='error-msg'>{error}</p>} */}

          <div className='row2'>
            <div className='col1'><b>Email</b><Link to="/LoginPhone">Sign in with phone number</Link></div>
            <div className='col2'>
              <input
                type="email"
                placeholder='Enter your email'
                value={email}
                className='input-email'
                onChange={handleEmailChange}
                onFocus={clearErrors}
              />
              {emailError && <div className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {emailError}</div>}
            </div>
          </div>
          <div className='row3'>
            <div className='col1'><b>Password</b><Link to="/ResetByEmail">Forgot the password?</Link></div>
            <div className='col2'>
              <input
                type="password"
                placeholder='Enter your password'
                value={password}
                onChange={handlePasswordChange}
                onFocus={clearErrors}
              />
              {passwordError && <div className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {passwordError}</div>}
            </div>
          </div>
          <div className='row4'><LoginBtn type='submit' label="Continue" className='continue-btn' onClick={() => setShowAlert(false)} /></div>
        </form>
        <div className='row5'><div className='horizontal-line'></div><small>or</small><div className='horizontal-line'></div></div>
        <div className='row6'><LoginBtn icon={<FBIcon />} label='Continue with Facebook' className='facebook-btn' IconclassName='fb-icon' onClick={facebook} /></div>
        <div className='row7'><LoginBtn icon={<GoogleIcon />} label='Continue with Google' className='google-btn' IconclassName='google-icon' onClick={google} /></div>
        <div className='row8'><small>By continuing, you agree to Yogeek <Link to="#">Conditions of Use</Link> and <Link to="#">Privacy Notice</Link>.</small></div>
      </div>
    </>
  )
}

export default LoginEmailForm