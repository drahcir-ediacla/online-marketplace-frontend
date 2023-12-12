import axios from './axios'

export const GetAllCategories = async() => {
    try{
        const response = await axios.get('/api/getallcategories')
        return response
    } catch(error) {
        return error
    }
}
