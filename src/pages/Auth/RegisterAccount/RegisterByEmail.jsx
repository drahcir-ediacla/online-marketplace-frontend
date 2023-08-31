import React from 'react'
import RegisterByEmailForm from '../../../components/RegisterAccountForm/RegisterByEmailForm'
import LoginFooter from '../../../layouts/LoginFooter'

const RegisterByEmail = () => {
  return (
    <>
      <div className='form-body'>
      <div className="container form-box">
        <RegisterByEmailForm />
      </div>
      <LoginFooter />
    </div>
    </>
  )
}

export default RegisterByEmail
