import './style.scss'
import useAuthentication from '../../../hooks/authHook'
import Header from '../../../layouts/Forum/Header'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'



const AddDiscussion = () => {

    const {user} = useAuthentication()
    return (
        <>
            <Header authUser={user} />
            <FilterNavigation authUser={user} />
        </>
    )
}

export default AddDiscussion;