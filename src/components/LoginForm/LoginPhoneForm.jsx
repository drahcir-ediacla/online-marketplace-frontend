import React, { useState, useRef, useEffect } from 'react'
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

const PHONE_REGEX = /^\d{10}$/;

const LoginPhoneForm = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const errRef = useRef();

  const [phone, setPhone] = useState('');
  const [validPhone, setValidPhone] = useState(false)
  const [phoneFocus, setPhoneFocus] = useState(false)

  const [password, setPassword] = useState('')

  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('')

  const [errMsg, setErrMsg] = useState('');

  const dispatch = useDispatch()

  useEffect(() => {
    const result = PHONE_REGEX.test(phone)
    setValidPhone(result);
  }, [phone])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
  });


  const validateForm = () => {
    let hasErrors = false;

    if (!phone) {
      setPhoneError('Phone number is required.');
      hasErrors = true;
    } else {
      setPhoneError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasErrors = true;
    } else {
      setPasswordError('');
    }

    return !hasErrors;
  };


  const loginUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      dispatch(Setloader(true))
      const response = await axios.post('/api/login-phone', formData);
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
  }

  const clearErrors = () => {
    setPhoneError('');
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
    const facebookAuthPath = '/auth/facebook/callback';

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
          <div className='row2'>
            <div className='col1'>
              <label htmlFor='phoneNumber'>
                <b>Phone Number</b>
                <FontAwesomeIcon icon={faCheck} className={validPhone ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validPhone || !phone ? "hide" : "invalid"} />
              </label>
              <Link to="/LoginEmail">Sign in with email</Link></div>
            <div className='col2'>
              <input
                type="number"
                id='phoneNumber'
                name='phone'
                value={phone}
                placeholder='Enter your phone number'
                className='phone-number'
                onChange={(e) => {
                  setPhone(e.target.value);
                  handleChange(e);
                }}
                onFocus={() => { setPhoneFocus(true); clearErrors(); }}
                onBlur={() => setPhoneFocus(false)}
                aria-invalid={validPhone ? "false" : "true"}
                aria-describedby="uidnote"
              />
              {phoneError && <div className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {phoneError}</div>}
              <p id="uidnote" className={phoneFocus && phone && !validPhone ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} color='red' />
                <span> Phone number format must be 10 digits</span>
              </p>
              <div className="plus63">+63</div>
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
                name='password'
                className='input-password'
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleChange(e);
                }}
                onFocus={clearErrors}
              />
            </div>
            {passwordError && <div className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {passwordError}</div>}
            <div className='col3'><small><Link to="/LoginSMS">Sign in with SMS code</Link></small></div>
          </div>
          <div className='row4'><LoginBtn  onClick={() => setShowAlert(false)} label="Continue" className='continue-btn' /></div>
        </form>
        <div className='row5'><div className='horizontal-line'></div><small>or</small><div className='horizontal-line'></div></div>
        <div className='row6'><LoginBtn icon={<FBIcon />} label='Continue with Facebook' className='facebook-btn' IconclassName='fb-icon' onClick={facebook} /></div>
        <div className='row7'><LoginBtn icon={<GoogleIcon />} label='Continue with Google' className='google-btn' IconclassName='google-icon' onClick={google} /></div>
        <div className='row8'><small>By continuing, you agree to Yogeek <Link to="#">Conditions of Use</Link> and <Link to="#">Privacy Notice</Link>.</small></div>
      </div>
    </>
  )
}

export default LoginPhoneForm
