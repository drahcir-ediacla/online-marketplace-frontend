import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/actions/userActions';
import { Link } from 'react-router-dom';
import axios from '../../apicalls/axios'
import { GetAllCategories } from '../../apicalls/products';
import './style.scss'
import { ReactComponent as GridIcon } from '../../assets/images/grid-icon.svg';
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import AvatarIcon from '../../assets/images/avatar-icon.png'
import SlidingNavSkeleton from '../../components/SkeletonLoader/SlidingNavSkeleton';

const GET_USER_LOGIN = '/auth/check-auth';




const SlidingSideNav = () => {


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.data);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);


  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  // FETCH AUTHENTICATED USER //
  useEffect(() => {
    dispatch(getUser())
  }, [dispatch]);

  const myProfile = async () => {
    try {
      const response = await axios.get(GET_USER_LOGIN);
      if (response.status === 200) {
        const resObject = response.data;
        const userId = resObject.user.id;
        window.location.href = `/profile/${userId}`;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  
  // FETCH ALL CATEGORIES //
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true); 
        const response = await GetAllCategories();
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchCategories();
  }, []);



  // SET COLLAPSIBLE //
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
                      <Link onClick={myProfile}><img src={user.profile_pic} alt="" /></Link>
                    </div>
                  ) : (
                    <div className="avatar-icon">
                      <Link onClick={myProfile}><img src={AvatarIcon} alt="" /></Link>
                    </div>
                  )}
                  <Link onClick={myProfile}><h5>{user.display_name || 'Anonymous'}</h5></Link>
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
              <div className='nav-categories'>
                <ul>
                  {loading && <SlidingNavSkeleton menus={10} />}
                  {categories.map((category, index) => (
                    <li className='main-category' key={index}>

                      <div className='category-icon'>
                        <img src={category.icon} alt='' />
                        <Link to={`/maincategory/${category.id}/${category.label}`} onClick={toggleMenu}>
                          {category.label}
                        </Link>
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
                                <li key={subIndex}>
                                  <Link to={`/subcategory/${subCategory.id}/${subCategory.label}`} onClick={toggleMenu}>
                                    {subCategory.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </nav>
      </div>
    </>
  )
}

export default SlidingSideNav
