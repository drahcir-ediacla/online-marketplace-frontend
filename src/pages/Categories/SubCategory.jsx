import React, { useEffect, useState } from 'react'
import axios from '../../apicalls/axios'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Setloader } from '../../redux/reducer/loadersSlice'
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import { Link } from 'react-router-dom'
import CategoryProductFilter from '../../components/ProductFilter/CategoryProductFilter'
import subcategoryItemsData from '../../data/subcategoryItemsData.json'
import ProductCard from '../../components/Cards/ProductCard'
import ListingCard from '../../components/Cards/ListingCard'

const SubCategory = () => {

  const { id } = useParams();
  const [category, setCategory] = useState([]);
  const [err, setErr] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(Setloader(true));

      try {
        // Fetch the category's data
        const response = await axios.get(`/api/getcategory/${id}`);

        setCategory(response.data);
        dispatch(Setloader(false));

      } catch (error) {
        dispatch(Setloader(false));
        console.error('Error fetching category data:', error);

        // Check if the error is due to unauthorized access
        if (error.response && error.response.status === 500) {
          return error.message
          // Handle unauthorized access, e.g., redirect to login
        } else {
          // Handle other errors
          setErr(true); // Depending on your requirements
        }
      }
    }
    fetchData();
  }, [id, dispatch])

  // if (!category) {
  //   // If category is still null, you can render a loading spinner or some other loading indicator.
  //   return (
  //     <>
  //       <Header />
  //       <div>
  //         <LoadingSpinner />
  //       </div>
  //       <Footer />
  //     </>
  //   );
  // }

  return (
    <>
      <Header />
      <div className='container sub-category-body'>
        <div className="row1">
          <ul className='breadcrumb'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/MainCategory'>Mobiles & Electronics</Link></li>
            <li>Headphones</li>
          </ul>
        </div>
        <div className="row2 sub-category-banner">Your ADS Here</div>
        <div className="row3 sub-category-newly-listed">
          <div className="sub-category-newly-listed-row1">
            <div className='product-section-title'>
              <h3>{category.label}</h3>
            </div>
          </div>
          <div className='sub-category-newly-listed-row2'><CategoryProductFilter /></div>
          <div className='sub-category-newly-listed-row3'>
            <ProductCard
              data={category.products || []}
              city={category.city || ''}
              region={category.region || ''}
            /></div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default SubCategory
