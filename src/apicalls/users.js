import axios from "./axios";
import useRefreshToken from '../hooks/useRefreshToken';



// register user
export const RegisterUser = async (payload) => {
    try {
        const response = await axios.post("/api/register", payload);
        return response.data;
    } catch (error) {
        return error.message
    }
}

//login user
export const LoginUserByEmail = async (payload) => {
    try {
        const response = await axios.post('/api/login-email', payload);
        return response.data;
    } catch (error) {
        return error.message
    }
}

// get current user
export const GetCurrentUser = async () => {
    try {
        const response = await axios.get('/auth/check-auth', {
            withCredentials: true,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
        });
        return response
    } catch (error) {
        return error
    }
}

// update user
export const UpdateCurrentUser = async (userData) => {
    const refreshToken = useRefreshToken();
    try {
        await refreshToken(); // Refresh the token if necessary
        const response = await axios.put('/verify/api/updateuser', userData);
        return response
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}


// get user by id
export const GetUserById = async (userId) => {
    try {
        const response = await axios.get(`/api/user/${userId}`)
        return response
    } catch (error) {
        return error
    }
}