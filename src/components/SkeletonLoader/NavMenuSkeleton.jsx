import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const NavMenuSkeleton = () => {
  return (
    <div>
      <Skeleton height={20} width={150} />
    </div>
  );
};

export default NavMenuSkeleton;
