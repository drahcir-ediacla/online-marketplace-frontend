import './style.scss'
import {ReactComponent as MagnifyingGlass} from '../../assets/images/magnifying-glass.svg'

const SearchDiscussionBox = () => {
    return (
        <>
            <div className="search-box-container">
                <div className='forum-search-box'>
                    <input
                        type="text"
                        placeholder='Search discussions...'
                    />
                    <button>
                        <div className='magnifying-glass'><MagnifyingGlass /></div>
                    </button>
                </div>
            </div>
        </>
    )
}


export default SearchDiscussionBox