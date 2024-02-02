import React from 'react'
import LoginPhoneForm from '../../../components/LoginForm/LoginPhoneForm'
import LoginFooter from '../../../layouts/LoginFooter'
import './style.scss'

const Login = () => {
  return (
    <>
      <div className='form-body'>
        <div className="container">
          <div className="form-box">
            <LoginPhoneForm />
          </div>
        </div>
        <LoginFooter />
      </div>
    </>
  )
}

export default Login
