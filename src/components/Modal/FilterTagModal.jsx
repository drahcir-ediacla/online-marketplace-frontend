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
    console.log('tags:', tags)
    const [selectedTags, setSelectedTags] = useState([]);
    console.log('FilterTagModal selectedTags:', selectedTags)
    const [inputTags, setInputTags] = useState('');
    const [filteredTags, setFilteredTags] = useState(tagsData);
    console.log('FilterTagModal filteredTags:', filteredTags)
    const dropDownTags = useRef();


    useEffect(() => {
        // If location.state is not null or undefined, update state
        if (location.state && location.state.selectedTags) {
            setSelectedTags(location.state.selectedTags);
        }
    }, [location.state]);


    useEffect(() => {
        // Filter tags based on selectedTags
        const filtered = tagsData.filter(tag => selectedTags.includes(tag.id));
        setTags(filtered.map(tag => ({ tag_id: tag.id, tag_name: tag.name })));
    }, [selectedTags, tagsData]);


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
            setSelectedTags([...selectedTags, id])
            // setInputTags(''); // Clear input after tag selection
            // setShowDropdownTags(false);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag.tag_id !== tagToRemove.tag_id));
        setSelectedTags(selectedTags.filter(id => id !== tagToRemove.tag_id));
    };

    const clearSelectedTags = () => {
        setTags([])
        setSelectedTags([])
    }

    const applyFilterTag = () => {
        // Ensure selectedTags contains the current selected tag IDs
        const updatedSelectedTags = selectedTags; // or any updates you might have made
        navigate('/forum/filtertags', { state: { selectedTags: updatedSelectedTags } });
    };


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
                        <h5>Search discussions by tags</h5>
                        {tags.length > 0 ? (<span>Selected Tags:</span>) : ("")}
                        <ul className='selected-tag-list'>
                            {tags.map((tag) => (
                                <li key={tag.tag_id} className='tag' ref={dropDownTags}>
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
                        <BtnGreen label='Apply Filter' onClick={() => { applyFilterTag(); onClick(); }} />
                        <BtnClear label='Clear' onClick={clearSelectedTags} />
                        <BtnClear label='Cancel' onClick={onClick} />
                    </div>
                </div>
            </div>
        </>
    )
}


export default FilterTagModal