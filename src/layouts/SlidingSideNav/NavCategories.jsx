import React, { useEffect, useState } from 'react';
import { GetAllCategories } from '../../apicalls/products'
import { useDispatch } from 'react-redux';
import { Setloader } from '../../redux/reducer/loadersSlice';


const NavCategories = () => {

  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        dispatch(Setloader(true))
        const response = await GetAllCategories();
        setCategories(response.data);
        dispatch(Setloader(false))
      } catch (error) {
        dispatch(Setloader(false))
        console.error("Error fetching data:", error);
      }
    };

    fetchCategories();
  }, [dispatch]);



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
