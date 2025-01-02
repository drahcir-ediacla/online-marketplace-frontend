import React, { useState, useEffect, useRef } from 'react'
import axios from "../../apicalls/axios";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
import LoginBtn from '../Button/LoginBtn'
import LogoGray from '../../assets/images/Yogeek-logo.png'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'
import { useDispatch } from 'react-redux';
import { Setloader } from '../../redux/reducer/loadersSlice';
import AlertMessage from '../AlertMessage';

const LOGIN_URL = '/api/login-email';
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const LoginEmailForm = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const errRef = useRef();
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const dispatch = useDispatch()

  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    const result = EMAIL_REGEX.test(email)
    setValidEmail(result);
  }, [email])

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
  const loginUser = async (e) => {
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
      document.cookie = `jwt=${response.data.accessToken}; Path=/`;
      document.cookie = `refreshJWT=${response.data.refreshToken}; Path=/`;
      navigate('/');
    } catch (err) {
      dispatch(Setloader(false))
      // Handle login error based on the response from the backend.
      if (err.response) {
        setErrMsg(err.response.data.message);
      } else {
        setErrMsg('An error occurred. Please try again later.');
      }
      setShowAlert(true);
    }
    if (errRef.current) {
      errRef.current.focus();
    }
  };

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setErrMsg('');
    setShowAlert(false);
  };


  const google = () => {
    const BaseUrl = process.env.REACT_APP_BASE_URL;
    const googleAuthPath = '/auth/google';

    const googleCallback = `${BaseUrl}${googleAuthPath}`;

    window.open(googleCallback, '_self');
  };

  const facebook = () => {
    const BaseUrl = process.env.REACT_APP_BASE_URL;
    const facebookAuthPath = '/auth/facebook';

    const facebookCallback = `${BaseUrl}${facebookAuthPath}`;

    window.open(facebookCallback, '_self');
  };



  return (
    <>
      {showAlert && <AlertMessage type="error" message={errMsg} />}
      <div className='login-form-container'>
        <form className='login-form' onSubmit={loginUser}>
          <div className='row1'>
            <div className="col1"><Link to="/"><img src={LogoGray} alt="" className='auth-form-logo' /></Link></div>
            <div className="col2">Sign in to Yogeek or <Link to="/RegisterByEmail">create an account</Link></div>
          </div>
          {/* {error && <p className='error-msg'>{error}</p>} */}

          <div className='row2'>
            <div className='col1'>
              <label htmlFor='emailAddress'>
                <b>Email</b>
                <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
              </label>
              <Link to="/LoginPhone">Sign in with phone number</Link></div>
            <div className='col2'>
              <input
                type="email"
                id="emailAddress"
                name="email"
                ref={emailRef}
                value={email}
                autoComplete="off"
                className='input-email'
                onChange={handleEmailChange}
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => { setEmailFocus(true); clearErrors(); }}
                onBlur={() => setEmailFocus(false)}
                placeholder='Enter your email address'
              />
              {emailError && <div className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {emailError}</div>}
              <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} color='red' />
                <span> Invalid email address format!</span>
              </p>
            </div>
          </div>
          <div className='row3'>
            <div className='col1'>
              <b>Password</b>
              <Link to="/ResetByEmail">Forgot the password?</Link></div>
            <div className='col2'>
              <input
                type="password"
                placeholder='Enter your password'
                className='input-password'
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
      {/* <div className='language-selector-container'><div className='globe-icon'><GlobeIcon /></div><GTranslate /></div> */}
    </>
  )
}

export default LoginEmailForm