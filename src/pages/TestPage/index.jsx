// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const InfiniteScroll = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);  // Track current page
//   const [hasMore, setHasMore] = useState(true); // To check if there's more data

//   const observer = useRef();

//   useEffect(() => {
//     const fetchData = async () => {
//         if (loading || !hasMore) return; // Don't fetch if already loading or no more data

//         setLoading(true);

//         try {
//             const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=1`);
//             const newData = response.data;

//             // Check if new data already exists in the data array
//             setData((prevData) => {
//                 const uniqueData = newData.filter(
//                     (item) => !prevData.some((existingItem) => existingItem.id === item.id)
//                 );
//                 return [...prevData, ...uniqueData];
//             });

//             // Set `hasMore` to false if no more data is returned
//             setHasMore(newData.length > 0);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchData();
// }, [page]);

//   // Intersection Observer callback
//   const lastElementRef = (node) => {
//     if (loading) return; // Don't observe if loading

//     if (observer.current) observer.current.disconnect(); // Disconnect previous observer

//     observer.current = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         setPage((prevPage) => prevPage + 1); // Load next page
//       }
//     });

//     if (node) observer.current.observe(node); // Observe the last element
//   };

//   return (
//     <div>
//       <h1>Infinite Scroll Example</h1>
//       <ul>
//         {data.map((item) => (
//           <li key={item.id}>
//             {item.title}
//             {/* You can add more details from `item` like item.body */}
//           </li>
//         ))}
//       </ul>

//       {/* Loading Indicator */}
//       {loading && <p>Loading...</p>}

//       {/* Trigger for the next page */}
//       {hasMore && !loading && (
//         <div ref={lastElementRef} style={{ height: '20px', backgroundColor: 'transparent' }}></div>
//       )}

//       {/* Message when there's no more data */}
//       {!hasMore && <p>No more data to load</p>}
//     </div>
//   );
// };

// export default InfiniteScroll;

// ----------------------------------------- ForumCategories Dispatch ------------------------------------ //

// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getForumCategories } from '../../redux/actions/forumCategoriesActions';

// const ForumCategories = () => {

//   const dispatch = useDispatch();
//   const forumCategories = useSelector((state) => state.forumcategories.data);

//   useEffect(() => {
//     if (!forumCategories) {
//       dispatch(getForumCategories());
//     }
//   }, [dispatch, forumCategories]);

//   return (
//     <div>
//       {forumCategories?.categories?.map((category) => (
//         <div key={category.id}>
//           <h2>{category.name}</h2>
//           <p>{category.description}</p>
//           {category.subcategories.map((sub) => (
//             <div key={sub.id}>
//               <h3>{sub.name}</h3>
//               <p>{sub.description}</p>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ForumCategories;


// ----------------------------------------- Product Categories Dispatch ------------------------------------ //


// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getProductCategories } from '../../redux/actions/productCategoriesActions';

// const ProductCategories = () => {
//   const dispatch = useDispatch();
//   const productCategories = useSelector((state) => state.productcategories.data);
//   const error = useSelector((state) => state.productcategories.error);

//   useEffect(() => {
//     if (productCategories.length === 0) {
//       dispatch(getProductCategories());
//     }
//   }, [dispatch, productCategories]);

//   return (
//     <div>
//       {error ? (
//         <p>Error: {error}</p>
//       ) : productCategories && productCategories.length > 0 ? (
//         productCategories.map((category) => (
//           <div key={category.id}>
//             <h2>{category.label}</h2>
//             {category.subcategories.map((sub) => (
//               <div key={sub.id}>
//                 <h3>{sub.label}</h3>
//               </div>
//             ))}
//           </div>
//         ))
//       ) : (
//         <p>Loading categories...</p>
//       )}
//     </div>
//   );
// };

// export default ProductCategories;


// ----------------------------------------- Forum Tags Dispatch ------------------------------------ //

// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getAllForumTags } from '../../redux/actions/forumTagsActions';
// import useRefreshToken from '../../hooks/refreshTokenHook';

// const ForumTags = () => {
//   const dispatch = useDispatch();
//   const refresh = useRefreshToken()
//   const allForumTags = useSelector((state) => state.forumtags.data);
//   const error = useSelector((state) => state.forumtags.error);

//   useEffect(() => {
//     if (allForumTags.length === 0) {
//       dispatch(getAllForumTags());
//     }
//   }, [dispatch, allForumTags]);

  

//   return (
//     <div>
//       {error ? (
//         <p>Error: {error}</p>
//       ) : allForumTags && allForumTags.length > 0 ? (
//         allForumTags.map((tag) => (
//           <div key={tag.id}>
//             <h2>{tag.name}</h2>
//           </div>
//         ))
//       ) : (
//         <p>Loading categories...</p>
//       )}
//       <button onClick={() => refresh()}>Refresh</button>
//     </div>
//   );
// };

// export default ForumTags;