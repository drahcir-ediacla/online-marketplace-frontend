import { ReactComponent as FilterIcon } from '../../assets/images/filter-icon.svg'

export const SmallScreenProductFilter = () => {
    return (
        <>
            <div className='small-screen-prod-filter-container'>
                <button className='custom-filter-button'>
                    <span>Filters</span><div className="filter-icon"><FilterIcon /></div>
                </button>
            </div>
        </>
    )
}