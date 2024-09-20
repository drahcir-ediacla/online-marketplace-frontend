import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './style.scss'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg'
import BtnGreen from '../Button/BtnGreen'
import BtnClear from '../Button/BtnClear'


const FilterTagModal = ({ onClick, tagsData }) => {

    const location = useLocation()
    const navigate = useNavigate()
    const [isModalOpen] = useState(true);
    const [showDropdownTags, setShowDropdownTags] = useState(false);
    const [tags, setTags] = useState([]);
    const [inputTags, setInputTags] = useState('');
    const [filteredTags, setFilteredTags] = useState([tagsData]);
    const dropDownTags = useRef();


    


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';

        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    const handleTagInputChange = (e) => {
        const inputValue = e.target.value;
        setInputTags(inputValue);

        if (inputValue.trim() !== '') {
            // Create a set of tag IDs that are already selected
            const selectedTagIds = new Set(tags.map(tag => tag.tag_id));

            // Filter available tags based on the input and exclude already selected tags
            setFilteredTags(
                tagsData
                    .filter(tag =>
                        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                        !selectedTagIds.has(tag.id)
                    )
            );
            setShowDropdownTags(true);
        } else {
            setFilteredTags([]);
            setShowDropdownTags(false);
        }
    };

    

    const handleTagClick = (id, name) => {
        if (!tags.some(t => t.tag_id === id)) {
            setTags([...tags, { tag_id: id, tag_name: name }]);
            // setInputTags(''); // Clear input after tag selection
            // setShowDropdownTags(false);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag.tag_id !== tagToRemove.tag_id));
    };

    const clearSelectedTags = () => {
        setTags([])
    }


    return (
        <>
            <div className="filter-tag-modal-container">
                <div className="modal-box">
                    <div className="filter-tag-modal-row1">
                        <button className='closebtn' onClick={onClick}>
                            <i class='fa fa-times'></i>
                        </button>
                    </div>
                    <div className='filter-tag-modal-row2'>
                        <h5>Filter discussions by tags</h5>
                        {tags.length > 0 ? (<span>Selected Tags:</span>) : ("")}
                        <ul className='selected-tag-list'>
                            {tags.map((tag, index) => (
                                <li key={index} className='tag' ref={dropDownTags}>
                                    {tag.tag_name}
                                    <button
                                        type="button"
                                        className="remove-tag-button"
                                        onClick={() => handleRemoveTag(tag)}
                                    >
                                        &times;
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='filter-tag-modal-row3'>
                        <div className="tags-search-box">
                            <input
                                type="text"
                                placeholder='Search tags...'
                                value={inputTags}
                                onChange={handleTagInputChange}
                            />
                            <button>
                                <div className="magnifying-glass"><MagnifyingGlass /></div>
                            </button>
                        </div>
                        {showDropdownTags && filteredTags.length > 0 && (
                            <ul className='dropdown-list'>
                                {filteredTags.map((tag) => (
                                    <li key={tag.id} onClick={() => handleTagClick(tag.id, tag.name)}>
                                        {tag.name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {showDropdownTags && filteredTags.length === 0 && (
                            <ul className='dropdown-list'>
                                <li className='no-tag-found'>No tag found!</li>
                            </ul>
                        )}

                    </div>
                    <div className='filter-tag-modal-row4'>
                        <BtnGreen label='Apply Filter' />
                        <BtnClear label='Clear' onClick={clearSelectedTags} />
                        <BtnClear label='Cancel' onClick={onClick} />
                    </div>
                </div>
            </div>
        </>
    )
}


export default FilterTagModal