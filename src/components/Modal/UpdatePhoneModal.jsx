import React, { useRef, useState, useEffect } from 'react';
import axios from '../../apicalls/axios';
import './style.scss'
import { useDispatch } from 'react-redux';
import { Setloader } from '../../redux/reducer/loadersSlice';
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen';
import SuccessPhoneUpdated from './SuccessPhoneUpdated';



const UpdateEmailModal = ({ onClick, length = 6 }) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [showVerifyForm, setShowVerifyForm] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false)
    const [code, setCode] = useState(Array(length).fill(''));
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const phoneRef = useRef();
    const dispatch = useDispatch()

    const [newPhone, setNewPhone] = useState('');
    console.log('newPhone:', newPhone);

    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setNewPhone(value);
            setError('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendOTPCode();
        }
    };

    const sendOTPCode = async (e) => {

        if (!newPhone) {
            setError('Phone number cannot be empty.');
            return;
        }

        const phoneRegex = /^[0-9]{10,15}$/; // Adjust the regex as needed
        if (!phoneRegex.test(newPhone)) {
            setError('Invalid phone number format.');
            return;
        }

        try {
            dispatch(Setloader(true))
            const response = await axios.post('/api/send-phone-update-otp', { newPhone });
            if (response.status === 201) {
                dispatch(Setloader(false))
                setShowVerifyForm(true);
            }
        } catch (err) {
            if (err.response.status === 409) {
                dispatch(Setloader(false))
                setError('Phone number already in use.');
            } else {
                dispatch(Setloader(false))
                setError('Error sending OTP.');
            }
        }
    };

    const handleCodeChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value) || value === '') {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            setError('');

            if (value && index < length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleCodeKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerificationCodeSubmit = async (otp) => {
        try {
            dispatch(Setloader(true))
            const response = await axios.put('/api/verify-phone-update-otp', { otp });
            if (response.status === 200) {
                dispatch(Setloader(false))
                setShowVerifyForm(false);
                setIsModalOpen(false);
                setSuccessOpen(true)
            }
        } catch (err) {
            if (err.response.status === 401) {
                dispatch(Setloader(false))
                setError('Invalid or expired OTP.');
            } else {
                dispatch(Setloader(false))
                setError('Error verifying OTP.');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.every(char => char !== '')) {
            handleVerificationCodeSubmit(code.join(''));
        } else {
            setError('Please enter the complete code');
        }
    };

    return (
        <>
            {isModalOpen &&
                <div className="modal-container">
                    <div className="update-modal-box">
                        <div className='update-modal-row1'>
                            <button className='closebtn' onClick={onClick}>
                                <i className='fa fa-times'></i>
                            </button>
                        </div>
                        {!showVerifyForm ? (
                            <>
                                <div className='modal-title'>
                                    <h5>Update phone number</h5>
                                    <span>Enter the phone number and click "Send Code" to send a verification code.</span>
                                </div>
                                <div className='email-input-container'>
                                    <input
                                        type="number"
                                        id="phoneNumber"
                                        name="phone"
                                        ref={phoneRef}
                                        autoComplete="off"
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        value={newPhone}
                                        required
                                        placeholder='Enter your new phone number'
                                        className='phone-input-box'
                                    />
                                    <div className='plus63'>+63</div>
                                </div>
                                {error && <p className="error-email">{error}</p>}
                                <div className='buttons'>
                                    <BtnGreen label='Send Code' onClick={sendOTPCode} />
                                    <BtnClear label='Cancel' onClick={onClick} />
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className='modal-title'>
                                    <h5>Verification Required</h5>
                                    <span>We sent a 6-digit verification code to your email.</span>
                                </div>
                                <div className="input-group">
                                    {code.map((char, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={char}
                                            onChange={(e) => handleCodeChange(e, index)}
                                            onKeyDown={(e) => handleCodeKeyDown(e, index)}
                                            maxLength={1}
                                            ref={el => inputRefs.current[index] = el}
                                            className='input-code-box'
                                        />
                                    ))}
                                </div>
                                {error && <p className="error">{error}</p>}
                                <div className='verify-btn-container'>
                                    <BtnGreen type="submit" label='Verify' className='verify-btn' />
                                </div>
                                <div className='resend-code-container'>
                                    <span>Didn't get the code?</span><BtnClear type='button' label='Resend' className='resend-code-btn' onClick={sendOTPCode} />
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            }
            {successOpen && <SuccessPhoneUpdated />}
        </>
    );
}

export default UpdateEmailModal;
