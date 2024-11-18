import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import './style.scss'

const SideNavCategoriesSkeleton = ({ menus }) => {
    return Array(menus)
        .fill(0)
        .map((_, i) => (
                    <Skeleton height={35} width={205} className='side-nav-categories' />
        ));
};

export default SideNavCategoriesSkeleton;
