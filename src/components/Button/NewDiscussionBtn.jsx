import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './Button.css'
import useAuthentication from '../../hooks/authHook'
import LoginModal from '../../components/Modal/LoginModal';
import { ReactComponent as PencilIcon } from '../../assets/images/pencil-icon.svg'


const NewDiscussionBtn = ({ className, onClick, label }) => {

    const { user } = useAuthentication();
    const navigate = useNavigate();
    const [loginModalOpen, setLoginModalOpen] = useState(false)

    const handleNewDiscussionClick = () => {
        if (!user) {
            setLoginModalOpen(true)
        } else {
            navigate(`/forum/profile/${user.id}/add_discussions`);
        }
    };

    const toggleLoginModal = () => {
        setLoginModalOpen((prevLoginModalOpen) => !prevLoginModalOpen)
    }

    return (
        <>
            {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <button type='button' onClick={handleNewDiscussionClick} className={`discussion-btn ${className}`}><PencilIcon /> {label}</button>
        </>
    )
}


export default NewDiscussionBtn;