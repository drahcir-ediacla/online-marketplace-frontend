import { useEffect, useState } from "react";
import axios from "../../../apicalls/axios";
import "./style.scss"
import { ReactComponent as TagsIcon } from '../../../assets/images/tags-icon.svg'
import FilterTagModal from "../../Modal/FilterTagModal";

const FilterTagButton = ({ label }) => {
    const [filterTagModalOpen, setFilterTagModalOpen] = useState(false);
    const [tags, setTags] = useState([])

    useEffect(() => {
        const fetchForumTags = async () => {
            try {
                const response = await axios.get('/api/fetchforumtags')
                setTags(response.data)
            } catch (err) {
                console.log('Error fetching forum tags', err)
            }
        }
        fetchForumTags()
    }, [])

    const toggleTagModal = () => {
        setFilterTagModalOpen((prev) => !prev)
    }


    return (
        <>
            {filterTagModalOpen && <FilterTagModal onClick={toggleTagModal} tagsData={tags} />}
            <button className='popular-tags-btn-label' onClick={toggleTagModal}><TagsIcon />{label}</button>
            <button className='popular-tags-btn' onClick={toggleTagModal}><TagsIcon /></button>
        </>
    )
}

export default FilterTagButton;