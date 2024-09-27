import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { Setloader } from '../../../redux/reducer/loadersSlice';
import useAuthentication from '../../../hooks/authHook'
import './style.scss'
import axios from '../../../apicalls/axios'
import Header from '../../../layouts/Forum/Header'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import GTranslate from '../../../components/GTranslate';
import LoginModal from '../../../components/Modal/LoginModal';
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import PostList from './PostsList';



const Discussion = () => {

    const { discussionId } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const { user } = useAuthentication()
    const [loginModalOpen, setLoginModalOpen] = useState(false)


    

    useEffect(() => {
        const fetchDiscussionData = async () => {
            dispatch(Setloader(true))
            try {
                const response = await axios.get(`/api/discussions/${discussionId}/posts`);
                setPosts(response.data)
                dispatch(Setloader(false))
            } catch (error) {
                dispatch(Setloader(false))
                if (error.response && error.response.status === 404) {
                    // If the product is not found, navigate to the "Page Not Found" page
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }

            }
        }
        fetchDiscussionData()
    }, [discussionId])

    const toggleLoginModal = () => {
        setLoginModalOpen((prev) => !prev)
    }

    const loginModal = () => {
        setLoginModalOpen(true)
    }

    return (
        <>
         {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <Header authUser={user} />
            <div className='language-selector-container'>
                <GTranslate />
            </div>
            <div className="forum-discussion-page-container">
                <FilterNavigation
                    authUser={user}
                    onClick={loginModal}
                />
                <div className='forum-discussion-page-container-col2'>
                    <SearchDiscussionBox />
                    <PostList posts={posts} discussionId={discussionId} />
                </div>
            </div>
            
        </>
    )
}

export default Discussion;