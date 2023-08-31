import React from 'react'
import RegisterByPhoneForm from '../../../components/RegisterAccountForm/RegisterByPhoneForm'
import LoginFooter from '../../../layouts/LoginFooter'

const RegisterByPhone = () => {
  return (
    <>
        <div className='form-body'>
        <div className="container form-box">
            <RegisterByPhoneForm />
        </div>
        <LoginFooter />
        </div>
    </>
  )
}

export default RegisterByPhone
