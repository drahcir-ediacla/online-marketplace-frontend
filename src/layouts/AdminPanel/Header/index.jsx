import React from 'react'
import './style.scss'
import Avatar from '../../../assets/images/avatar-icon.png'
import { ReactComponent as BellIcon } from '../../../assets/images/bell-icon.svg'
import { ReactComponent as GearOIcon } from '../../../assets/images/gear-o-icon.svg'
import { ReactComponent as TriangleIcon } from '../../../assets/images/triangle-up.svg'
import { ReactComponent as LogoutIcon } from '../../../assets/images/logout-icon.svg'

const Header = () => {
    return (
        <>
            <div className="header-container">
                <div className="header-nav">
                    <div className='avatar-icon'>
                        <img src={Avatar} alt="" />
                        <div className="my-profile-dropdown">
                            <div className="triangle-icon"><TriangleIcon /></div>
                            <ul>
                                <li>
                                    <div className='drop-down-avatar'><img src={Avatar} alt="" /></div>
                                    <div className='admin-name-role'>
                                        <div className='admin-name'>Richard Alcaide</div>
                                        <div className='admin-role'>Editor</div>
                                    </div>
                                </li>
                                <li><p>My Profile</p></li>
                                <li><p>Logout</p><div className="logout-icon"><LogoutIcon /></div></li>
                            </ul>
                        </div>
                    </div>
                    <div className='vertical-line'></div>
                    <div className='bell-icon'><BellIcon /></div>
                    <div className='vertical-line'></div>
                    <div className='gear-o-icon'><GearOIcon /></div>
                    
                </div>
            </div>
        </>
    )
}

export default Header
