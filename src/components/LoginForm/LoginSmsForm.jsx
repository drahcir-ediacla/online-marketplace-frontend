import React, { useRef, useState, useEffect } from 'react'
import axios from '../../apicalls/axios'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginBtn from '../Button/LoginBtn'
import LogoGray from '../../assets/images/Yogeek-logo.png'
import BtnClear from '../../components/Button/BtnClear'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'
import { ReactComponent as SendOtpSpinner } from '../../assets/images/loading-spinner.svg'
import { useDispatch } from 'react-redux';
import { Setloader } from '../../redux/reducer/loadersSlice';
import AlertMessage from '../AlertMessage';

const PHONE_REGEX = /^\d{10}$/;

const LoginSmsForm = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const errRef = useRef();

  const [phone, setPhone] = useState('');
  const [validPhone, setValidPhone] = useState(false)
  const [phoneFocus, setPhoneFocus] = useState(false)

  const [otp, setOtp] = useState('')
  const [validOtp, setValidOtp] = useState(false);

  const [otpError, setOtpError] = useState('');
  const [phoneError, setPhoneError] = useState('')

  const [errMsg, setErrMsg] = useState('');

  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSpinner, setOtpSpinner] = useState(false);

  const [resendOTP, setResendOTP] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    const result = PHONE_REGEX.test(phone)
    setValidPhone(result);
  }, [phone])

  useEffect(() => {
    setValidOtp(otp.length > 0)
  }, [otp])

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => {
        setOtpTimer(otpTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let hasErrors = false;

    if (!phone) {
      setPhoneError('Phone Number is required');
      hasErrors = true;
    } else {
      setPhoneError('');
    }

    if (!otp) {
      setOtpError('Verification code is required');
      hasErrors = true;
    } else {
      setOtpError('');
    }

    return !hasErrors;
  };


  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
  });

  const sendOTPCode = async (e) => {
    e.preventDefault();

    try {
      setShowAlert(false);
      setOtpSpinner(true)
      const response = await axios.post('/api/send-login-otp', formData)

      if (response.status === 201) {
        setOtpSpinner(false)
        setResendOTP(true)
        setOtpTimer(120); // Start the OTP expiration timer
      }

    } catch (err) {
      if (err.response.status === 404) {
        setErrMsg('Phone not found.')
        setOtpSpinner(false)
        setShowAlert(true);
      }
    }
  }


  const veridyAndLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      dispatch(Setloader(true))
      const response = await axios.post('/api/login-verify-otp', formData);
      dispatch(Setloader(false))

      console.log('Login successful', response.data);
      document.cookie = `jwt=${response.data.accessToken}; Path=/`;
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
    setOtpError('');
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
        <form className='login-form' onSubmit={veridyAndLogin}>
          <div className='row1'>
            <div className="col1"><Link to="/"><img src={LogoGray} alt="" className='auth-form-logo' /></Link></div>
            <div className="col2">Sign in to Yogeek or <Link to="/RegisterByEmail">create an account</Link></div>
          </div>
          <div className='row2'>
            <div className='col1'>
              <label htmlFor='phoneNumber'>
                Phone Number
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
              <b>Verification Code</b>
              <Link to="/ResetByEmail">Forgot the password?</Link>
            </div>
            <div className='col2'>
              <input
                type="text"
                placeholder='Enter the verification code'
                name="otp"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  handleChange(e);
                }}
                onFocus={clearErrors}
              />
              {otpError && <div className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {otpError}</div>}
              {otpTimer > 0 && (
                <div className='instructions'>
                  <span>OTP sent to your phone number expires in: {otpTimer}s</span>
                </div>
              )}
              {otpSpinner ? (
                <div className='send-otp-spinner'>
                  <SendOtpSpinner />
                </div>
              ) : (
                <>
                  <BtnClear type="button" label={!resendOTP ? 'Send Code' : 'Resend Code'} onClick={sendOTPCode} className='send-code' disabled={!validPhone || otpTimer} />
                </>
              )}
            </div>
            <div className='col3'><small><Link to="/LoginPhone">Sign in with password</Link></small></div>
          </div>
          <div className='row4'><LoginBtn onClick={() => setShowAlert(false)} label="Continue" className='continue-btn' /></div>
        </form>
        <div className='row5'><div className='horizontal-line'></div><small>or</small><div className='horizontal-line'></div></div>
        <div className='row6'><LoginBtn icon={<FBIcon />} label='Continue with Facebook' className='facebook-btn' IconclassName='fb-icon' onClick={facebook} /></div>
        <div className='row7'><LoginBtn icon={<GoogleIcon />} label='Continue with Google' className='google-btn' IconclassName='google-icon' onClick={google} /></div>
        <div className='row8'><small>By continuing, you agree to Yogeek <Link to="#">Conditions of Use</Link> and <Link to="#">Privacy Notice</Link>.</small></div>
      </div>
    </>
  )
}

export default LoginSmsForm
