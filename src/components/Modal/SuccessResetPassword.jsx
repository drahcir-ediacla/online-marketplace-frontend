import React, { useState, useEffect } from 'react';
import './style.scss'
import { ReactComponent as CheckIcon } from '../../assets/images/check-o.svg';
import BtnGreen from '../Button/BtnGreen'

const SuccessRegistration = ({ onClick }) => {

    const [isModalOpen, setIsModalOpen] = useState(true);


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);




    return (
        <>
            {isModalOpen &&
                <div className="modal-container">
                    <div className="modal-box">
                        <div className='delete-item-modal-row1'>
                            
                        </div>
                        <div className='modal-sold-icon'><CheckIcon /></div>
                        <div className='are-you-sure'>
                            <h5>Password Updated Successfully</h5>
                            <span>Your password has been updated successfully.<br></br>Use your new password to login.</span>
                        </div>
                        <div className='buttons'>
                            <BtnGreen className='mark-sold-button' label='Continue Login' onClick={onClick} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default SuccessRegistration