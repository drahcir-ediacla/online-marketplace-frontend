import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import axios from '../../apicalls/axios';
import './style.scss'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Setloader } from '../../redux/reducer/loadersSlice';
import LogoGray from '../../assets/images/Yogeek-logo-gray.png'
import LoginBtn from '../../components/Button/LoginBtn'
import BtnClear from '../../components/Button/BtnClear'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'
import { ReactComponent as SendOtpSpinner } from '../../assets/images/loading-spinner.svg'
import AlertMessage from '../AlertMessage';

const PHONE_REGEX = /^\d{10}$/;
const PWD_REGEX = /^.{8,24}$/;

const RegisterByPhoneForm = () => {

  const [showAlert, setShowAlert] = useState(false);
  const errRef = useRef();

  const [phone, setPhone] = useState('');
  const [validPhone, setValidPhone] = useState(false)
  const [phoneFocus, setPhoneFocus] = useState(false)

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

  const dispatch = useDispatch()

  useEffect(() => {
    const result = PHONE_REGEX.test(phone)
    setValidPhone(result);
  }, [phone])

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
  }, [pwd, matchPwd])

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
    phone: '',
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
      const response = await axios.post('/api/send-phone-registration-otp', formData)

      if (response.status === 201) {
        setOtpSpinner(false)
        setOtpTimer(120); // Start the OTP expiration timer
      }

    } catch (err) {
      if (err.response.status === 409) {
        setErrMsg('Account already exists for this phone number.')
        setSuccess(false);
        setOtpSpinner(false)
        setShowAlert(true);
      }
    }
  }


  const createAccount = async (e) => {
    e.preventDefault();

    // if button enabled with JS hack
    const isPasswordValid = PWD_REGEX.test(pwd);
    if (!isPasswordValid) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      dispatch(Setloader(true))
      const response = await axios.put('/api/phone-register', formData);

      if (response.status === 201) {
        dispatch(Setloader(false))
        // User registration was successful
        setSuccess(true);
        // Clear state and controlled inputs
        // Need value attrib on inputs for this
        setPhone('')
        setPwd('');
        setMatchPwd('');
        setOtp('');
      }
    } catch (err) {
      dispatch(Setloader(false))
      let errorMessage = 'An error occurred during registration';

      if (err.response) {
        switch (err.response.status) {
          case 409:
            errorMessage = 'Account already exists for this phone number.';
            break;
          case 401:
            errorMessage = 'Invalid or expired verification code.';
            break;
          case 404:
            errorMessage = 'Invalid verification code.';
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

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <Link to="/LoginEmail">Sign In</Link>
          </p>
        </section>
      ) : (
        <>{showAlert && <AlertMessage type="error" message={errMsg} />}
          <div className='register-form-container'>
            <form className='register-form' onSubmit={createAccount}>
              <div className='row1'>
                <div className='col1'><Link to='/'><img src={LogoGray} alt="" /></Link></div>
                <div className='col2'><h4>Create an account</h4></div>
              </div>
              <div className='row2'>
                <div className='col1 input-container'>
                  <div className='row1'>
                    <label htmlFor='phoneNumber'>
                      Phone Number
                      <FontAwesomeIcon icon={faCheck} className={validPhone ? "valid" : "hide"} />
                      <FontAwesomeIcon icon={faTimes} className={validPhone || !phone ? "hide" : "invalid"} />
                    </label>
                    <Link to="/RegisterByEmail">Verify with email</Link></div>
                  <div className='row2'>
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
                      onFocus={() => setPhoneFocus(true)}
                      onBlur={() => setPhoneFocus(false)}
                      aria-invalid={validPhone ? "false" : "true"}
                      aria-describedby="uidnote"
                      required
                    />
                    <p id="uidnote" className={phoneFocus && phone && !validPhone ? "instructions" : "offscreen"}>
                      <FontAwesomeIcon icon={faInfoCircle} color='red' />
                      <span> Must be 10 digits</span>
                    </p>
                    <div className="plus63">+63</div></div>
                </div>
                <div className='col2 input-container'>
                  <div className='row1'><b>Verification Code</b></div>
                  <div className='row2'>
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
                    {otpTimer > 0 ? (
                      <div className='instructions'>
                        <span>OTP sent to your phone number expires in: {otpTimer}s</span>
                      </div>
                    ) : (otpSpinner ? (
                      <div className='send-otp-spinner'>
                        <SendOtpSpinner />
                      </div>
                    ) : (
                      <>
                        <BtnClear type="button" label='Send Code' onClick={sendOTPCode} className='send-code' disabled={!validPhone} />
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <div className='row3'>
                <div className='col1 input-container'>
                  <div className='row1'>
                    <label htmlFor="password">Password
                      <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                      <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                    </label>
                  </div>
                  <div className='row2'>
                    <input
                      type="password"
                      id="password"
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
                      placeholder='Enter your password'
                    />
                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <span> Must be 8 to 24 characters.</span>
                    </p>
                  </div>
                </div>
                <div className='col2 input-container'>
                  <div className='row1'>
                    <label htmlFor="confirm_pwd">
                      Confirm Password
                      <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                      <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    </label>
                  </div>
                  <div className='row2'>
                    <input
                      type="password"
                      id="confirm_pwd"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      value={matchPwd}

                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      placeholder='Re-enter your password'
                    />
                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <span> Must match the first password input field.</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className='row4'><LoginBtn onClick={() => setShowAlert(false)} label="Continue" className='reset-pswrd-btn' disabled={!validPhone || !validOtp || !validPwd || !validMatch} /></div>
            </form>
            <div className='row5'><div className='horizontal-line'></div><small>or</small><div className='horizontal-line'></div></div>
            <div className='row6'><LoginBtn icon={<FBIcon />} label='Continue with Facebook' className='facebook-btn' IconclassName='fb-icon' onClick={facebook} /></div>
            <div className='row7'><LoginBtn icon={<GoogleIcon />} label='Continue with Google' className='google-btn' IconclassName='google-icon' onClick={google} /></div>
            <div className='row8'><small>By continuing, you agree to Yogeek <Link to="#">Conditions of Use</Link> and <Link to="#">Privacy Notice</Link>.</small></div>
            <div className="row9"><small>Already have an account? <Link to="/LoginEmail">Sign in here!</Link></small></div>
          </div>
        </>
      )}
    </>

  )
}

export default RegisterByPhoneForm
