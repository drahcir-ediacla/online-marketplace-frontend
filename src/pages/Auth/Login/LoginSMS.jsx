import React from 'react'
import LoginSmsForm from '../../../components/LoginForm/LoginSmsForm'
import LoginFooter from '../../../layouts/LoginFooter'
import './style.scss'

const Login = () => {
  return (
    <>
    <div className='form-body'>
        <div className="container">
          <div className="form-box">
            <LoginSmsForm />
          </div>
        </div>
        <LoginFooter />
      </div>
    </>
  )
}

export default Login
