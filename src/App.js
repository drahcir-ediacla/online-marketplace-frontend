import React, { useEffect, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from './redux/actions/userActions';
import '../src/assets/styles/global.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Home from './pages/Home/Home'
// import LoginEmail from './pages/Auth/Login/LoginEmail'
// import LoginPhone from './pages/Auth/Login/LoginPhone'
// import LoginSMS from './pages/Auth/Login/LoginSMS'
// import ResetByEmail from './pages/Auth/ResetPassword/ResetByEmail'
// import ResetByPhone from './pages/Auth/ResetPassword/ResetByPhone'
// import RegisterByEmail from './pages/Auth/RegisterAccount/RegisterByEmail'
// import RegisterByPhone from './pages/Auth/RegisterAccount/RegisterByPhone'
// import EditProfile from './pages/Profile/EditProfile'
// import ProfilePage from './pages/Profile/ProfilePage'
// import BuyerProductDetails from './pages/ProducDetails/BuyerProductDetails'
// import ProductDetails from './pages/ProducDetails/ProductDetails'
// import MainCategory from './pages/Categories/MainCategory'
// import SubCategory from './pages/Categories/SubCategory'
// import DeactivateAccount from './pages/Settings/DeactivateAccount'
// import SetPassword from './pages/Settings/SetPassword'
// import Wishlist from './pages/Wishlist'
// import AddListing from './pages/AddListing/AddListing'
// import AddListingSuccess from './pages/AddListing/AddListingSuccess'
// import ChatMessages from './pages/ChatMessages'
// import Dashboard from './pages/AdminPanel/Dashboard'
// import PageNotFound from './pages/404/PageNotFound';
// import TestPage from './pages/TestPage'
import ScrollToTop from './utils/ScrollToTop'
import LoadingSpinner from './components/LoadingSpinner'
// import NewItems from './components/NewItems';
// import SearchResult from './pages/SearchResult';
// import TokenRefreshWrapper from './components/TokenRefreshWrapper';
// import ProtectedPage from './components/ProtectedPage';


// Lazy-loaded components
const Home = lazy(() => import('./pages/Home/Home'));
const LoginEmail  = lazy(() => import('./pages/Auth/Login/LoginEmail'));
const LoginPhone = lazy(() => import('./pages/Auth/Login/LoginPhone'));
const LoginSMS = lazy(() => import('./pages/Auth/Login/LoginSMS'));
const ResetByEmail = lazy(() => import('./pages/Auth/ResetPassword/ResetByEmail'));
const ResetByPhone = lazy(() => import('./pages/Auth/ResetPassword/ResetByPhone'));
const RegisterByEmail = lazy(() => import('./pages/Auth/RegisterAccount/RegisterByEmail'));
const RegisterByPhone = lazy(() => import('./pages/Auth/RegisterAccount/RegisterByPhone'));
const EditProfile = lazy(() => import('./pages/Profile/EditProfile'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const BuyerProductDetails = lazy(() => import('./pages/ProducDetails/BuyerProductDetails'));
const ProductDetails = lazy(() => import('./pages/ProducDetails/ProductDetails'));
const MainCategory = lazy(() => import('./pages/Categories/MainCategory'));
const SubCategory = lazy(() => import('./pages/Categories/SubCategory'));
const DeactivateAccount = lazy(() => import('./pages/Settings/DeactivateAccount'));
const SetPassword = lazy(() => import('./pages/Settings/SetPassword'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AddListing = lazy(() => import('./pages/AddListing/AddListing'));
const AddListingSuccess = lazy(() => import('./pages/AddListing/AddListingSuccess'));
const ChatMessages = lazy(() => import('./pages/ChatMessages'));
const Dashboard = lazy(() => import('./pages/AdminPanel/Dashboard'));
const PageNotFound = lazy(() => import('./pages/404/PageNotFound'));
const TestPage = lazy(() => import('./pages/TestPage'));
const NewItems = lazy(() => import('./components/NewItems'));
const SearchResult = lazy(() => import('./pages/SearchResult'));





function App() {

  const user = useSelector((state) => state.user.data);
  const {loading} = useSelector(state => state.loaders);
  const dispatch = useDispatch();

  useEffect (() => {
    dispatch(getUser())
  }, [dispatch]);



  return (
    <>
    
    {loading && <LoadingSpinner />}
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path='/loginemail' element={user ? <Navigate to="/" /> : <LoginEmail />} />
          <Route path='/loginphone' element={user ? <Navigate to="/" /> : <LoginPhone />} />
          <Route path='/loginsms' element={user ? <Navigate to="/" /> : <LoginSMS />} />
          <Route path='/resetbyemail' element={user ? <Navigate to="/" /> : <ResetByEmail />} />
          <Route path='/resetbyphone' element={user ? <Navigate to="/" /> : <ResetByPhone />} />
          <Route path='/registerbyemail' element={user ? <Navigate to="/" /> : <RegisterByEmail />} />
          <Route path='/registerbyphone' element={user ? <Navigate to="/" /> : <RegisterByPhone />} />
          <Route path='/editprofile' element={<EditProfile />} />
          <Route path='/myprofile' element={<ProfilePage />} />
          <Route path='/profile/:id' element={<ProfilePage />} />
          <Route path='/productdetails/:id/:product_name' element={<ProductDetails />} />
          <Route path='/buyerproductdetails' element={<BuyerProductDetails />} />
          <Route path='/category/:id/:label' element={<MainCategory />} />
          <Route path='/subcategory/:id/:label' element={<SubCategory />} />
          <Route path='/wishlist/:id' element={<Wishlist />} />
          <Route path='/deactivateaccount' element={<DeactivateAccount />} />
          <Route path='/setpassword' element={<SetPassword />} />
          <Route path='/addlisting' element={<AddListing />} />
          <Route path='/addlistingsuccess/:id/:product_name' element={<AddListingSuccess />} />
          <Route path='/search-results' element={<SearchResult />} />
          <Route path='/messages/:chat_id' element={<ChatMessages />} />
          <Route path='/messages' element={<ChatMessages />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/test/:chat_id' element={<TestPage />} />
          <Route path='/test' element={<TestPage />} />
          <Route path="/:id" component={<NewItems />} />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
