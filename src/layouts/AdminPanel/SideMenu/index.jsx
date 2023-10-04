import React, { useEffect } from 'react'
import './style.scss'
import Logo from '../../../assets/images/Yogeek-logo-light-gray.png'
import { ReactComponent as DashboardIcon } from '../../../assets/images/dashboard-icon.svg'
import { ReactComponent as PagesIcon } from '../../../assets/images/pages-icon.svg'
import { ReactComponent as CategoriesIcon } from '../../../assets/images/categories-icon.svg'
import { ReactComponent as CustomersIcon } from '../../../assets/images/customers-icon.svg'
import { ReactComponent as BannersIcon } from '../../../assets/images/banners-icon.svg'
import { ReactComponent as GearIcon } from '../../../assets/images/gear-icon.svg'
import { ReactComponent as LogoutIcon } from '../../../assets/images/logout-icon.svg'



const SideMenu = () => {

  
  useEffect(() => {
    const collapsibleElements = document.getElementsByClassName("collapsible");

    const handleCollapsibleClick = function () {
      // Toggle the active class on the clicked element
      this.classList.toggle("active");
      const content = this.nextElementSibling;

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }

      // Close other currently active elements
      for (let i = 0; i < collapsibleElements.length; i++) {
        if (collapsibleElements[i] !== this) {
          collapsibleElements[i].classList.remove("active");
          collapsibleElements[i].nextElementSibling.style.maxHeight = null;
        }
      }
    };

    for (let i = 0; i < collapsibleElements.length; i++) {
      collapsibleElements[i].addEventListener("click", handleCollapsibleClick);
    }

    return () => {
      // Clean up event listeners when the component unmounts
      for (let i = 0; i < collapsibleElements.length; i++) {
        collapsibleElements[i].removeEventListener("click", handleCollapsibleClick);
      }
    };
  }, []);



  return (
    <>
      <div className="side-menu-container">
        <div className='row1'>
          <img src={Logo} alt="" />
        </div>
        <div className='row2'>
          <div className="menu-box">
            <ul>
              <li className='menus'>
                <div className='main-menu'>
                  <div className='dashboard-icon menu-icon'><DashboardIcon /></div>
                  DASHBOARD
                </div>
              </li>
              <li className='menus'>
                <div className='main-menu collapsible'>
                  <div className='pages-icon menu-icon'><PagesIcon /></div>
                  PAGES
                </div>
                <ul className='sub-menu'>
                  <li>ALL PAGES</li>
                  <li>ADD PAGE</li>
                </ul>
              </li>
              <li className='menus'>
                <div className='main-menu collapsible'>
                  <div className='categories-icon menu-icon'><CategoriesIcon /></div>
                  CATEGORIES
                </div>
                <ul className='sub-menu'>
                  <li>MAIN CATEGORIES</li>
                  <li>SUB CATEGORIES</li>
                </ul>
              </li>
              <li className='menus'>
                <div className='main-menu'>
                  <div className='customers-icon menu-icon'><CustomersIcon /></div>
                  CUSTOMERS
                </div>
              </li>
              <li className='menus'>
                <div className='main-menu'>
                  <div className='banners-icon menu-icon'><BannersIcon /></div>
                  BANNERS
                </div>
              </li>
              <li className='menus'>
                <div className='main-menu'>
                  <div className='gear-icon menu-icon'><GearIcon /></div>
                  SETTINGS
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className='row3'>
          <div className="logout-btn">
            <div className="logout-icon"><LogoutIcon /></div>
            LOGOUT
          </div>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  )
}

export default SideMenu
