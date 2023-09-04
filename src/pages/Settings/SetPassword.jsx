import React from 'react';
import './style.scss'
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import ManageAccountNav from '../../layouts/ManageAccountNav';
import Input from '../../components/FormField/Input'
import BtnGreen from '../../components/Button/BtnGreen'

const SetPassword = () => {
    return (
        <>
            <Header />
            <div className="set-password-body">
                <div className="container">
                    <h3>Manage Account</h3>
                    <div className="box">
                        <div className="col-left"><ManageAccountNav /></div>
                        <div className="col-right">
                            <form className='set-password-form'>
                                <span>SET PASSWORD</span>
                                <hr />
                                <div className='form-field'>
                                    <span>Old Password <span className='asterisk'>*</span></span>
                                    <Input type="password" className="password-input-field" />
                                </div>
                                <div className='form-field'>
                                    <span>New Password <span className='asterisk'>*</span></span>
                                    <Input type="password" className="password-input-field" />
                                </div>
                                <div className='form-field'>
                                    <span>Confirm Password <span className='asterisk'>*</span></span>
                                    <Input type="password" className="password-input-field" />
                                </div>
                                <div><BtnGreen label="Save Changes" /></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}


export default SetPassword;