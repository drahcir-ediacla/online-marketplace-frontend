import React, { useRef, useState, useEffect } from 'react'
import axios from '../../apicalls/axios'
import { Link } from 'react-router-dom'
import './style.scss'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SuccessResetPassword from '../../components/Modal/SuccessResetPassword'
import LoginBtn from '../Button/LoginBtn'
import LogoGray from '../../assets/images/Yogeek-logo.png'
import BtnClear from '../../components/Button/BtnClear'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'
import { ReactComponent as SendOtpSpinner } from '../../assets/images/loading-spinner.svg'
import { useDispatch } from 'react-redux';
import { Setloader } from '../../redux/reducer/loadersSlice';
import AlertMessage from '../AlertMessage';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^.{8,24}$/;


const ResetByEmailForm = () => {

  const dispatch = useDispatch()

  const emailRef = useRef();
  const errRef = useRef();

  const [showAlert, setShowAlert] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [otp, setOtp] = useState('')
  const [validOtp, setValidOtp] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSpinner, setOtpSpinner] = useState(false);

  const [resendOTP, setResendOTP] = useState(false)

  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email])

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd, matchPwd])

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


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const sendOTPCode = async (e) => {
    e.preventDefault();
    try {
      setShowAlert(false);
      setOtpSpinner(true)
      const response = await axios.put('/api/reset-password-otp-email', formData)

      if (response.status === 201) {
        setOtpSpinner(false)
        setResendOTP(true)
        setOtpTimer(120); // Start the OTP expiration timer
      }

    } catch (err) {
      if (err.response.status === 404) {
        setErrMsg('Email not found.')
        setSuccess(false);
        setOtpSpinner(false)
        setShowAlert(true);
      }
    }
  }


  const resetPassword = async (e) => {
    e.preventDefault();

    // if button enabled with JS hack
    const isEmailValid = EMAIL_REGEX.test(email);
    const isPasswordValid = PWD_REGEX.test(pwd);
    if (!isEmailValid || !isPasswordValid) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      dispatch(Setloader(true))
      const response = await axios.put('/api/reset-password-email', formData);

      if (response.status === 201) {
        dispatch(Setloader(false))
        // User registration was successful
        setSuccess(true);
        // Clear state and controlled inputs
        // Need value attrib on inputs for this
        setEmail('');
        setPwd('');
        setMatchPwd('');
        setOtp('');
      }
    } catch (err) {
      dispatch(Setloader(false))
      let errorMessage = 'An error occurred during updating password';

      if (err.response) {
        switch (err.response.status) {
          case 404:
            errorMessage = 'Email not found.';
            break;
          case 401:
            errorMessage = 'Invalid or expired verification code.';
            break;
          default:
            console.error('Error:', err);
        }
      } else {
        console.error('Error:', err);
      }

      setSuccess(false);
      setErrMsg(errorMessage);
      setShowAlert(true);
    }
    if (errRef.current) {
      errRef.current.focus();
    }
  };

  //SOCIAL LOGIN REDIRECT PAGE
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

  const NavigateLogin = () => {
    console.log("Navigating to LoginPhone");
    window.location.href = '/LoginEmail';
  }

  return (
    <>
      {success && <SuccessResetPassword onClick={NavigateLogin} />}
      <>
        {showAlert && <AlertMessage type="error" message={errMsg} />}
        <div className="reset-form-container">
          <form className='reset-form' onSubmit={resetPassword}>
            <div className='row1'>
              <div className="col1"><Link to="/"><img src={LogoGray} alt="" className='auth-form-logo' /></Link></div>
              <div className="col2"><Link to="/LoginEmail">Sign in</Link> to Yogeek or <Link to="/RegisterByEmail">create an account</Link></div>
            </div>
            <div className='row2 input-container'>
              <div className='col1'>
                <label htmlFor='emailAddress'>
                  Email
                  <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                </label>
                {/* <Link to="/ResetByPhone">Reset with phone number</Link> */}
              </div>
              <div className='col2'>
                <input
                  type="text"
                  placeholder='Enter your email address'
                  id="emailAddress"
                  name="email"
                  className='input-email'
                  ref={emailRef}
                  autoComplete="off"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleChange(e); // Assuming handleChange is another function you want to call
                  }}
                  value={email}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} color='red' />
                  <span> Invalid email address format!</span>
                </p>
              </div>
            </div>
            <div className='row3 input-container'>
              <div className='col1'><b>Verification Code</b></div>
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
                />
                {otpTimer > 0 && (
                  <div className='instructions'>
                    <span>OTP sent to your email expires in: {otpTimer}s</span>
                  </div>
                )}
                {otpSpinner ? (
                  <div className='send-otp-spinner'>
                    <SendOtpSpinner />
                  </div>
                ) : (
                  <>
                    <BtnClear type="button" label={!resendOTP ? 'Send Code' : 'Resend Code'} onClick={sendOTPCode} className='send-code' disabled={!validEmail || otpTimer} />
                  </>
                )}
              </div>
            </div>
            <div className='row4 input-container'>
              <div className='col1'>
                <label htmlFor="password">New Password
                  <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </label>
              </div>
              <div className='col2'>
                <input
                  type="password"
                  id='password'
                  placeholder='Enter your new password'
                  name="password"
                  onChange={(e) => {
                    setPwd(e.target.value);
                    handleChange(e); // Assuming handleChange is another function you want to call
                  }}
                  value={pwd}

                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span> Must be 8 to 24 characters.</span>
                </p>
              </div>
            </div>
            <div className='row5 input-container'>
              <div className='col1'>
                <label htmlFor="confirm_pwd">
                  Confirm Password
                  <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                </label>
              </div>
              <div className='col2'>
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}

                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  placeholder='Re-enter your new password'
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span> Must match the first password input field.</span>
                </p>
              </div>
            </div>
            <div className='row6'><LoginBtn onClick={() => setShowAlert(false)} label="Reset Password" className='reset-btn' disabled={!validEmail || !validOtp || !validPwd || !validMatch} /></div>
          </form>
          <div className='row7'><div className='horizontal-line'></div><small>or</small><div className='horizontal-line'></div></div>
          <div className='row8'><LoginBtn icon={<FBIcon />} label='Continue with Facebook' className='facebook-btn' IconclassName='fb-icon' onClick={facebook} /></div>
          <div className='row9'><LoginBtn icon={<GoogleIcon />} label='Continue with Google' className='google-btn' IconclassName='google-icon' onClick={google} /></div>
          <div className='row10'><small>By continuing, you agree to Yogeek <Link to="#">Conditions of Use</Link> and <Link to="#">Privacy Notice</Link>.</small></div>
        </div>
      </>
    </>
  )
}

export default ResetByEmailForm
