import React, { useEffect, useRef, useState } from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import MeetUpSelector from '../../components/MeetUpSelector';
import UpdateEmailModal from '../../components/Modal/UpdateEmailModal';
import './style.scss';

const libraries = ['places'];

const TestPage = () => {
 

  return (
    <>
    <UpdateEmailModal />
      <MeetUpSelector />
    </>
  );
}

export default TestPage;
