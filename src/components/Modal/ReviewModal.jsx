import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../../apicalls/axios';
import { FaStar } from 'react-icons/fa';
import { Setloader } from '../../redux/reducer/loadersSlice';
import './style.scss'
import TextArea from '../../components/FormField/TextArea';
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen'
import { ReactComponent as PlusSign } from '../../assets/images/plus-sign.svg';


const ReviewModal = ({ onClick, productId, userId, sellerId, targetId, chatId, displayName }) => {


    const [isModalOpen, setIsModalOpen] = useState(true);
    const [currentRateValue, setCurrentRateValue] = useState(0);
    const [hoverValue, setHoverValue] = useState(undefined);
    const [commentValue, setCommentValue] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadImgCounter, setUploadImgCounter] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const dispatch = useDispatch();
    const maxImages = 5;

    const handleImgInputClick = () => {
        document.getElementById('imgUpload').click();
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const selectedImagesArray = Array.from(files);

        if (selectedImagesArray.length + selectedImages.length > maxImages) {
            alert(`You can only select up to ${maxImages} images.`);
            return;
        }

        const imagePreviewsArray = [];

        let count = 0;

        selectedImagesArray.forEach((image) => {
            if (!image.type.startsWith('image/')) {
                alert('Only image files are allowed.');
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                imagePreviewsArray.push(e.target.result);
                count++;

                if (count === selectedImagesArray.length) {
                    setImagePreviews((prevPreviews) => [...prevPreviews, ...imagePreviewsArray]);
                    setSelectedImages((prevImages) => [...prevImages, ...selectedImagesArray]);
                    setUploadImgCounter((prevCount) => prevCount + count);
                }
            };

            reader.readAsDataURL(image);
        });
    };



    const removeImage = (index) => {
        // Calculate the number of images being removed
        const numRemovedImages = imagePreviews.length > index ? 1 : 0;

        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
        const updatedImages = selectedImages.filter((_, i) => i !== index);

        setImagePreviews(updatedPreviews);
        setSelectedImages(updatedImages);
        setUploadImgCounter((prevCount) => prevCount - numRemovedImages);
    };



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
        setCurrentRateValue(value)
    }


    const handleMouseOver = value => {
        setHoverValue(value);
    }


    const handleMouseLeave = () => {
        setHoverValue(undefined)
    }




    const submitReview = async () => {

        // Check if star rating is provided
        if (currentRateValue === 0) {
            alert("Please rate your experience before submitting the review.");
            return; // Prevent further execution
        }

        let reviewerRole;
        if (userId === sellerId) {
            reviewerRole = 'Seller'
        } else {
            reviewerRole = 'Buyer'
        }

        try {
            dispatch(Setloader(true));
            // Upload images to Cloudinary
            const uploadedImageUrls = [];
            for (const image of selectedImages) {
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', 'auwcvbw0');
                formData.append('cloud_name', 'yogeek-cloudinary'); // Your Cloudinary upload preset
                formData.append('folder', 'review_images'); // Folder in Cloudinary

                const response = await fetch(
                    'https://api.cloudinary.com/v1_1/yogeek-cloudinary/image/upload', 
                {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const responseData = await response.json();
                uploadedImageUrls.push(responseData.secure_url);
            }


            await axios.post('/api/submit-review', {
                chat_id: chatId,
                reviewer_id: userId,
                reviewer_name: displayName,
                target_id: targetId,
                role: reviewerRole,
                product_id: productId,
                rating: currentRateValue,
                comment: commentValue,
                imageUrls: uploadedImageUrls,
            })

            // Clear form fields after successful submission
            setCurrentRateValue(0);
            setCommentValue('');
            setImagePreviews([]);
            setSelectedImages([]);
            setUploadImgCounter(0);

            // Close the modal
            setIsModalOpen(false);
            dispatch(Setloader(false));
            window.location.reload();
        } catch (error) {
            dispatch(Setloader(false));
            // Handle error
            console.error("Error sending message:", error);
        }
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
                            {userId === sellerId ? (
                                <span>Rate the buyer</span>
                            ) : (
                                <span>Rate the seller</span>
                            )}
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {stars.map((_, index) => {
                                    return (
                                        <FaStar
                                            key={index}
                                            size={24}
                                            style={{ cursor: 'pointer' }}
                                            color={(hoverValue || currentRateValue) > index ? '#FFD800' : '#bcbcbc'}
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
                                value={commentValue}
                                onChange={(e) => { setCommentValue(e.target.value) }}
                            />
                        </div>
                        {userId !== sellerId &&
                            <div className="review-modal-row4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="preview-img-box">
                                        <img src={preview} alt={`Img ${index}`} className='review-preview-image' />
                                        <div onClick={() => removeImage(index)} className="upload-img-close"></div>
                                    </div>
                                ))}
                                {imagePreviews.length < 5 &&
                                    <>
                                        <label htmlFor="imgUpload" className="custom-file-upload">
                                            <button type='button' className='upload-img-box' onClick={handleImgInputClick}>
                                                <div className='add-review-upload-img'><PlusSign /></div>
                                                <span>Add Images</span>
                                                <span>{uploadImgCounter}/5</span>
                                            </button>
                                        </label>
                                        <input type="file" id="imgUpload" multiple accept="image/*" onChange={handleImageChange} hidden />
                                    </>
                                }
                            </div>
                        }
                        <div className='modal-review-buttons'>
                            <BtnClear label='Cancel' onClick={onClick} />
                            <BtnGreen label='Submit Review' onClick={submitReview} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default ReviewModal