import React, { useEffect } from 'react';
import CategoryIcon1 from '../../assets/images/category-icon1.png'
import CategoryIcon2 from '../../assets/images/category-icon2.png'
import CategoryIcon3 from '../../assets/images/category-icon3.png'
import CategoryIcon4 from '../../assets/images/category-icon4.png'
import CategoryIcon5 from '../../assets/images/category-icon5.png'
import CategoryIcon6 from '../../assets/images/category-icon6.png'
import CategoryIcon7 from '../../assets/images/category-icon7.png'
import CategoryIcon8 from '../../assets/images/category-icon8.png'
import CategoryIcon9 from '../../assets/images/category-icon9.png'
import CategoryIcon10 from '../../assets/images/category-icon10.png'

const NavCategories = () => {

  useEffect(() => {
    const collapsibleElements = document.getElementsByClassName("collapsible");

    const handleCollapsibleClick = function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
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
      <div className='nav-categories'>
        <ul>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon1} alt="" />Mobile and Electronics</div>
          </li>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon2} alt="" />Furniture</div>
          </li>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon3} alt="" />Home, Garden & DIY</div>
          </li>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon4} alt="" />Baby & Kids</div>
          </li>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon5} alt="" />Women’s Fashion</div>
            <div className="collapsible"></div>
            <ul className='sub-category'>
              <li>Bottoms</li>
              <li>Tops & Sets</li>
              <li>Footwear</li>
              <li>Coats & Jackets</li>
              <li>Bags</li>
              <li>Watches and Accessories</li>
            </ul>
          </li>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon6} alt="" />Men’s Fashion</div>
            <div className="collapsible"></div>
            <ul className='sub-category'>
              <li>Bottoms</li>
              <li>Tops & Sets</li>
              <li>Footwear</li>
              <li>Coats & Jackets</li>
              <li>Bags</li>
              <li>Watches and Accessories</li>
            </ul>
          </li>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon7} alt="" />Health & Beauty</div>
          </li>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon8} alt="" />Sports & Leisure</div>
          </li>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon9} alt="" />Games, Hobbies & Crafts</div>
          </li>
          <li className='main-category'>
            <div className='category-icon'><img src={CategoryIcon10} alt="" />Book, Music & Tickets</div>
          </li>
        </ul>
      </div>
    </>
  )
}

export default NavCategories