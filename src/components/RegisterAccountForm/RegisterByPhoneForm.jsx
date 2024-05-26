import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import LogoGray from '../../assets/images/Yogeek-logo-gray.png'
import LoginBtn from '../../components/Button/LoginBtn'
import BtnClear from '../../components/Button/BtnClear'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'

const RegisterByPhoneForm = () => {

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
      <div className='register-form-container'>
        <form className='register-form'>
          <div className='row1'>
            <div className='col1'><Link to='/'><img src={LogoGray} alt="" /></Link></div>
            <div className='col2'><h4>Create an account</h4></div>
          </div>
          <div className='row2'>
            <div className='col1 input-container'>
              <div className='row1'><b>Phone Number</b><Link to="/RegisterByEmail">Verify with email</Link></div>
              <div className='row2'><input type="text" placeholder='Enter your phone number' className='phone-number' /><div className="plus63">+63</div></div>
            </div>
            <div className='col2 input-container'>
              <div className='row1'><b>Verification Code</b></div>
              <div className='row2'><input type="text" placeholder='Enter the verification code' /><BtnClear label='Send Code' className='send-code' disabled /></div>
            </div>
          </div>
          <div className='row3'>
            <div className='col1 input-container'>
              <div className='row1'><b>Password</b></div>
              <div className='row2'><input type="text" placeholder='Enter your password' /></div>
            </div>
            <div className='col2 input-container'>
              <div className='row1'><b>Confirm Password</b></div>
              <div className='row2'><input type="text" placeholder='Re-enter your password' /></div>
            </div>
          </div>
          <div className='row4'><LoginBtn label="Continue" className='reset-pswrd-btn' /></div>
        </form>
        <div className='row5'><div className='horizontal-line'></div><small>or</small><div className='horizontal-line'></div></div>
        <div className='row6'><LoginBtn icon={<FBIcon />} label='Continue with Facebook' className='facebook-btn' IconclassName='fb-icon' onClick={facebook} /></div>
        <div className='row7'><LoginBtn icon={<GoogleIcon />} label='Continue with Google' className='google-btn' IconclassName='google-icon' onClick={google} /></div>
        <div className='row8'><small>By continuing, you agree to Yogeek <Link to="#">Conditions of Use</Link> and <Link to="#">Privacy Notice</Link>.</small></div>
        <div className="row9"><small>Already have an account? <Link to="/LoginEmail">Sign in here!</Link></small></div>
      </div>
    </>
  )
}

export default RegisterByPhoneForm
