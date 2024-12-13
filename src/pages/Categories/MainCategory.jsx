import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import axios from '../../apicalls/axios';
import './style.scss'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { AddWishlist, RemoveWishlist } from '../../apicalls/products';
import { ReactComponent as FilterIcon } from '../../assets/images/filter-icon.svg'
import { ReactComponent as LoadingSpinner } from '../../assets/images/loading-spinner.svg'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import SubCategoryCarousel from '../../components/Carousel/SubCategoryCarousel'
import ProductCard from '../../components/Cards/ProductCard'
import Breadcrumb from '../../components/Breadcrumb'
import SellBtn from '../../components/Button/SellBtn'
import FilterBy from '../../components/Button/FilterBy';
import CheckBox from '../../components/FormField/CheckBox/CheckBox';
import Input from '../../components/FormField/Input';
import BtnClear from '../../components/Button/BtnClear';
import BtnGreen from '../../components/Button/BtnGreen';
import RadioButton from '../../components/FormField/RadioButton';


const MainCategory = () => {

  const { categoryId, value } = useParams();
  const observer = useRef();
  const categories = useSelector((state) => state.productcategories.data);
  const user = useSelector((state) => state.user.data);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [hasMore, setHasMore] = useState(true);
  const [paginatedProducts, setPaginatedProducts] = useState([])
  const [category, setCategory] = useState({});
  // const [productStates, setProductStates] = useState({});
  const [wishlistCount, setWishlistCount] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState('Most Recent');
  const [filters, setFilters] = useState({
    condition: [],
    sort: '',
    dealOption: [],
  });
  console.log('filters:', filters)

  const [filterPrice, setFilterPrice] = useState({
    minPrice: '',
    maxPrice: '',
  });

  // const [currentCategory, setCurrentCategory] = useState(categoryId);
  const containerRef = useRef(null);

  useEffect(() => {
    // Reset page and clear products when filters or sorting changes
    setPage(1);
  }, [categoryId, value, filters, filters.sort, filterPrice]);

  useEffect(() => {
    // Reset filters when the category changes
    setFilters({
      condition: [],
      sort: '',
      dealOption: [],
    });
    setFilterPrice({
      minPrice: '',
      maxPrice: '',
    });
    // setCurrentCategory(categoryId);
  }, [categoryId]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      if (loadingRecent) return; // Prevent multiple simultaneous fetches

      setLoadingRecent(true);

      try {
        const response = await axios.get(`/api/getcategory/${categoryId}/${value}`, {
          params: {
            page,
            limit,
            ...filters,
            ...filterPrice,
            sort: filters.sort,
          },
        });

        const newFetchedProducts = response.data.paginatedProducts;

        // Reset or append products based on the current page
        if (page === 1) {
          setPaginatedProducts(newFetchedProducts); // Replace products on the first page
        } else {
          setPaginatedProducts((prevData) => {
            const uniqueData = newFetchedProducts.filter(
              (item) => !prevData.some((existingItem) => existingItem.id === item.id)
            );
            return [...prevData, ...uniqueData];
          });
        }

        setCategory(response.data);
        setHasMore(newFetchedProducts.length > 0);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchData();
  }, [filters, filters.sort, page, limit]);



  // Intersection Observer callback
  const lastElementRef = (node) => {
    if (loadingRecent) return; // Don't observe if loading

    if (observer.current) observer.current.disconnect(); // Disconnect previous observer

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    });

    if (node) observer.current.observe(node); // Observe the last element
  };


  const toggleFilter = () => {
    setFilterOpen((prevFilterOpen) => !prevFilterOpen)
  }

  const toggleFilterVisibility = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleSortByChange = (event) => {
    const selectedSortBy = event.target.value;
    setPage(1);
    setSortBy(selectedSortBy); // Update the local state
    setFilters((prevFilters) => ({ ...prevFilters, sort: selectedSortBy }));
  };

  const handleFilterChange = (event) => {
    const { name, value, checked } = event.target;
    setPage(1);

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name === 'condition' || name === 'dealOption'
        ? checked
          ? [...prevFilters[name], value] // Add the value to the array if checked
          : prevFilters[name].filter((filterValue) => filterValue !== value) // Remove the value if unchecked
        : value,
    }));
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setFilterPrice((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = () => {
    setPage(1)
    setFilters((prevFilters) => ({ ...prevFilters, applied: true }));
  };

  const resetFilters = () => {
    setPage(1)
    setFilterPrice({
      minPrice: '',
      maxPrice: '',
    });

    setFilters((prevFilters) => ({
      ...prevFilters,
      condition: [],
      sort: '',
      dealOption: [],
      applied: false, // Reset the applied property
    }));

    // Reset the input fields
    const minPriceInput = document.querySelector('input[name="minPrice"]');
    const maxPriceInput = document.querySelector('input[name="maxPrice"]');

    if (minPriceInput && maxPriceInput) {
      minPriceInput.value = '';
      maxPriceInput.value = '';
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      applyFilters();
    }
  };


  // Add and remove wishlist function
  const addToWishlist = async (productId) => {
    try {
      const response = await AddWishlist(productId, {});
      console.log(response.data);
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await RemoveWishlist(productId, {});
      console.log(response.data);
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };


  // Memoize paginatedProducts
  // const paginatedProducts = useMemo(
  //   () => (Array.isArray(category?.paginatedProducts) ? category.paginatedProducts : []),
  //   [category?.paginatedProducts]
  // );

  // Memoize subcategories
  const subcategories = useMemo(
    () => (Array.isArray(category?.subcategories) ? category.subcategories : []),
    [category?.subcategories]
  );



  // Use useCallback to memoize the function
  const getWishlistCount = useCallback((productId) => {
    const productData = paginatedProducts.find((product) => product.id === productId);
    return productData ? (productData.wishlist ? productData.wishlist.length : 0) : 0;
  }, [paginatedProducts]);

  // Use useEffect to update wishlist count after state changes
  useEffect(() => {
    // Update wishlist count for all products
    const updatedWishlistCounts = {};
    paginatedProducts.forEach((product) => {
      updatedWishlistCounts[product.id] = getWishlistCount(product.id);
    });

    // Set the updated wishlist counts
    setWishlistCount(updatedWishlistCounts);
  }, [paginatedProducts, getWishlistCount]);



  // Initialize productStates based on initial wishlist data
  // useEffect(() => {
  //   const initialProductStates = {};
  //   paginatedProducts.forEach((product) => {
  //     const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
  //     initialProductStates[product.id] = isProductInWishlist;
  //   });
  //   setProductStates(initialProductStates);
  // }, [paginatedProducts, userId]);



  return (
    <>
      <Header />
      <div className='container'>
        <div className='main-category-body'>
          <div className="row1">
            <Breadcrumb categories={categories} selectedCategory={categoryId} />
          </div>
          <div className="row2 main-category-banner">ADS or HTML Description Here</div>
          {subcategories && subcategories.length > 0 && (
            <div className="sub-categories-container">
              <SubCategoryCarousel data={subcategories} />
            </div>
          )}
          <div className="row4 main-category-newly-listed">
            <div className="main-category-newly-listed-row1">
              <div className='product-section-title'>
                <h3>{category?.label}</h3>
              </div>
            </div>
            <div className='main-category-newly-listed-row2'>
              {/* LARGE SCREEN PRODUCT FILTER */}
              <div className='prod-filter-container' ref={containerRef}>
                <div className='group-filterby'>
                  <div className='filter-sortby'>
                    <FilterBy
                      label='Sort By'
                      arrowStyle={activeFilter === 'sortByFilter' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
                      onClick={() => toggleFilterVisibility('sortByFilter')}
                    />
                    {activeFilter === 'sortByFilter' && (
                      <ul className='filter-sortby-options'>
                        <li>
                          <RadioButton
                            id="mostRecent"
                            name="sort"
                            value="recent"
                            label="Most Recent"
                            checked={sortBy === 'Most Recent' || filters.sort.includes('recent')}
                            onChange={handleSortByChange}
                          />
                        </li>
                        <li>
                          <RadioButton
                            id="priceHighToLow"
                            name="sort"
                            value="highToLow"
                            label="Price - High to Low"
                            checked={sortBy === 'Price - High to Low' || filters.sort.includes('highToLow')}
                            onChange={handleSortByChange}
                          />
                        </li>
                        <li>
                          <RadioButton
                            id="priceLowtoHigh"
                            name="sort"
                            value="lowToHigh"
                            label="Price - Low to High"
                            checked={sortBy === 'Price - Low to High' || filters.sort.includes('lowToHigh')}
                            onChange={handleSortByChange}
                          />
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className='filter-condition'>
                    <FilterBy
                      label='Condition'
                      arrowStyle={activeFilter === 'condition' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
                      onClick={() => toggleFilterVisibility('condition')}
                    />
                    {activeFilter === 'condition' && (
                      <ul className='filter-condition-options'>
                        <li>
                          <CheckBox
                            name='condition'
                            label='Brand New'
                            value='Brand New'
                            checked={filters.condition.includes('Brand New')}
                            onChange={handleFilterChange}
                          />
                        </li>
                        <li>
                          <CheckBox
                            name='condition'
                            label='Like New'
                            value='Like New'
                            checked={filters.condition.includes('Like New')}
                            onChange={handleFilterChange}
                          />
                        </li>
                        <li>
                          <CheckBox
                            name='condition'
                            label='Lightly Used'
                            value='Lightly Used'
                            checked={filters.condition.includes('Lightly Used')}
                            onChange={handleFilterChange}
                          />
                        </li>
                        <li>
                          <CheckBox
                            name='condition'
                            label='Well Used'
                            value='Well Used'
                            checked={filters.condition.includes('Well Used')}
                            onChange={handleFilterChange}
                          />
                        </li>
                        <li>
                          <CheckBox
                            name='condition'
                            label='Heavily Used'
                            value='Heavily Used'
                            checked={filters.condition.includes('Heavily Used')}
                            onChange={handleFilterChange}
                          />
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className='filter-deal-option'>
                    <FilterBy
                      label='Deal Option'
                      arrowStyle={activeFilter === 'dealOption' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
                      onClick={() => toggleFilterVisibility('dealOption')}
                    />
                    {activeFilter === 'dealOption' && (
                      <ul className='filter-deal-options'>
                        <li>
                          <CheckBox
                            name='dealOption'
                            label='Meet Up'
                            value='Meet Up'
                            checked={filters.dealOption.includes('Meet Up')}
                            onChange={handleFilterChange}
                          />
                        </li>
                        <li>
                          <CheckBox
                            name='dealOption'
                            label='Delivery'
                            value='Delivery'
                            checked={filters.dealOption.includes('Delivery')}
                            onChange={handleFilterChange}
                          />
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className='filter-price'>
                    <FilterBy
                      label='Price'
                      arrowStyle={activeFilter === 'priceFilter' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
                      onClick={() => toggleFilterVisibility('priceFilter')}
                    />
                    {activeFilter === 'priceFilter' && (
                      <div className='filter-price-input'>
                        <p>Show item price from</p>
                        <div className='filter-price-row1'>
                          <div className='input-price-filter-container'>
                            <span className='php-symbol'>₱</span>
                            <Input
                              type='number'
                              name="minPrice"
                              value={filterPrice.minPrice}
                              onChange={handlePriceChange}
                              onKeyPress={handleEnterKeyPress}
                              className='input-price-filter'
                              placeholder='Minimum'
                            />
                          </div>
                          -
                          <div className='input-price-filter-container'>
                            <span className='php-symbol'>₱</span>
                            <Input
                              type='number'
                              name="maxPrice"
                              value={filterPrice.maxPrice}
                              onChange={handlePriceChange}
                              onKeyPress={handleEnterKeyPress}
                              className='input-price-filter'
                              placeholder='Maximum'
                            />
                          </div>
                        </div>
                        <hr />
                        <div className='filter-price-row2'>
                          <BtnClear label='Reset' onClick={resetFilters} />
                          <BtnGreen label='Apply' onClick={applyFilters} className="apply-price-range" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* SMALL SCREEN PRODUCT FILTER */}
              <div className='small-screen-prod-filter-container'>
                <button className='custom-filter-button' onClick={toggleFilter}>
                  <span>Filter Items</span><div className="filter-icon"><FilterIcon /></div>
                </button>
              </div>
              {filterOpen &&
                <div className="ss-product-filter-form">
                  <div className="ss-product-filter-form-row1">
                    <span>Filter Items</span>
                    <div className="ss-product-filter-form-close-btn" onClick={toggleFilter}>
                      <i className="fa fa-times"></i>
                    </div>
                  </div>
                  <div className='ss-product-filter-form-row2'>
                    <div className="all-filter-options-container">
                      <div className="sortby-container">
                        <span className='filter-options-label'>Sort By</span>
                        <div className="sortby-options">
                          <ul className='filter-sortby-options'>
                            <li>
                              <RadioButton
                                id="mostRecent"
                                name="sort"
                                value="recent"
                                label="Most Recent"
                                checked={sortBy === 'Most Recent' || filters.sort.includes('recent')}
                                onChange={handleSortByChange}
                              />
                            </li>
                            <li>
                              <RadioButton
                                id="priceHighToLow"
                                name="sort"
                                value="highToLow"
                                label="Price - High to Low"
                                checked={sortBy === 'Price - High to Low' || filters.sort.includes('highToLow')}
                                onChange={handleSortByChange}
                              />
                            </li>
                            <li>
                              <RadioButton
                                id="priceLowtoHigh"
                                name="sort"
                                value="lowToHigh"
                                label="Price - Low to High"
                                checked={sortBy === 'Price - Low to High' || filters.sort.includes('lowToHigh')}
                                onChange={handleSortByChange}
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filterby-condition-container">
                        <span className='filter-options-label'>Conditions</span>
                        <ul className='filter-condition-options'>
                          <li>
                            <CheckBox
                              name='condition'
                              label='Brand New'
                              value='Brand New'
                              checked={filters.condition.includes('Brand New')}
                              onChange={handleFilterChange}
                            />
                          </li>
                          <li>
                            <CheckBox
                              name='condition'
                              label='Like New'
                              value='Like New'
                              checked={filters.condition.includes('Like New')}
                              onChange={handleFilterChange}
                            />
                          </li>
                          <li>
                            <CheckBox
                              name='condition'
                              label='Lightly Used'
                              value='Lightly Used'
                              checked={filters.condition.includes('Lightly Used')}
                              onChange={handleFilterChange}
                            />
                          </li>
                          <li>
                            <CheckBox
                              name='condition'
                              label='Well Used'
                              value='Well Used'
                              checked={filters.condition.includes('Well Used')}
                              onChange={handleFilterChange}
                            />
                          </li>
                          <li>
                            <CheckBox
                              name='condition'
                              label='Heavily Used'
                              value='Heavily Used'
                              checked={filters.condition.includes('Heavily Used')}
                              onChange={handleFilterChange}
                            />
                          </li>
                        </ul>
                      </div>
                      <div className='filter-price-input'>
                        <span className='filter-options-label'>Show item price from</span>
                        <div className='filter-price-row1'>
                          <div className='input-price-filter-container'>
                            <span className='php-symbol'>₱</span>
                            <Input
                              type='number'
                              name="minPrice"
                              className='input-price-filter'
                              placeholder='Minimum'
                              value={filterPrice.minPrice}
                              onChange={handlePriceChange}
                            />
                          </div>
                          <div className='input-price-filter-container'>
                            <span className='php-symbol'>₱</span>
                            <Input
                              type='number'
                              name="maxPrice"
                              className='input-price-filter'
                              placeholder='Maximum'
                              value={filterPrice.maxPrice}
                              onChange={handlePriceChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="deal-options-container">
                        <span className='filter-options-label'>Deal Options</span>
                        <ul className='filter-deal-options'>
                          <li>
                            <CheckBox
                              name='dealOption'
                              label='Meet Up'
                              value='Meet Up'
                              checked={filters.dealOption.includes('Meet Up')}
                              onChange={handleFilterChange}
                            />
                          </li>
                          <li>
                            <CheckBox
                              name='dealOption'
                              label='Delivery'
                              value='Delivery'
                              checked={filters.dealOption.includes('Delivery')}
                              onChange={handleFilterChange}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="filter-buttons">
                      <BtnClear label='Reset' onClick={resetFilters} />
                      <BtnGreen label='Apply' onClick={() => { applyFilters(); toggleFilter(); }} />
                    </div>
                  </div>
                </div>
              }
              {/* <CategoryProductFilter
                categoryId={id}
                value={value}
                updateCategoryData={setCategory}
              />
              <SmallScreenProductFilter
                categoryId={id}
                value={value}
                updateCategoryData={setCategory}
              /> */}
            </div>
            <div className='main-category-newly-listed-row3'>
              {paginatedProducts.length > 0 ? (
                <ProductCard
                  data={paginatedProducts || []}
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeFromWishlist}
                  userId={user?.id}
                  wishlistCount={wishlistCount}
                  setWishlistCount={setWishlistCount}
                  getWishlistCount={getWishlistCount}
                />
              ) : (
                <>
                  <h4>No result found!</h4>
                </>
              )}
            </div>
            {/* Trigger for the next page */}
            {hasMore && (
              <div ref={lastElementRef} style={{ height: '20px', backgroundColor: 'transparent' }}></div>
            )}
            {loadingRecent && <div className='infinite-scroll-loading-spinner'><LoadingSpinner /></div>}
            {!hasMore && <div className='no-more-data'>No more data to load</div>}
          </div>
        </div>
      </div>
      <Footer />
      <SellBtn />
    </>
  )
}

export default MainCategory