import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const NavMenuSkeleton = ({ menus }) => {
  return Array(menus)
    .fill(0)
    .map((_, i) => (
      <li>
        <div>
          <Skeleton height={20} width={150} />
        </div>
      </li>
    ));
};

export default NavMenuSkeleton;
