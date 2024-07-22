import React, { useRef, useState, useEffect } from 'react';
import './style.scss'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen'
import Input from '../FormField/Input';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const UpdateEmailModal = ({ onClick, productId, userId }) => {

    const [isModalOpen, setIsModalOpen] = useState(true);
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);


    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    return (
        <>
            {isModalOpen &&
                <div className="modal-container">
                    <div className="update-modal-box">
                        <div className='update-modal-row1'>
                            <button className='closebtn' onClick={onClick}>
                                <i class='fa fa-times'></i>
                            </button>
                        </div>
                        <div className='modal-title'>
                            <h5>Update email address</h5>
                            <span>Enter an email and click "Send Code" to send verification code.</span>
                        </div>
                        {/* <div className='email-label'>
                            <label>Email</label>
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </div> */}
                        <div className='email-input-container'>
                            <input
                                type="email"
                                id="emailAddress"
                                name="email"
                                ref={emailRef}
                                autoComplete="off"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    handleChange(e); // Assuming handleChange is another function you want to call
                                }}
                                value={email}
                                required
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                placeholder='Enter your new email address'
                            />
                            <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} color='red' />
                                <span> Invalid email address format!</span>
                            </p>
                        </div>

                        <div className='buttons'>
                            <BtnGreen label='Send Code' />
                            <BtnClear label='Cancel' onClick={onClick} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default UpdateEmailModal