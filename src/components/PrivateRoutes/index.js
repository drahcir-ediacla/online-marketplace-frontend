import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../redux/actions/userActions';
import LoadingSpinner from '../LoadingSpinner';

const PrivateRoutes = () => {

  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Add loading state
  const [userRole, setUserRole] = useState({} | null)

  useEffect(() => {
    dispatch(getUser())
      .then(() => setLoading(false)) // Update loading state when data is fetched
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false); // Update loading state in case of error too
      });
  }, [dispatch]);


  // Render based on loading state and user data
  if (loading) {
    return <LoadingSpinner />; // You can render a loading indicator here
  } else {
    return user ? <Outlet /> : <Navigate to='/loginemail' />;
  }
};

export default PrivateRoutes;

// const PrivateRoutes = () => {

//   const user = useSelector((state) => state.user.data);
//     return user ? <Outlet /> : <Navigate to='/loginemail' />;
// };

// export default PrivateRoutes;
