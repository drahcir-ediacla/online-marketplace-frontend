import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/actions/userActions';
import { Link } from 'react-router-dom';
import './style.scss'
import NavCategories from '../SlidingSideNav/NavCategories'
import { ReactComponent as GridIcon } from '../../assets/images/grid-icon.svg';
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import AvatarIcon from '../../assets/images/avatar-icon.png'


const SlidingSideNav = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  useEffect (() => {
    dispatch(getUser())
  }, [dispatch]);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  

  return (
    <>
      <div className='btm-border' id='all-category-icon' onClick={toggleMenu}>
        <Link to="#" className='parent-menu'>
          <div className='grid-icon'><GridIcon /></div>
          All Categories
        </Link>
      </div>
      <div id='SlidingMenu' style={{ right: isMenuOpen ? '0' : '-435px' }}>
        <div id='menuBkgrnd' style={{ right: isMenuOpen ? '0' : '-100%' }} onClick={toggleMenu}></div>
        <nav id='menuBox'>
          <div className='col-left'>
            <div id="closeBtn" onClick={toggleMenu}>
              <i className="fa fa-times"></i>
            </div>
          </div>
          <div className='col-right'>
            <div className='row1'>
              {user ? (
                <div>
                  {user.profile_pic && user.profile_pic.length > 0 ? (
                    <div className="avatar-icon">
                      <Link to='/MyProfile'><img src={user.profile_pic} alt="" /></Link>
                    </div>
                  ) : (
                    <div className="avatar-icon">
                      <Link to='/MyProfile'><img src={AvatarIcon} alt="" /></Link>
                    </div>
                  )}
                  <Link to='/MyProfile'><h5>{user.display_name || 'Anonymous'}</h5></Link>
                </div>
              ) : (
                <div>
                  <div className="avatar-icon">
                    <img src={AvatarIcon} alt="" />
                  </div>
                  <Link to='/LoginEmail'><h5>Hello, sign in</h5></Link>
                </div>
              )}
            </div>
            <div className='row2'>
              <div>
                <h5>All Categories</h5>
                <div className='search-container'>
                  <input type="text" placeholder='Search Categories' />
                  <button><div className='magnifying-glass'><MagnifyingGlass /></div></button>
                </div>
              </div>
            </div>
            <div className='row3'>
              <NavCategories />
            </div>
          </div>

        </nav>
      </div>
    </>
  )
}

export default SlidingSideNav
