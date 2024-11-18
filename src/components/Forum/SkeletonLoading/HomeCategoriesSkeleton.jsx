import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import './style.scss'

const HomeCategoriesSkeleton = ({ menus }) => {
    return Array(menus)
        .fill(0)
        .map((_, i) => (
                    <Skeleton height={34} width={650} />
        ));
};

export default HomeCategoriesSkeleton;
