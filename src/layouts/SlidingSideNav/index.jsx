import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/actions/userActions';
import { getProductCategories } from '../../redux/actions/productCategoriesActions';
import { Link } from 'react-router-dom';
import { GetAllCategories } from '../../apicalls/products';
import './style.scss'
import { ReactComponent as GridIcon } from '../../assets/images/grid-icon.svg';
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import { ReactComponent as BurgerBtn } from '../../assets/images/burger-btn.svg'
import AvatarIcon from '../../assets/images/avatar-icon.png'
import SlidingNavSkeleton from '../../components/SkeletonLoader/SlidingNavSkeleton';


const SlidingSideNav = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const categories = useSelector((state) => state.productcategories.data);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);


  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  // FETCH AUTHENTICATED USER //
  useEffect(() => {
    dispatch(getUser())
  }, [dispatch]);

  useEffect(() => {
    if (categories.length === 0) {
      setLoading(true);
      dispatch(getProductCategories());
    }
    else {
      setLoading(false);
    }
  }, [dispatch, categories]);

  useEffect(() => {
    setFilteredCategories(categories)
  }, [])

  const myProfile = async () => {
    try {
      if (user) {
        window.location.href = `/profile/${user?.id}`;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  // FETCH ALL CATEGORIES //
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await GetAllCategories();
  //       setCategories(response.data);
  //       setFilteredCategories(response.data); // Initialize filteredCategories here
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false); // Set loading to false regardless of success or failure
  //     }
  //   };

  //   fetchCategories();
  // }, []);


  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm === '') {
      setFilteredCategories(categories); // Reset to all categories when searchTerm is empty
      return;
    }

    const filtered = categories.filter(category => {
      return category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.subcategories.some(sub => sub.label.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    setFilteredCategories(filtered);
  };


  useEffect(() => {
    // Update body overflow based on isMenuOpen
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';

    // Cleanup the effect
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);



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
        <div className="burger-btn-icon">
          <BurgerBtn />
        </div>
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
                <>
                  <div>
                    {user.profile_pic && user.profile_pic.length > 0 ? (
                      <div className="avatar-icon">
                        <Link onClick={myProfile}><img src={user.profile_pic} alt="" /></Link>
                      </div>
                    ) : (
                      <div className="avatar-icon">
                        <Link onClick={myProfile}><img src={AvatarIcon} alt="" className='avatar-image-icon' /></Link>
                      </div>
                    )}
                    <Link onClick={myProfile}><h5>{user.display_name || 'Anonymous'}</h5></Link>
                  </div>
                  <div className="small-device-close-btn">
                    <div id="closeBtn" onClick={toggleMenu}>
                      <i className="fa fa-times"></i>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="avatar-icon">
                      <img src={AvatarIcon} alt="" className='avatar-image-icon' />
                    </div>
                    <Link to='/LoginEmail'><h5>Hello, sign in</h5></Link>
                  </div>
                  <div className="small-device-close-btn">
                    <div id="closeBtn" onClick={toggleMenu}>
                      <i className="fa fa-times"></i>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className='row2'>
              <div style={{ width: '100%' }}>
                <h5>All Categories</h5>
                <div className='search-container'>
                  <input
                    type="text"
                    placeholder='Search Categories'
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button><div className='magnifying-glass'><MagnifyingGlass /></div></button>
                </div>
              </div>
            </div>
            <div className='row3'>
              <div className='nav-categories'>
                <ul>
                  {loading && <SlidingNavSkeleton menus={10} />}
                  {filteredCategories.map((category, index) => {
                    return (
                      <li className='main-category' key={index}>
                        <div className={`category-icon`}>
                          <img src={category.icon} alt='' />
                          <Link to={`/category/${category.id}/${category.value}`} onClick={toggleMenu}>
                            {category.label}
                          </Link>
                        </div>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <>
                            <div
                              className={`collapsible ${activeCollapsible[index] ? 'active' : '' || searchTerm ? 'hide-arrow' : ''}`}
                              onClick={() => handleToggleCollapsible(index)}
                            ></div>
                            {(activeCollapsible[index] || searchTerm) && (
                              <ul className='sub-category'>
                                {category.subcategories.map((subCategory, subIndex) => (
                                  subCategory.label.toLowerCase().includes(searchTerm.toLowerCase()) && (
                                    <li key={subIndex}>
                                      {subCategory.subcategories && subCategory.subcategories.length > 0 ? (
                                        <>
                                          <Link to={`/category/${subCategory.id}/${subCategory.label}`} onClick={toggleMenu}>
                                            {subCategory.label}
                                          </Link>
                                        </>
                                      ) : (
                                        <>
                                          <Link to={`/category/${subCategory.id}/${subCategory.label}`} onClick={toggleMenu}>
                                            {subCategory.label}
                                          </Link>
                                        </>
                                      )}
                                    </li>
                                  )
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}

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