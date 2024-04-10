import React, { useState, useEffect } from 'react'
import './style.scss'
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen'
import TextArea from '../../components/FormField/TextArea';

const ReportModal = ({ onClick, productId, userId }) => {

    const [activeTab, setActiveTab] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(true);
    const maxCharacters = 400; // Define your maximum character limit here


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);


    const toggleTab = (buttonName) => {
        setActiveTab(buttonName);
    };

    const handleMessageChange = (event) => {
        const { value } = event.target;
        if (value.length <= maxCharacters) {
            setMessage(value);
        }
    };

    const counterClassName =
        message.length === maxCharacters ? 'character-count' : '';


    return (
        <>
            {isModalOpen &&
                <div className="modal-container">
                    <div className="modal-box">
                        <div className='report-item-modal-row1'>
                            <button className='closebtn' onClick={onClick}>
                                <i class='fa fa-times'></i>
                            </button>
                        </div>
                        <div className='modal-report-title'><h3>Report</h3></div>
                        <div className='report-item-modal-row3'>
                            <h5>Describe the situation to us.</h5>
                            <span>Please Tell us why you believe this seller needs to be reported.</span>
                        </div>
                        <div className='report-reasons-options'>
                            <button className={`${activeTab === 'alreadySold' ? 'active-button' : ''}`} onClick={() => toggleTab('alreadySold')}>Item Already Sold</button>
                            <button className={`${activeTab === 'innacuratePrice' ? 'active-button' : ''}`} onClick={() => toggleTab('innacuratePrice')}>Innacurate Price or Description</button>
                            <button className={`${activeTab === 'didntShowUp' ? 'active-button' : ''}`} onClick={() => toggleTab('didntShowUp')}>Didn’t Show Up</button>
                            <button className={`${activeTab === 'stopRes' ? 'active-button' : ''}`} onClick={() => toggleTab('stopRes')}>Stopped Responding</button>
                            <button className={`${activeTab === 'Scam' ? 'active-button' : ''}`} onClick={() => toggleTab('Scam')}>Scam</button>
                            <button className={`${activeTab === 'bullyingHarrasment' ? 'active-button' : ''}`} onClick={() => toggleTab('bullyingHarrasment')}>Bullying and Harassment</button>
                            <button className={`${activeTab === 'didntReceiveItem' ? 'active-button' : ''}`} onClick={() => toggleTab('didntReceiveItem')}>Didn’t Receive Item</button>
                        </div>
                        <div className='report-item-modal-row5'>
                            <p>Help us understand by providing clarity on the issue.</p>
                            <TextArea
                                placeholder='Write your message...'
                                rows='5'
                                value={message}
                                onChange={handleMessageChange}
                            />
                            <div className='counter-container'>
                                <small className={counterClassName}>{maxCharacters - message.length} characters remaining</small>
                            </div>
                        </div>
                        <div className='buttons'>
                            <BtnClear label='Cancel' onClick={onClick} />
                            <BtnGreen className='mark-sold-button' label='Submit' />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default ReportModal 