import React, { useEffect } from 'react'
import { GetCurrentUser } from '../../apicalls/users'

function ProtectedPage() {

    const [user, setUser] = React.useState(null)


    const validateToken = async () => {
        try {
            const response = await GetCurrentUser()
            if (response.success) {
                setUser(response.data)
            } else {
                return response.message
            }
        } catch (error) {
            return error.message
        }
    }




    useEffect(() => {

        validateToken()
    }, [])
  return (
    <div>{user}</div>
  )
}

export default ProtectedPage
