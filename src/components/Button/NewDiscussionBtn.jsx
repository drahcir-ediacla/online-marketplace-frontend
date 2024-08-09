import './Button.css'
import {ReactComponent as PencilIcon} from '../../assets/images/pencil-icon.svg'


const NewDiscussionBtn = ({className, onClick}) => {
    return (
        <>
            <button type='button' onClick={onClick} className={`discussion-btn ${className}`}><PencilIcon /> Start a discussion</button>
        </>
    )
}


export default NewDiscussionBtn;