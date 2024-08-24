import React, { useEffect, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from './redux/actions/userActions';
import '../src/assets/styles/global.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoutes from './components/PrivateRoutes';
import ScrollToTop from './utils/ScrollToTop'
import LoadingSpinner from './components/LoadingSpinner'


// Lazy-loaded components
const Home = lazy(() => import('./pages/Home/Home'));
const LoginEmail = lazy(() => import('./pages/Auth/Login/LoginEmail'));
const LoginPhone = lazy(() => import('./pages/Auth/Login/LoginPhone'));
const LoginSMS = lazy(() => import('./pages/Auth/Login/LoginSMS'));
const ResetByEmail = lazy(() => import('./pages/Auth/ResetPassword/ResetByEmail'));
const ResetByPhone = lazy(() => import('./pages/Auth/ResetPassword/ResetByPhone'));
const RegisterByEmail = lazy(() => import('./pages/Auth/RegisterAccount/RegisterByEmail'));
const RegisterByPhone = lazy(() => import('./pages/Auth/RegisterAccount/RegisterByPhone'));
const EditProfile = lazy(() => import('./pages/Profile/EditProfile'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const ProductDetails = lazy(() => import('./pages/ProducDetails/ProductDetails'));
const MainCategory = lazy(() => import('./pages/Categories/MainCategory'));
const SubCategory = lazy(() => import('./pages/Categories/SubCategory'));
const SubSubCategory = lazy(() => import('./pages/Categories/SubSubCategory'));
const NotificationList = lazy(() => import('./pages/NotificationList'))
const ResponsiveManageAccountNav = lazy(() => import('./components/ResponsiveManageAccountNav'));
const DeactivateAccount = lazy(() => import('./pages/Settings/DeactivateAccount'));
const SetPassword = lazy(() => import('./pages/Settings/SetPassword'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AddListing = lazy(() => import('./pages/Listing/AddListing'));
const AddListingSuccess = lazy(() => import('./pages/Listing/AddListingSuccess'));
const UpdateListing = lazy(() => import('./pages/Listing/UpdateListing'));
const ChatMessages = lazy(() => import('./pages/ChatMessages'));
const ForumHomePage = lazy(() => import('./pages/Forum/ForumHomePage'));
const ForumMainCategoryPage = lazy(() => import('./pages/Forum/ForumCategoryPage/MainCategoryPage'));
const ForumSubCategoryPage = lazy(() => import('./pages/Forum/ForumCategoryPage/SubCategoryPage'));
const AddDiscussion = lazy(() => import('./pages/Forum/AddDiscussion'));
const ForumProfile = lazy(() => import('./pages/Forum/ForumProfile'))
const Dashboard = lazy(() => import('./pages/AdminPanel/Dashboard'));
const PageNotFound = lazy(() => import('./pages/404/PageNotFound'));
const NewItems = lazy(() => import('./components/NewItems'));
const SearchResult = lazy(() => import('./pages/SearchResult'));
const TestPage = lazy(() => import('./pages/TestPage'));





function App() {

  const user = useSelector((state) => state.user.data);
  const { loading } = useSelector(state => state.loaders);
  const dispatch = useDispatch();

  useEffect(() => {
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
            <Route path='/profile/:id' element={<ProfilePage />} />
            <Route path='/productdetails/:id/:product_name' element={<ProductDetails />} />
            <Route path='/category/:id/:value' element={<MainCategory />} />
            <Route path='/subcategory/:id/:label' element={<SubCategory />} />
            <Route path='/subsubcategory/:id/:label' element={<SubSubCategory />} />
            <Route path='/search-results' element={<SearchResult />} />
            <Route path='/forum' element={<ForumHomePage />} />
            <Route path='/forum/category' element={<ForumMainCategoryPage />} />
            <Route path='/forum/category/:userId' element={<ForumMainCategoryPage />} />
            <Route path='/forum/subcategory' element={<ForumSubCategoryPage />} />
            <Route path='/forum/profile/:userId/:tab' element={<ForumProfile />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/test' element={<TestPage />} />
            <Route element={<PrivateRoutes />}>
              <Route path='/editprofile' element={<EditProfile />} />
              <Route path='/wishlist' element={<Wishlist />} />
              <Route path='/notificationlist' element={<NotificationList />} />
              <Route path='/manage-account' element={<ResponsiveManageAccountNav />} />
              <Route path='/deactivateaccount' element={<DeactivateAccount />} />
              <Route path='/setpassword' element={<SetPassword />} />
              <Route path='/addlisting' element={<AddListing />} />
              <Route path='/addlistingsuccess/:id/:product_name' element={<AddListingSuccess />} />
              <Route path='/updatelisting/:id/:product_name' element={<UpdateListing />} />
              <Route path='/messages/:chat_id' element={<ChatMessages />} />
              <Route path='/messages' element={<ChatMessages />} />
              <Route path='/forum/add-discussion' element={<AddDiscussion />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;