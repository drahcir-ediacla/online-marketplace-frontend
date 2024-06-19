import React from 'react';
import './style.scss';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import ManageAccountNav from '../../layouts/ManageAccountNav'
import { ReactComponent as Tooltip } from '../../assets/images/tool-tip.svg';
import BtnGreen from '../../components/Button/BtnGreen'

const DeactivateAccount = () => {

    const openManageAccountNav = () => {
        window.location.href = '/manage-account'
      }

    return (
    <>
        <Header />
        <div className="deactivate-accnt-body">
            <div className="container">
                <h3>Settings</h3>
                <div className="box">
                    <div className="col-left"><ManageAccountNav /></div>
                    <div className="col-right">
                        <div className="accnt-deactivation-content">
                            <div className="row1">
                                <div className='label-btn'>
                                    <div className="back-arrow" onClick={openManageAccountNav}></div>
                                    <span>ACCOUNT DEACTIVATION</span>
                                </div>
                                <div>
                                    <span>What happens when you deactivate your account?</span>
                                    <ul className="accnt-deactivation-info">
                                        <li>Your profile and Listings won't be shown on Buy & Sell anymore. <Tooltip /></li>
                                        <li>Active orders will be cancelled. <Tooltip /></li>
                                        <li>You won't be able to re-activate your Account.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row2"><BtnGreen label="Deactivate Account" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>
    )
}

export default DeactivateAccount;