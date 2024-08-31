import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the window was opened as a popup
        if (window.opener) {
            window.opener.location.reload(); // Reload the main window
            window.close(); // Close the popup
        } else {
            navigate('/'); // Navigate to the home page if not a popup
        }
    }, [navigate]);

    return <div>Login successful! Redirecting...</div>;
};

export default AuthSuccess;
