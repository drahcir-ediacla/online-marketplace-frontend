import React, { useState, useEffect } from 'react'
import './style.scss';
import { ReactComponent as ExclamationIcon } from '../../assets/images/exclamation-regular.svg'
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen'

const CompleteProfileModal = () => {

    const [isModalOpen, setIsModalOpen] = useState(true);


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    const goToMyProfile = () => {
        window.location.href = `/editprofile`
    }

    const closeModal = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    }

    return (
        <>
            {isModalOpen &&
                <div className="complete-modal-container">
                    <div className="modal-box">
                        <div className='exclamation-icon'><ExclamationIcon /></div>
                        <div className='label-description'>
                            <h5>Complete Your Profile</h5>
                            <span>You need to complete your profile information <br></br>before you can add an item for listing.</span>
                        </div>
                        <div className='buttons'>
                            <BtnGreen label='Update Profile' onClick={goToMyProfile} />
                            <BtnClear label='Go Back' onClick={closeModal} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default CompleteProfileModal
