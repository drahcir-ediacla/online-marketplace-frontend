import React, { useState, useEffect, useRef } from 'react'
import axios from "../../../apicalls/axios";
import { axiosInstance } from '../../../apicalls/axiosInstance';
import './style.scss'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../../redux/reducer/tokenSlice'
import { Setloader } from '../../../redux/reducer/loadersSlice';
import LoginBtn from '../../../components/Button/LoginBtn';
import LogoAdmin from '../../../assets/images/yogeek-admin-logo.png'
import AlertMessage from '../../../components/AlertMessage';
import GTranslate from '../../../components/GTranslate'
import { ReactComponent as GlobeIcon } from '../../../assets/images/globe-regular.svg';


const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
    const navigate = useNavigate();
    const emailRef = useRef();
    const errRef = useRef();
    const [showAlert, setShowAlert] = useState(false);
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const dispatch = useDispatch()

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email)
        setValidEmail(result);
    }, [email])

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const validateForm = () => {
        let hasErrors = false;

        if (!email) {
            setEmailError('Email is required');
            hasErrors = true;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            hasErrors = true;
        } else {
            setPasswordError('');
        }

        return !hasErrors;
    };


    // LOCAL LOGIN METHOD
    const loginUser = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        try {
            dispatch(Setloader(true))
            const response = await axiosInstance.post('/api/login-admin-email', {
                email,
                password,
            });
            dispatch(Setloader(false))

            console.log('Login successful', response.data);
            dispatch(setAccessToken(response.data.accessToken));
            // document.cookie = `jwt=${response.data.accessToken}; Path=/`;
            document.cookie = `refreshJWT=${response.data.refreshToken}; Path=/`;
            navigate('/admin/dashboard');
        } catch (err) {
            dispatch(Setloader(false))
            // Handle login error based on the response from the backend.
            if (err.response) {
                setErrMsg(err.response.data.message);
            } else {
                setErrMsg('An error occurred. Please try again later.');
            }
            setShowAlert(true);
        }
        if (errRef.current) {
            errRef.current.focus();
        }
    };

    const clearErrors = () => {
        setEmailError('');
        setPasswordError('');
        setErrMsg('');
        setShowAlert(false);
    };



    return (
        <>
            <div className='form-body'>
                <div className="container">
                    <div className="form-box">
                        {showAlert && <AlertMessage type="error" message={errMsg} />}
                        <div className='login-form-container'>
                            <form className='login-form' onSubmit={loginUser}>
                                <div className='row1'>
                                    <div className="col1"><Link to="/"><img src={LogoAdmin} alt="" className='auth-form-logo' /></Link></div>
                                    <div className="col2">Use a valid email and password to gain access to the administrator backend.</div>
                                </div>
                                {/* {error && <p className='error-msg'>{error}</p>} */}

                                <div className='row2'>
                                    <div className='col1'>
                                        <label htmlFor='emailAddress'>
                                            <b>Email</b>
                                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                                        </label>
                                    </div>
                                    <div className='col2'>
                                        <input
                                            type="email"
                                            id="emailAddress"
                                            name="email"
                                            ref={emailRef}
                                            value={email}
                                            autoComplete="off"
                                            className='input-email'
                                            onChange={handleEmailChange}
                                            aria-invalid={validEmail ? "false" : "true"}
                                            aria-describedby="uidnote"
                                            onFocus={() => { setEmailFocus(true); clearErrors(); }}
                                            onBlur={() => setEmailFocus(false)}
                                            placeholder='Enter your email address'
                                        />
                                        {emailError && <div className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {emailError}</div>}
                                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon icon={faInfoCircle} color='red' />
                                            <span> Invalid email address format!</span>
                                        </p>
                                    </div>
                                </div>
                                <div className='row3'>
                                    <div className='col1'>
                                        <b>Password</b>
                                        <Link to="/admin/reset-password">Forgot the password?</Link></div>
                                    <div className='col2'>
                                        <input
                                            type="password"
                                            placeholder='Enter your password'
                                            className='input-password'
                                            value={password}
                                            onChange={handlePasswordChange}
                                            onFocus={clearErrors}
                                        />
                                        {passwordError && <div className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {passwordError}</div>}
                                    </div>
                                </div>
                                <div className='row4'><LoginBtn type='submit' label="Continue" className='continue-btn' onClick={() => setShowAlert(false)} /></div>
                            </form>
                            <div className='row6'><small><Link to="/"><span className='fa fa-long-arrow-left'></span> Go to site homepage</Link></small></div>
                        </div>
                        {/* <div className='language-selector-container'><div className='globe-icon'><GlobeIcon /></div><GTranslate /></div> */}
                    </div>
                </div>
                <div className='language-selector-container'><div className='globe-icon'><GlobeIcon /></div><GTranslate /></div>
            </div>
        </>
    )
}

export default Login
