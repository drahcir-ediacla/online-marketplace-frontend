import React, { useState, useEffect } from 'react';
import './style.scss'
import { MarkSoldProduct } from '../../apicalls/products';
import { ReactComponent as CheckIcon } from '../../assets/images/check-o.svg';
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen'

const MarkSoldModal = ({ onClick, productId, productName, userId }) => {

    const [isModalOpen, setIsModalOpen] = useState(true);


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);


    const MarkSoldItem = async () => {
        try {
            const response = await MarkSoldProduct(productId);
    
            if (response.data.success) {
                window.location.reload();
            }
    
            return response;
        } catch (error) {
            console.error('Error:', error);
            return error;
        }
    };
    
    



    return (
        <>
            {isModalOpen &&
                <div className="modal-container">
                    <div className="modal-box">
                        <div className='delete-item-modal-row1'>
                            <button className='closebtn' onClick={onClick}>
                                <i class='fa fa-times'></i>
                            </button>
                        </div>
                        <div className='modal-sold-icon'><CheckIcon /></div>
                        <div className='are-you-sure'>
                            <h5>Are you sure you want to mark your listing as Sold?</h5>
                            <span>You can’t undo this action. <br></br>Buyers can no longer chat with you or make offers for this listing.</span>
                        </div>
                        <div className='buttons'>
                            <BtnGreen className='mark-sold-button' label={`Yes, Mark as Sold`} onClick={MarkSoldItem} />
                            <BtnClear label='No, Cancel' onClick={onClick} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default MarkSoldModal