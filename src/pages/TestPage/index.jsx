import React, { useEffect, useRef, useState } from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import MeetUpSelector from '../../components/MeetUpSelector';
import SuccessResetPassword from '../../components/Modal/SuccessResetPassword';
import SuccessEmailUpdated from '../../components/Modal/SuccessEmailUpdated'
import './style.scss';

const libraries = ['places'];

const TestPage = () => {
 

  return (
    <>
      <SuccessEmailUpdated />
    </>
  );
}

export default TestPage;
