import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import NavCategories from '../SlidingSideNav/NavCategories'
import {ReactComponent as GridIcon} from '../../assets/images/grid-icon.svg';
import {ReactComponent as MagnifyingGlass} from '../../assets/images/magnifying-glass.svg';
import AvatarIcon from '../../assets/images/avatar-icon.png'

const NavMenu = ({user}) => {
    
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  return (
    <>
        <nav className='nav-menu'>
            <ul>
                <li><div className='btm-border'><Link to="/MainCategory" className='parent-menu'>Mobiles & Electronics</Link></div></li>
                <li><div className='btm-border'><Link to="/MainCategory" className='parent-menu'>Sports & Leisure</Link></div></li>
                <li>
                    <div className='btm-border'>
                        <Link to="/MainCategory" className='parent-menu'>Men’s Fashion</Link>
                        <div className="drop-menu">
                            <ul>
                                <li><Link to="/SubCategory">Clothing</Link></li>
                                <li><Link to="/SubCategory">Shoes</Link></li>
                                <li><Link to="/SubCategory">Watches & Accessories</Link></li>
                                <li><Link to="/SubCategory">Tops & Sets</Link></li>
                                <li><Link to="/SubCategory">Bottoms</Link></li>
                                <li><Link to="/SubCategory">Bags</Link></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li>
                    <div className='btm-border'>
                        <Link to="/MainCategory" className='parent-menu'>Women's Fashion</Link>
                        <div className="drop-menu">
                            <ul>
                                <li><Link to="/SubCategory">Clothing</Link></li>
                                <li><Link to="/SubCategory">Shoes</Link></li>
                                <li><Link to="/SubCategory">Watches & Accessories</Link></li>
                                <li><Link to="/SubCategory">Tops & Sets</Link></li>
                                <li><Link to="/SubCategory">Bottoms</Link></li>
                                <li><Link to="/SubCategory">Bags</Link></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li><div className='btm-border'><Link to='/MainCategory' className='parent-menu'>Furniture</Link></div></li>
                <li><div className='btm-border'><Link to='/MainCategory' className='parent-menu'>Motors</Link></div></li>
                <li><div className='btm-border'><Link to='/MainCategory' className='parent-menu'>Jewelry & Watches</Link></div></li>
                <li>
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
                                {user ? (
                                <div>
                                    {user.photos && user.photos.length > 0 ? (
                                    <div className="avatar-icon">
                                        <img src={user.photos[0].value} alt="" />
                                    </div>
                                    ) : (
                                    <div className="avatar-icon">
                                        <img src={AvatarIcon} alt="" />
                                    </div>
                                    )}
                                    <Link to='#'><h4>{user.display_name}</h4></Link>
                                </div>
                                ) : (
                                <div>
                                    <div className="avatar-icon">
                                    <img src={AvatarIcon} alt="" />
                                    </div>
                                    <Link to='/LoginEmail'><h4>Hello, sign in</h4></Link>
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
                </li>
            </ul>
        </nav>
    </>
  )
}

export default NavMenu
