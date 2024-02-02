import React from 'react'
import RegisterByPhoneForm from '../../../components/RegisterAccountForm/RegisterByPhoneForm'
import LoginFooter from '../../../layouts/LoginFooter'
import './style.scss'

const RegisterByPhone = () => {
  return (
    <>
      <div className='form-body'>
        <div className="container">
          <div className="form-box">
            <RegisterByPhoneForm />
          </div>
        </div>
        <LoginFooter />
      </div>
    </>
  )
}

export default RegisterByPhone