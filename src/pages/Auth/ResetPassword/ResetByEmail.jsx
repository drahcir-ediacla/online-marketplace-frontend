import React from 'react'
import ResetByEmailForm from '../../../components/ResetPasswordForm/ResetByEmailForm'
import LoginFooter from '../../../layouts/LoginFooter'
import './style.scss'

const ResetByEmail = () => {
  return (
    <>
      <div className='form-body'>
        <div className='container'>
          <div className="form-box">
            <ResetByEmailForm />
          </div>
        </div>
        <LoginFooter />
      </div>
    </>
  )
}

export default ResetByEmail
