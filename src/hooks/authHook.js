import { useState, useEffect, useMemo } from 'react';
import { GetCurrentUser } from '../apicalls/users';

const useAuthentication = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await GetCurrentUser();
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Memoize user to maintain a stable reference
    const memoizedUser = useMemo(() => user, [user]);

    return { user: memoizedUser };
};

export default useAuthentication;
