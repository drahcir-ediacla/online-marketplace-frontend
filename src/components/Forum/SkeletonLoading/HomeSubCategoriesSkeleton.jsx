import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import './style.scss'

const HomeSubCategoriesSkeleton = ({ menus }) => {
    return Array(menus)
        .fill(0)
        .map((_, i) => (
                    <Skeleton height={74} />
        ));
};

export default HomeSubCategoriesSkeleton;
