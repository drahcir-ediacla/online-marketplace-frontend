import React, { useEffect, useState } from 'react'
import useAuthentication from '../../hooks/authHook';
import { MostViewedProductsByCategory, AddWishlist, RemoveWishlist } from '../../apicalls/products';
import './style.scss'
import BtnCategory from '../../components/Button/BtnCategory'
import BtnSeeMore from '../../components/Button/BtnSeeMore'
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import ProductCardSkeleton from '../SkeletonLoader/ProductCardSkeleton'

const PopularItems = ({ data }) => {

  const [products, setProducts] = useState([]);
  const [err, setErr] = useState(false);
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  // Filter the categories based on the included labels
  const filteredCategories = [];


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


  // Specify the labels you want to include
  const includedLabels = ["Sports Equipment & Supplies", "Iphone & Smartphones", "Video Cameras", "Men's Footwear"];


  const filterCategories = (category) => {
    if (includedLabels.includes(category.label)) {
      filteredCategories.push({ ...category });
    }

    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach(subcategory => filterCategories(subcategory));
    }
  };

  data.forEach(category => filterCategories(category));


  useEffect(() => {
    // Set the first category as active by default
    if (filteredCategories.length > 0 && !activeCategory) {
      setActiveCategory(filteredCategories[0].label);
    }
  }, [filteredCategories]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if activeCategory is set
        if (!activeCategory) {
          return;
        }

        // Find the category object for the active category
        const activeCategoryObject = filteredCategories.find(category => category.label === activeCategory);

        // Check if activeCategoryObject is found
        if (!activeCategoryObject) {
          return;
        }

        // Extract the categoryId from the activeCategoryObject
        const categoryId = activeCategoryObject.id;


        // Fetch the product data based on the categoryId
        const response = await MostViewedProductsByCategory(categoryId);

        // Update the categoryData state with the fetched data
        setCategoryData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, [activeCategory, data]);



  // Check if data is null or undefined
  if (!products) {
    return null; // or return some default content or loading indicator
  }

  

  const handleCategoryClick = (label) => {
    setActiveCategory(label);
  };

  const viewNewListing = () => {
    const categoryId = filteredCategories.find(category => category.label === activeCategory)?.id;
    if (categoryId) {
      window.location.href = `/category/${categoryId}/${encodeURIComponent(activeCategory)}`;
    }
    console.log('categoryId:', categoryId)
  }; 

  


  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
          <h3>Popular Items</h3>
        </div>
        <div className='product-section-btns'>
          <div className='sub-categories-btn'>
            {filteredCategories.map((category, index) => (
              <BtnCategory
                key={index}
                label={category.label}
                onClick={() => handleCategoryClick(category.label)}
                active={category.label === activeCategory}
              />
            ))}
          </div>
          <BtnSeeMore
            onClick={viewNewListing}
            label={`More ${activeCategory} >`}
          />
        </div>
        <div>
          {loading &&
            <div className='skeleton-card-container'>
              <ProductCardSkeleton card={5} />
            </div>
          }
          <ProductCarousel data={categoryData} addToWishlist={addToWishlist}
            removeFromWishlist={removeFromWishlist} userId={user?.id || ''} />
        </div>
      </div>
    </>
  )
}

export default PopularItems
