import React from 'react';
import useRefreshToken from '../../hooks/refreshTokenHook'; // Ensure the path is correct

const TokenRefreshWrapper = ({ children }) => {
  // Call the useRefreshToken hook to initiate the token refresh mechanism
  useRefreshToken();
  
  return <>{children}</>;
};

export default TokenRefreshWrapper;
