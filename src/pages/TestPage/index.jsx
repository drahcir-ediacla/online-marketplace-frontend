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


import LoginModal from '../../components/Modal/LoginModal'


const TestPage = () => {
  return (
    <>
    <LoginModal />
    </>
  )
}

export default TestPage;