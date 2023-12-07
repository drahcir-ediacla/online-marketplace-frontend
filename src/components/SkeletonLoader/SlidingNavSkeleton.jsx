import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import './style.scss'

const SlidingNavSkeleton = () => {
    return (
        <>
            <div className="loader-container">
                <div className='skeleton-icon'>
                    <Skeleton square height={25} width={25} />
                </div>
                <div>
                    <Skeleton height={20} width={200} />
                </div>
            </div>
        </>
    );
};

export default SlidingNavSkeleton;
