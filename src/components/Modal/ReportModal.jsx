import React, { useState, useEffect } from 'react'
import axios from '../../apicalls/axios';
import './style.scss'
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen'
import TextArea from '../../components/FormField/TextArea';
import AlertMessage from '../AlertMessage';
import { ReactComponent as CheckIcon } from '../../assets/images/check-o.svg';
import { ReactComponent as LoadingSpinner } from "../../assets/images/loading-spinner.svg";

const ReportModal = ({ onClick, productId, productName, senderName, senderProfileLink }) => {
    console.log('senderName:', senderName)
    console.log('productName:', productName)

    const [situation, setSituation] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [showTextField, setShowTextField] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSucessAlert] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const maxCharacters = 400; // Define your maximum character limit here
    const remainingChar = maxCharacters - message.length;
    const situationOptions = [
        "Item Already Sold",
        "Innacurate Price or Description",
        "Didn’t Show Up",
        "Stopped Responding",
        "Scam",
        "Bullying and Harassment",
        "Didn’t Receive Item"
    ].map(option => ({
        label: option
    }));

    const [reportListingInfo, setReportListingInfo] = useState({
        situation: '',
        message: '',
        product_id: productId || '',
        product_name: productName || '',
        sender_display_name: senderName || '',
        sender_profile_link: senderProfileLink || '',
    })

    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);


    const toggleTab = (label) => {
        setSituation(label);
        setReportListingInfo({ ...reportListingInfo, situation: label })
        setShowTextField(true)
    };

    const handleMessageChange = (event) => {
        const { value } = event.target;
        if (value.length <= maxCharacters) {
            setMessage(value);
        }
        setReportListingInfo({ ...reportListingInfo, message: value })
    };

    const counterClassName = remainingChar === 0 ? 'character-count' : '';

    const handleSubmit = async (e) => {
        e.preventdefault()
        setErrorAlert(false);

        if (!situationOptions) {
            setErrMsg('Please fill up all the required fields');
            setErrorAlert(true);
            return;
        }
        try {
            setIsSending(true)
            await axios.get('/api/report-listing', reportListingInfo)
            setSucessAlert(true);

            setReportListingInfo({
                situation: '',
                message: '',
            })
            setIsSending(false)
        } catch (error) {
            console.error('Error sending report:', error);
            setErrMsg('Unable to send your request. Please try again.');
            setErrorAlert(true);
        } finally {
            setIsSending(false)
        }
    }


    return (
        <>
            {errorAlert && <AlertMessage type="error" message={errMsg} />}
            {isModalOpen &&
                <div className="modal-container">
                    <form className="report-modal-box" onSubmit={handleSubmit}>
                        <div className='report-item-modal-row1'>
                            <button className='closebtn' onClick={onClick}>
                                <i className='fa fa-times'></i>
                            </button>
                        </div>
                        {!successAlert &&
                            <>
                                <div className='modal-report-title'><h3>Report</h3></div>
                                <div className='report-item-modal-row3'>
                                    <h5>Describe the situation to us.</h5>
                                    <span>Please tell us why you believe this seller needs to be reported.</span>
                                </div>
                                <div className='report-reasons-options'>
                                    {situationOptions.map((option) => (
                                        <button key={option.label} className={`${situation === option.label ? 'active-button' : ''}`} onClick={() => toggleTab(option.label)} disabled={isSending}>{option.label}</button>
                                    ))}
                                </div>
                                {showTextField &&
                                    <div className='report-item-modal-row5'>
                                        <p>Help us understand by providing clarity on the issue.</p>
                                        <TextArea
                                            placeholder='Write your message...'
                                            rows='5'
                                            value={message}
                                            onChange={handleMessageChange}
                                            readOnly={isSending}
                                        />
                                        <div className='counter-container'>
                                            <small className={counterClassName}>{remainingChar} characters remaining</small>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                        {successAlert &&
                            <div className='success-report-listing-container'>
                                <div className='check-icon'><CheckIcon /></div>
                                <div className='success-report-listing-message'>
                                    <h5>Success</h5>
                                    <span>Report listing sent successfully</span>
                                </div>
                                <div className='ok-btn'>
                                    <BtnGreen label='Ok' onClick={onClick} />
                                </div>
                            </div>
                        }
                        {!successAlert &&
                            <>
                                {!isSending ? (
                                    <div className='buttons'>
                                        <BtnClear label='Cancel' onClick={onClick} />
                                        <BtnGreen className='mark-sold-button' label='Submit' onClick={() => setErrorAlert(false)}/>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', height: '72px' }}>
                                        <div style={{ width: '50px' }}><LoadingSpinner /></div>
                                        Sending request...
                                    </div>
                                )}
                            </>
                        }
                    </form>
                </div>
            }
        </>
    )
}


export default ReportModal 