import React from 'react'
import ResetByEmailForm from '../../../components/ResetPasswordForm/ResetByEmailForm'
import LoginFooter from '../../../layouts/LoginFooter'
import './style.scss'

const ResetByEmail = () => {
  return (
    <>
    <div className='form-body'>
      <div className="container form-box">
        <ResetByEmailForm />
      </div>
      <LoginFooter />
    </div>
    </>
  )
}

export default ResetByEmail
