import React, { useEffect, useState} from 'react'
import axios from '../../apicalls/axios'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Setloader } from '../../redux/reducer/loadersSlice'
import { Link } from 'react-router-dom'
import './style.scss'
import newItemsData from '../../data/newItemsData'
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import BtnCategory from  '../../components/Button/BtnCategory'
import BtnSeeMore from  '../../components/Button/BtnSeeMore'

const NewItems = () => {

  const { id, label } = useParams();
  const [category, setCategory] = useState([]);
  const [err, setErr] = useState(false);
  const dispatch = useDispatch();

  const subCategoryProducts = Array.isArray(category.subCategoryProducts) ? category.subCategoryProducts : [];
  const products = Array.isArray(category.products) ? category.products : [];
  const allProducts = [...subCategoryProducts, ...products];

  useEffect(() => {
    const fetchData = async () => {
      dispatch(Setloader(true));

      try {
        // Fetch the category's data
        const response = await axios.get('/api/getallproducts');

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
  }, [id, label, dispatch])


  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
            <h3>Newly Listed Items</h3>
        </div>
        <div className='product-section-btns'>
          <div className='sub-categories-btn'>
            <BtnCategory label="Shoes" className='active' />
            <BtnCategory label="Mobile" />
            <BtnCategory label="iPhone Accessories" />
            <BtnCategory label="Switch Games" />
            <BtnCategory label="Bicycles" />
            <BtnCategory label="Chanel" />
          </div>
          <BtnSeeMore label="See More Shoes >>" />
        </div>
        <div>
        <ProductCarousel data={category} />
        </div>
      </div>
    </>
  )
}

export default NewItems
