import React, { useState, useEffect } from 'react';
import './style.scss'
import { ReactComponent as CheckIcon } from '../../assets/images/check-o.svg';
import BtnGreen from '../Button/BtnGreen'

const SuccessEmailUpdated = () => {

    const [isModalOpen, setIsModalOpen] = useState(true);


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);


    const refreshPage = () => {
        window.location.reload();
    };


    return (
        <>
            {isModalOpen &&
                <div className="modal-container">
                    <div className="modal-box">
                        <div className='delete-item-modal-row1'>
                            
                        </div>
                        <div className='modal-sold-icon'><CheckIcon /></div>
                        <div className='are-you-sure'>
                            <h5>Success</h5>
                            <span>Your phone number successfully updated!</span>
                        </div>
                        <div className='buttons'>
                            <BtnGreen className='mark-sold-button' label='Ok' onClick={refreshPage} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default SuccessEmailUpdated