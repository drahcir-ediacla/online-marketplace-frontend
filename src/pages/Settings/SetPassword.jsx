import React, { useState, useEffect } from 'react';
import axios from '../../apicalls/axios';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './style.scss'
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import ManageAccountNav from '../../layouts/ManageAccountNav';
import BtnGreen from '../../components/Button/BtnGreen'
import AlertMessage from '../../components/AlertMessage';

const SetPassword = () => {

    const PWD_REGEX = /^.{8,24}$/;

    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [oldPassword, setOldPassword] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [alertMsg, setAlertMsg] = useState('')


    useEffect(() => {
        const result = PWD_REGEX.test(newPassword);
        console.log(result);
        console.log(newPassword);
        setValidPwd(result);
        const match = newPassword === confirmPassword;
        setValidMatch(match);
    }, [oldPassword, newPassword, confirmPassword])


    const handleChangePassword = async (e) => {
        e.preventDefault();

        try {
            // Make API request to change the password
            const response = await axios.post('/verify/api/change-password', {
                oldPassword,
                newPassword,
            });

            // Log the entire response for debugging
            console.log('Server response:', response);

            // Handle the response from the server
            if (response.status === 200 && response.data.success) {

                setAlertMsg('Password changed successfully!');
                setSuccessAlert(true);
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }

        } catch (error) {
            // Log the catch error for debugging
            console.error('Error in catch block:', error);

            if (error.response?.status === 401) {
                setAlertMsg('Old password is incorrect.');
                setErrorAlert(true);
            } else {
                if (error.response?.status === 400) {
                    setAlertMsg('New password is required.');
                    setErrorAlert(true);
                } else {
                    // Show an alert for the catch error
                    setAlertMsg('An error occurred while changing the password.');
                    setErrorAlert(true);
                }
            }


        }
    };


    const openManageAccountNav = () => {
        window.location.href = '/manage-account'
    }

    return (
        <>{successAlert && <AlertMessage type='success' message={alertMsg} />}
            {errorAlert && <AlertMessage type='error' message={alertMsg} />}
            <Header />
            <div className="set-password-body">
                <div className="container">
                    <h3>Settings</h3>
                    <div className="box">
                        <div className="col-left"><ManageAccountNav /></div>
                        <div className="col-right">
                            <form className='set-password-form' onSubmit={handleChangePassword}>
                                <div className='label-btn'>
                                    <div className="back-arrow" onClick={openManageAccountNav}></div>
                                    <span>SET PASSWORD</span>
                                </div>
                                <hr />
                                <div className='form-field'>
                                    <label>Old Password <span className='asterisk'>*</span></label>
                                    <input
                                        type="password"
                                        className="password-input-field"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                                <div className='form-field'>
                                    <label htmlFor="password">
                                        New Password <span className='asterisk'>*</span>
                                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                        <FontAwesomeIcon icon={faTimes} className={validPwd || !newPassword ? "hide" : "invalid"} />
                                    </label>
                                    <div style={{ width: "100%", maxWidth: "557px" }}>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                            }}
                                            value={newPassword}
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
                                </div>
                                <div className='form-field'>
                                    <label htmlFor="confirm_pwd">
                                        Confirm Password <span className='asterisk'>*</span>
                                        <FontAwesomeIcon icon={faCheck} className={validMatch && confirmPassword ? "valid" : "hide"} />
                                        <FontAwesomeIcon icon={faTimes} className={validMatch || !confirmPassword ? "hide" : "invalid"} />
                                    </label>
                                    <div style={{ width: "100%", maxWidth: "557px" }}>
                                        <input
                                            type="password"
                                            id="confirm_pwd"
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            value={confirmPassword}

                                            aria-invalid={validMatch ? "false" : "true"}
                                            aria-describedby="confirmnote"
                                            onFocus={() => setMatchFocus(true)}
                                            onBlur={() => setMatchFocus(false)}
                                            className="password-input-field"
                                        />
                                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon icon={faInfoCircle} />
                                            <span> Must match the first password input field.</span>
                                        </p>
                                    </div>
                                </div>
                                <div><BtnGreen label="Save Changes" onClick={() => { setSuccessAlert(false); setErrorAlert(false); }} disabled={!validPwd || !validMatch} className='save-password' /></div>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
            <Footer />
        </>
    )
}


export default SetPassword;