
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './style.scss'
import {ReactComponent as MagnifyingGlass} from '../../assets/images/magnifying-glass.svg'


const SearchDiscussionBox = () => {
const location = useLocation();
const navigate = useNavigate();
const queryParams = new URLSearchParams(location.search);
const [searchTerm, setSearchTerm] = useState(queryParams.get('keyword') || '');

const handleSearch = () => {
      navigate(`/forum-search-results?keyword=${searchTerm}`);
  };

  const handleKeyPress = (e) => {
    // Check if the pressed key is Enter
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

    return (
        <>
            <div className="search-box-container">
                <div className='forum-search-box'>
                    <input
                        type="text"
                        placeholder='Search discussions...'
                        value={searchTerm}
                        onKeyDown={handleKeyPress}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <div className='magnifying-glass' onClick={handleSearch}><MagnifyingGlass /></div>
                    </button>
                </div>
            </div>
        </>
    )
}


export default SearchDiscussionBox