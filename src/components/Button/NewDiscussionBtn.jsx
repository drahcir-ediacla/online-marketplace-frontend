import './Button.css'
import {ReactComponent as PencilIcon} from '../../assets/images/pencil-icon.svg'


const NewDiscussionBtn = ({className, onClick, label}) => {
    return (
        <>
            <button type='button' onClick={onClick} className={`discussion-btn ${className}`}><PencilIcon /> {label}</button>
        </>
    )
}


export default NewDiscussionBtn;