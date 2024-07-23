import React, { useEffect, useRef, useState } from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import MeetUpSelector from '../../components/MeetUpSelector';
import UpdateEmailModal from '../../components/Modal/UpdateEmailModal';
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
