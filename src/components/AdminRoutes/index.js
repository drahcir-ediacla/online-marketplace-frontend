import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from '../../apicalls/axios';
import { axiosInstance } from '../../apicalls/axiosInstance';

const AdminRoutes = ({ allowedRoles }) => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axiosInstance.get('/api/admin/get-role');
                if (response.status === 200) {
                    setUserRole(response.data.role); // Access 'role' directly
                }
            } catch (error) {
                console.error('Error in fetchUserRole:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserRole();
    }, []);

    if (loading) return <div>Loading...</div>; // Prevent rendering before data is loaded

    return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoutes;
