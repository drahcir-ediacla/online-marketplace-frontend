import { Link } from 'react-router-dom'
import './style.scss'
import Logo from '../../../assets/images/yogeek-forum-logo.png'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'


const ForumHeader = () => {

    return (
        <>
            <div className='forum-header-container'>
                <img src={Logo} alt="" className='forum-logo' />
                <div className='forum-header-right-col'>
                    <Link to='/'>Marketplace</Link> 
                    | 
                    <Link>Sign In</Link>
                    <img src={DefaultAvatar} alt="" className='default-forum-profile-avatar' />
                </div>
            </div>
        </>
    )
}


export default ForumHeader