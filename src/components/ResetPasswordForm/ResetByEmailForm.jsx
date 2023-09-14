import React from 'react'
import {Link} from 'react-router-dom'
import './style.scss'
import LoginBtn from '../Button/LoginBtn'
import LogoGray from '../../assets/images/Yogeek-logo-gray.png'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'


const ResetByEmailForm = () => {
  
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
    openPopup("https://yogeek-server.onrender.com/auth/google", 600, 400);
  };
  
  const facebook = () => {
    openPopup("https://yogeek-server.onrender.com/auth/facebook", 600, 400);
  };

  return (
    <>
      <form className='reset-form'>
        <div className='row1'>
          <div className="col1"><Link to="/"><img src={LogoGray} alt="" /></Link></div>
          <div className="col2"><Link to="/LoginEmail">Sign in</Link> to Yogeek or <Link to="/RegisterByEmail">create an account</Link></div>
        </div>
        <div className='row2 input-container'>
          <div className='col1'><b>Email</b><Link to="/ResetByPhone">Reset with phone number</Link></div>
          <div className='col2'><input type="text" placeholder='Enter your email address' /></div>
        </div>
        <div className='row3 input-container'>
          <div className='col1'><b>Verification Code</b></div>
          <div className='col2'><input type="text" placeholder='Enter the verification code' /><div className="send-code"><Link to="#">Send Code</Link></div></div>
        </div>
        <div className='row4 input-container'>
          <div className='col1'><b>New Password</b></div>
          <div className='col2'><input type="text" placeholder='Enter your new password' /></div>
        </div>
        <div className='row5 input-container'>
          <div className='col1'><b>Confirm Password</b></div>
          <div className='col2'><input type="text" placeholder='Confirm your new password' /></div>
        </div>
        <div className='row6'><LoginBtn label="Reset Password" className='continue-btn' /></div>
        <div className='row7'><div className='horizontal-line'></div><small>or</small><div className='horizontal-line'></div></div>
        <div className='row8'><LoginBtn icon={<FBIcon />} label='Continue with Facebook' className='facebook-btn' IconclassName='fb-icon' onClick={facebook} /></div>
        <div className='row9'><LoginBtn icon={<GoogleIcon />} label='Continue with Google' className='google-btn' IconclassName='google-icon' onClick={google} /></div>
        <div className='row10'><small>By continuing, you agree to Yogeek <Link to="#">Conditions of Use</Link> and <Link to="#">Privacy Notice</Link>.</small></div>
        
      </form>
    </>
  )
}

export default ResetByEmailForm
