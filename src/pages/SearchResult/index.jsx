import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import './style.scss'
import axios from '../../apicalls/axios'
import { AddWishlist, RemoveWishlist } from '../../apicalls/products';
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import SearchResultFilter from '../../components/ProductFilter/SearchResultFilter'
import ProductCard from '../../components/Cards/ProductCard'
import FilterBy from '../../components/Button/FilterBy'
import CheckBox from '../../components/FormField/CheckBox/CheckBox'
import Input from '../../components/FormField/Input'
import BtnClear from '../../components/Button/BtnClear'
import BtnGreen from '../../components/Button/BtnGreen'
import RadioButton from '../../components/FormField/RadioButton'

const SearchResult = () => {

  const location = useLocation();
  const containerRef = useRef(null);
  const user = useSelector((state) => state.user.data);

  const searchTerm = new URLSearchParams(location.search).get('keyword');
  const searchFilterLocation = new URLSearchParams(location.search).get('location');
  const latitude = new URLSearchParams(location.search).get('latitude');
  const longitude = new URLSearchParams(location.search).get('longitude');
  const radius = new URLSearchParams(location.search).get('radius');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(null)
  const [limit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [sortBy, setSortBy] = useState('Most Recent');
  const [filters, setFilters] = useState({
    condition: [],
    sort: '',
  });

  const [filterPrice, setFilterPrice] = useState({
    minPrice: '',
    maxPrice: '',
  })
  const [products, setProducts] = useState([]);

  // const [productStates, setProductStates] = useState({});
  const [wishlistCount, setWishlistCount] = useState({});


  useEffect(() => {
    // Reset filters when the category changes
    setFilters({
      condition: [],
      sort: '',
    });
    setFilterPrice({
      minPrice: '',
      maxPrice: '',
    });
    setFiltersApplied(false);
  }, []);



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



  // Perform API call with the selected filters and sorting option
  const fetchSearchResults = async (page = 1) => {
    try {
      const params = {
        ...filters,
        ...filterPrice,
        keyword: searchTerm,
        location: searchFilterLocation,
        sort: filters.sort,
        latitude: searchFilterLocation === 'Listings Nearby' ? latitude : undefined,
        longitude: searchFilterLocation === 'Listings Nearby' ? longitude : undefined,
        radius: searchFilterLocation === 'Listings Nearby' ? radius : undefined,
        page,
        limit,
      };

      const response = await axios.get(`/api/search`, { params });

      setProducts(response.data.products);
      setTotalProducts(response.data.totalProducts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    fetchSearchResults(currentPage);
  }, [currentPage, location.search, searchTerm, searchFilterLocation, filters, filtersApplied]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const toggleFilterVisibility = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };


  const handleSortByChange = (event) => {
    const selectedSortBy = event.target.value;
    setSortBy(selectedSortBy); // Update the local state
    setFilters((prevFilters) => ({ ...prevFilters, sort: selectedSortBy }));
  };


  const handleFilterChange = (event) => {
    const { name, value, checked } = event.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name === 'condition'
        ? checked
          ? [...prevFilters.condition, value] // Add the value to the array if checked
          : prevFilters.condition.filter((condition) => condition !== value) // Remove the value if unchecked
        : value,
    }));
  };


  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setFilterPrice((prevFilters) => ({ ...prevFilters, [name]: value }));
  };


  const applyFilters = () => {
    setFiltersApplied(true);
  };

  const resetFilters = () => {
    setFilterPrice({
      minPrice: '',
      maxPrice: '',
    });

    setFiltersApplied(false);

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



  // Use useCallback to memoize the function
  const getWishlistCount = useCallback((productId) => {
    const productData = products.find((product) => product.id === productId);
    return productData ? (productData.wishlist ? productData.wishlist.length : 0) : 0;
  }, [products]);

  // Use useEffect to update wishlist count after state changes
  useEffect(() => {
    // Update wishlist count for all products
    const updatedWishlistCounts = {};
    products.forEach((product) => {
      updatedWishlistCounts[product.id] = getWishlistCount(product.id);
    });

    // Set the updated wishlist counts
    setWishlistCount(updatedWishlistCounts);

    console.log('Wishlist count updated:', updatedWishlistCounts);
  }, [products, getWishlistCount]);



  // Initialize productStates based on initial wishlist data
  // useEffect(() => {
  //   const initialProductStates = {};
  //   products.forEach((product) => {
  //     const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
  //     initialProductStates[product.id] = isProductInWishlist;
  //   });
  //   console.log('Initial Product States:', initialProductStates);
  //   setProductStates(initialProductStates);
  // }, [products, userId]);


  return (
    <>
      <Header />
      <div className='container'>
        <div className='search-result-body'>
          <div className="row2 search-result-banner">Your ADS Here</div>
          <div className="row3 search-result-newly-listed">
            <div className="search-result-newly-listed-row1">
              <div className='product-section-title'>
                <h4>Search Results for "{searchTerm}" in {searchFilterLocation}</h4>
                <h5>Total Results: {totalProducts}</h5>
              </div>
            </div>
            <div className='search-result-newly-listed-row2'>
              <div className='prod-filter-container' ref={containerRef}>
                <div className='group-filterby'>
                  <div className='filter-sortby'>
                    <FilterBy
                      label='Sort By'
                      arrowStyle={activeFilter === 'sortByFilter' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
                      onClick={() => toggleFilterVisibility('sortByFilter')} />
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
                      onClick={() => toggleFilterVisibility('condition')} />
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
                      onClick={() => toggleFilterVisibility('dealOption')} />
                    {activeFilter === 'dealOption' && (
                      <ul className='filter-deal-options'>
                        <li><CheckBox label='Meet Up' value='Meet Up' /></li>
                        <li><CheckBox label='Mailing and Delivery' value='Mailing and Delivery' /></li>
                      </ul>
                    )}
                  </div>
                  <div className='filter-price'>
                    <FilterBy
                      label='Price'
                      arrowStyle={activeFilter === 'priceFilter' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
                      onClick={() => toggleFilterVisibility('priceFilter')} />
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
                          <BtnGreen label='Apply' onClick={applyFilters} className='apply-price-range' />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='search-result-newly-listed-row3'>
              <ProductCard
                data={products || []}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
                userId={user?.id}
                wishlistCount={wishlistCount}
                setWishlistCount={setWishlistCount}
                getWishlistCount={getWishlistCount}
              />
            </div>
            {totalProducts > 30 &&
              <div className="pagination">
                <li className='page-item'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='page-link'
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <li key={page} className='page-item'>
                    <button
                      onClick={() => handlePageChange(page)}
                      className={page === currentPage ? 'active page-link' : 'page-link'}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className='page-item'>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='page-link'
                  >
                    Next
                  </button>
                </li>
              </div>
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default SearchResult