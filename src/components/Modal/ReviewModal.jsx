import React, { useState, useEffect } from 'react';
import './style.scss'
import { DeleteProductById } from '../../apicalls/products';
import TextArea from '../../components/FormField/TextArea';
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen'
import { FaStar } from 'react-icons/fa';

const ReviewModal = ({ onClick, productId, userId }) => {


    const [isModalOpen, setIsModalOpen] = useState(true);
    const [currentValue, setCurrentValue] = useState(0);
    const [hoverValue, setHoverValue] = useState(undefined);

    console.log('currentValue:', currentValue)

    const stars = Array(5).fill(0);


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);


    const handleClick = value => {
        setCurrentValue(value)
    }


    const handleMouseOver = value => {
        setHoverValue(value);
    }


    const handleMouseLeave = () => {
        setHoverValue(undefined)
    }

    return (
        <>
            {isModalOpen &&
                <div className="modal-container">
                    <div className="modal-box">
                        <div className='delete-item-modal-row1'>
                            <button className='closebtn' onClick={onClick}>
                                <i className='fa fa-times'></i>
                            </button>
                        </div>
                        <div className='review-modal-row1'>
                            <h3>How was your experience?</h3>
                        </div>
                        <div className='review-modal-row2'>
                            <span>Rate the buyer</span>
                            <div style={{ display: 'flex', gap:'5px' }}>
                                {stars.map((_, index) => {
                                    return (
                                        <FaStar
                                            key={index}
                                            size={24}
                                            style={{cursor: 'pointer'}}
                                            color={(hoverValue || currentValue) > index ? '#FFD800' : '#bcbcbc'}
                                            onClick={() => handleClick(index + 1)}
                                            onMouseOver={() => handleMouseOver(index + 1)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                        <div className='review-modal-row3'>
                            <span>Write a review</span>
                            <TextArea
                                className="review-text-box"
                                placeholder="Tell us more about your experiences with the seller and the purchase."
                                rows='5'
                            />
                        </div>
                        <div className='modal-review-buttons'>
                            <BtnClear label='Cancel' onClick={onClick} />
                            <BtnGreen label='Submit Review' />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default ReviewModal