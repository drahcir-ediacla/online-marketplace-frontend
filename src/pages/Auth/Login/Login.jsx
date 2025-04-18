import React from 'react'
import LoginEmailForm from '../../../components/LoginForm/LoginEmailForm'
import LoginFooter from '../../../layouts/LoginFooter'
import './style.scss'

const Login = () => {
  return (
    <>
      <div className='form-body'>
        <div className="container">
          <div className="form-box">
            <LoginEmailForm />
          </div>
        </div>
        <LoginFooter />
      </div>
    </>
  )
}

export default Login
