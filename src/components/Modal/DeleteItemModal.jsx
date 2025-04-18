import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './style.scss'
import { DeleteProductById } from '../../apicalls/products';
import { ReactComponent as ExclamationIcon } from '../../assets/images/exclamation-regular.svg'
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen'

const DeleteItemModal = ({ onClick, productId, userId }) => {

    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(true);


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    
    const DeleteItem = async () => {
        try {
            const response = await DeleteProductById(productId);

            if (response.status === 200) {
                window.location.href = `/profile/${userId}`;
            }

            return response
            
        } catch (error) {
            return error
        }
    }


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
                        <div className='exclamation-icon'><ExclamationIcon /></div>
                        <div className='are-you-sure'>
                            <h5>Are you sure you want to delete this item?</h5>
                            <span>This item will be deleted immediately. You can't undo this action.</span>
                        </div>
                        <div className='buttons'>
                            <BtnGreen className='yes-button' label='Yes, Delete' onClick={DeleteItem} />
                            <BtnClear label='No, Cancel' onClick={onClick} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default DeleteItemModal