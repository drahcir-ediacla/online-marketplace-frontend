import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import HeroBanner1 from '../../assets/images/hero-banner1.webp';
import HeroBanner2 from '../../assets/images/hero-banner2.webp';
import MeetUpSelector from '../../components/MeetUpSelector';
import './style.scss';

const libraries = ['places'];

const TestPage = () => {
 

  return (
    <>
      <MeetUpSelector />
    </>
  );
}

export default TestPage;
