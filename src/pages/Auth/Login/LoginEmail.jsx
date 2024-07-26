import React from 'react'
import LoginEmailForm from '../../../components/LoginForm/LoginEmailForm'
import LoginFooter from '../../../layouts/LoginFooter'
import './style.scss'
import GTranslate from '../../../components/GTranslate'
import { ReactComponent as GlobeIcon } from '../../../assets/images/globe-regular.svg';

const Login = () => {
  return (
    <>
      <div className='form-body'>
        <div className="container">
          <div className="form-box">
            <LoginEmailForm />
          </div>
        </div>
        <div className='language-selector-container'><div className='globe-icon'><GlobeIcon /></div><GTranslate /></div>
        <LoginFooter />
      </div>
    </>
  )
}

export default Login
