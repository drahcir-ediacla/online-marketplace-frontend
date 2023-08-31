import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './style.scss'
import NavCategories from '../SlidingSideNav/NavCategories'
import {ReactComponent as GridIcon} from '../../assets/images/grid-icon.svg';
import {ReactComponent as MagnifyingGlass} from '../../assets/images/magnifying-glass.svg';
import AvatarIcon from '../../assets/images/avatar-icon.png'

const SlidingSideNav = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div id='SlidingMenu' style={{right: isMenuOpen ? '0' : '-435px'}}>
        <div id='menuBkgrnd' style={{ right: isMenuOpen ? '0' : '-100%' }} onClick={toggleMenu}></div>
        <nav id='menuBox'>
          <div className='col-left'>
            <div id="closeBtn" onClick={toggleMenu}>
              <i class="fa fa-times"></i>
            </div>
          </div>
          <div className='col-right'>
            <div className='row1'>
              <div className="avatar-icon"><img src={AvatarIcon} alt="" /></div>
              <Link to='/LoginEmail'><h4>Hello, sign in</h4></Link>
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
