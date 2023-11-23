import React, { useEffect, useState } from 'react';
import axios from '../../apicalls/axios';
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

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/getproductcategories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);



  const [activeCollapsible, setActiveCollapsible] = useState([]);

  const handleToggleCollapsible = (index) => {
    setActiveCollapsible((prevActiveCollapsible) => {
      const updatedCollapsible = [...prevActiveCollapsible];
      updatedCollapsible[index] = !updatedCollapsible[index];

      // Close other active collapsibles
      updatedCollapsible.forEach((value, i) => {
        if (i !== index) {
          updatedCollapsible[i] = false;
        }
      });

      return updatedCollapsible;
    });
  };


  return (
    <>
      <div className='nav-categories'>
        <ul>
          {categories.map((category, index) => (
            <li className='main-category' key={index}>
              <div className='category-icon'>
                <img src={category.icon} alt='' />
                {category.label}
              </div>

              {category.subcategories && category.subcategories.length > 0 && (
                <>
                  <div
                    className={`collapsible ${activeCollapsible[index] ? 'active' : ''}`}
                    onClick={() => handleToggleCollapsible(index)}
                  ></div>
                  {activeCollapsible[index] && (
                    <ul className='sub-category'>
                      {category.subcategories.map((subCategory, subIndex) => (
                        <li key={subIndex}>{subCategory.label}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NavCategories
