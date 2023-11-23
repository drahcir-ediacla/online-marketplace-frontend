import axios from './axios'

export const GetCategories = async() => {
    try{
        const response = await axios.get('/api/getproductcategories')
        return response
    } catch(error) {
        return error
    }
}