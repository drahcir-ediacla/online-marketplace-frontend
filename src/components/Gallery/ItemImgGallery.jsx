import React, { useState } from 'react';
import './style.scss'

const ItemImgGallery = ({gallery}) => {

    const [productImgSrc, setProductImgSrc] = useState(gallery[0]);

    const handleSmallImgClick = (index) => {
        setProductImgSrc(gallery[index]);
    };

return (

<div className='prod-img-gallery'>
    
        <div className='group-prod-img-thumb'>
        {gallery.map((src, index) => (
            <div><img key={index} src={src} alt={`Small Img ${index + 1}`} className='prod-img-thumb' onClick={() => handleSmallImgClick(index)} /></div>
            ))}
        </div>
        
        <div><img id="ProductImg" src={productImgSrc} className='selected-prod-img' alt="" /></div>
</div>
  );
};

export default ItemImgGallery;