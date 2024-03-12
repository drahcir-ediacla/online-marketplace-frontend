import React from "react";
import { ReactComponent as ImageLoadingSpinner } from "../../assets/images/loading-spinner.svg";
import ItemImgGallery from "../../components/Gallery/ItemImgGallery";
import ReviewModal from "../../components/Modal/ReviewModal"



const LoadingSpinner = () => {
  
  const spinnerStyle = {
    width: '50px', // Set your desired width
    height: '50px', // Set your desired height
    fill: 'blue', // Set your desired fill color
    // Add any other styles as needed
  };

  return (
    <>
      {/* <ImageLoadingSpinner style={spinnerStyle}/>
      <ItemImgGallery /> */}
      <ReviewModal />
    </>
  )

}


export default LoadingSpinner;