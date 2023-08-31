import React from 'react';
import './style.scss';

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
      <li className='page-item'>
          <button
            onClick={() => paginate(currentPage - 1)} // Previous page
            disabled={currentPage === 1} // Disable if on the first page
            className='page-link'
          >
            Previous
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <button
              onClick={() => paginate(number)}
              className={number === currentPage ? 'active page-link' : 'page-link'}
            >
              {number}
            </button>
          </li>
        ))}
        <li className='page-item'>
          <button
            onClick={() => paginate(currentPage + 1)} // Next page
            disabled={currentPage === Math.ceil(totalPosts / postsPerPage)} // Disable if on the last page
            className='page-link'
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
