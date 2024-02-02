import React from 'react'
import ResetByPhoneForm from '../../../components/ResetPasswordForm/ResetByPhoneForm'
import LoginFooter from '../../../layouts/LoginFooter'
import './style.scss'

const ResetByPhone = () => {
  return (
    <>
    <div className='form-body'>
        <div className='container'>
          <div className="form-box">
            <ResetByPhoneForm />
          </div>
        </div>
        <LoginFooter />
      </div>
    </>
  )
}

export default ResetByPhone
