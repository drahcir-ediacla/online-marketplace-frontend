import React from 'react';
import {Link} from 'react-router-dom';
import SlidingSideNav from '../SlidingSideNav'

const NavMenu = () => {
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
                                <li><Link to="#">Clothing</Link></li>
                                <li><Link to="#">Shoes</Link></li>
                                <li><Link to="#">Watches & Accessories</Link></li>
                                <li><Link to="#">Tops & Sets</Link></li>
                                <li><Link to="#">Bottoms</Link></li>
                                <li><Link to="#">Bags</Link></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li>
                    <div className='btm-border'>
                        <Link to="/MainCategory" className='parent-menu'>Women's Fashion</Link>
                        <div className="drop-menu">
                            <ul>
                                <li><Link to="#">Clothing</Link></li>
                                <li><Link to="#">Shoes</Link></li>
                                <li><Link to="#">Watches & Accessories</Link></li>
                                <li><Link to="#">Tops & Sets</Link></li>
                                <li><Link to="#">Bottoms</Link></li>
                                <li><Link to="#">Bags</Link></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li><div className='btm-border'><Link to='/MainCategory' className='parent-menu'>Furniture</Link></div></li>
                <li><div className='btm-border'><Link to='/MainCategory' className='parent-menu'>Motors</Link></div></li>
                <li><div className='btm-border'><Link to='/MainCategory' className='parent-menu'>Jewelry & Watches</Link></div></li>
                <li>
                    <SlidingSideNav />
                </li>
            </ul>
        </nav>
    </>
  )
}

export default NavMenu
