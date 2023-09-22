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
                    <SlidingSideNav />
                </li>
            </ul>
        </nav>
    </>
  )
}

export default NavMenu
