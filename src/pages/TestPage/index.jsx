// import React, { useEffect, useRef, useState } from 'react';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';
// import MeetUpSelector from '../../components/MeetUpSelector';
// import SuccessResetPassword from '../../components/Modal/SuccessResetPassword';
// import SuccessEmailUpdated from '../../components/Modal/SuccessEmailUpdated'
// import './style.scss';

// const libraries = ['places'];

// const TestPage = () => {
 

//   return (
//     <>
//       <SuccessEmailUpdated />
//     </>
//   );
// }

// export default TestPage;


// App.js
// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import i18n from '../../utils/i18n';
// import GTranslate from '../../components/GTranslate';

// function App() {
//   const { t } = useTranslation();

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//   };

//   return (
//     <div>
//       <button onClick={() => changeLanguage('en')}>English</button>
//       <button onClick={() => changeLanguage('fr')}>French</button>
//       <h1>{t('welcome')}</h1>
//       <p>{t('description')}</p>
//       <GTranslate />
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import './style.scss';
import SuccessEmailUpdated from '../../components/Modal/SuccessEmailUpdated';

const App = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [largeImageSrc, setLargeImageSrc] = useState('');

  const handleImageClick = (src) => {
    setLargeImageSrc(src);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setLargeImageSrc('');
  };

  return (
    <div className="App">
      <SuccessEmailUpdated />
      <h1>Image Popup Example</h1>
      <div className="thumbnail-container">
        <img
          src="https://via.placeholder.com/150"
          alt="Thumbnail"
          className="thumbnail"
          onClick={() => handleImageClick('https://via.placeholder.com/600')}
        />
      </div>

      {showPopup && (
        <div className="popup" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={largeImageSrc} alt="Large" className="large-image" />
            <button className="close-button" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

