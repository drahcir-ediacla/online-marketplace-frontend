import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import './style.scss'

const ProductCardSkeleton = ({ card }) => {
    return Array(card)
        .fill(0)
        .map((_, i) => (
            <div className='product-card-skeleton-container'>
                <div className='product-skeleton-image'>
                    <Skeleton square height={200} width={240} />
                </div>
                <div>
                    <Skeleton square height={15} width={210} />
                    <Skeleton square height={12} width={190} />
                    <Skeleton square height={12} width={100} />
                </div>
                <div className='skeleton-condition'>
                    <Skeleton square height={12} width={50} />
                    <div className='skeleton-price'>
                        <Skeleton square height={24} width={80} />
                        <Skeleton square height={15} width={15} />
                    </div>
                </div>
            </div>
        ));
};

export default ProductCardSkeleton;


