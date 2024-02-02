import React from 'react'
import RegisterByEmailForm from '../../../components/RegisterAccountForm/RegisterByEmailForm'
import LoginFooter from '../../../layouts/LoginFooter'
import './style.scss'

const RegisterByEmail = () => {
  return (
    <>
      <div className='form-body'>
        <div className="container">
          <div className="form-box">
            <RegisterByEmailForm />
          </div>
        </div>
        <LoginFooter />
      </div>
    </>
  )
}

export default RegisterByEmail
