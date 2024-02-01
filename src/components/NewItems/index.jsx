import React, { useEffect, useState } from 'react'
import useAuthentication from '../../hooks/authHook';
import axios from '../../apicalls/axios';
import { AddWishlist, RemoveWishlist } from '../../apicalls/products';
import './style.scss'
import 'react-multi-carousel/lib/styles.css';
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import ProductCardSkeleton from '../SkeletonLoader/ProductCardSkeleton';
import BtnCategory from '../../components/Button/BtnCategory'
import BtnSeeMore from '../../components/Button/BtnSeeMore'


const NewItems = ({ data }) => {

  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  console.log("Category Data:", data)

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


  useEffect(() => {
    // Set the first category as active by default
    if (data.length > 0) {
      setActiveCategory(data[0].label);
    }
  }, [data]);


  useEffect(() => {
    const fetchData = async () => {

      try {

        const categoryId = data.find(category => category.label === activeCategory)?.id;

        if (!categoryId) {
          return;
        }

        // Fetch the all product's data
        const response = await axios.get(`/api/getcategory/${categoryId}`)

        const categoryData = response.data;

        // // Check if the properties exist in the response
        // const subCategoryProducts = categoryData.subCategoryProducts || [];
        // const products = categoryData.products || [];

        // Concatenate subCategoryProducts and products to get all products
        let allProducts = categoryData.allProducts || [];
        

        // Limit the number of items to the first 20
        allProducts = allProducts.slice(0, 20);

        setLoading(false);
        setCategoryData(allProducts);

      } catch (error) {
        setLoading(false)
        console.error('Error fetching product data:', error);
      }
    }
    fetchData();

  }, [activeCategory, data])

  // Check if data is null or undefined
  if (!categoryData) {
    return null; // or return some default content or loading indicator
  }



  // Specify the labels you want to include
  const includedLabels = ["Mobile and Electronics", "Sports & Leisure", "Men's Fashion", "Women's Fashion", "Furniture"];

  // Filter the categories based on the included labels
  const filteredCategories = data.filter(category => includedLabels.includes(category.label));


  const handleCategoryClick = (label) => {
    setActiveCategory(label);
  };

  const viewNewListing = () => {
    const categoryId = data.find(category => category.label === activeCategory)?.id;
    if (categoryId) {
      window.location.href = `/category/${categoryId}/${encodeURIComponent(activeCategory)}`;
    }
  };
  


  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
          <h3>Newly Listed Items</h3>
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

export default NewItems
