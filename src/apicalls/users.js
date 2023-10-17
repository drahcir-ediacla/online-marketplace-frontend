import axios from "./axios";

// register user
export const RegisterUser = async (payload) => {
    try{
        const response = await axios.post("/api/register", payload);
        return response.data;
    } catch (error) {
        return error.message
    }
}

//login user
export const LoginUser = async (payload) => {
    try{
        const response = await axios.post('/api/login', payload);
        return response.data;
    } catch (error) {
        return error.message
    }
}
