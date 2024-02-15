import React, { useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './style.scss'
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import ManageAccountNav from '../../layouts/ManageAccountNav';
import Input from '../../components/FormField/Input'
import BtnGreen from '../../components/Button/BtnGreen'

const SetPassword = () => {

    const PWD_REGEX = /^.{8,24}$/;

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

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
                                    <label htmlFor="password">
                                        New Password
                                        <span className='asterisk'>*</span>
                                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                        <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                                    </label>
                                    <Input
                                        type="password"
                                        id="password"
                                        name="password"
                                        onChange={(e) => {
                                            setPwd(e.target.value);
                                        }}
                                        value={pwd}
                                        aria-invalid={validPwd ? "false" : "true"}
                                        aria-describedby="pwdnote"
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                        className="password-input-field"
                                    />
                                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        <span> Must be 8 to 24 characters.</span>
                                    </p>
                                </div>
                                <div className='form-field'>
                                    <span>Confirm Password <span className='asterisk'>*</span></span>
                                    <Input
                                        type="password"
                                        className="password-input-field"
                                    />
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