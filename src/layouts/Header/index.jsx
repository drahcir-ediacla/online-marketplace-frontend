import React from 'react';
import {Link} from 'react-router-dom';
import '../Header/style.scss';
import {ReactComponent as MessageIcon} from '../../assets/images/message-regular.svg';
import {ReactComponent as HeartIcon} from '../../assets/images/heart-regular.svg';
import {ReactComponent as BellIcon} from '../../assets/images/bell-regular.svg';
import {ReactComponent as GlobeIcon} from '../../assets/images/globe-regular.svg';
import { ReactComponent as TriangleIcon } from '../../assets/images/triangle-up.svg';
import Logo from '../../assets/images/Yogeek-logo.png';
import RangeSlider from './RangeSlider';
import SearchBox from './HeaderSearchBox';
import NavMenu from './NavMenu';

function Header() {
  return (
    <>
      <header>
        <div className='row1'>
            <div className='container'>
              <div className='col-left'>
                <div className='language-selector'>
                  <div className='globe-icon'><GlobeIcon /></div>
                  <span>English</span>
                  <span><i class="arrow down"></i></span>
                  <div className='language-list'>
                    <ul>
                      <li>English</li>
                      <li>中國語</li>
                      <li>한국어</li>
                      <li>日本語</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='col-right'>
                <div className='nav-tools'>
                  <div className='message-icon'><MessageIcon /></div>
                  <div className='bell-icon'><BellIcon /></div>
                  <div className='heart-icon'><HeartIcon /></div>
                </div>
                <span>Sell</span>
                <div className='my-account'>
                  <span>My Account</span>
                  <div className='my-account-dropdown'>
                  <div className='triangle-icon'><TriangleIcon /></div>
                  <ul>
                    <li><Link to='/EditProfile'>Manage Account</Link></li>
                    <li><Link to='/MyProfile'>My Profile</Link></li>
                    <li>Settings</li>
                    <li>Help & Support</li>
                    <li><Link to='/LoginEmail'>Logout</Link></li>
                  </ul>
                </div>
                </div>
                
              </div>
            </div>
        </div>
        <div className='row2'>
          <div className='container'>
            <div className='col1'>
              <Link to="/">
                <img src={Logo} alt='' className='logo' />
              </Link>
            </div>
            <div className='col2'>
              <SearchBox />
            </div>
            <div className='col3'>
              <RangeSlider />
            </div>
          </div>
        </div>
        <div className='row3'>
          <div className='container'>
            <NavMenu />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
