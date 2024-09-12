import './Button.css'
import { ReactComponent as ReplyIcon } from '../../assets/images/reply-icon.svg'

const ReplyBtn = ({ className, label, onClick }) => {
    return (
        <>
            <button className={`default-reply-btn-style ${className}`} onClick={onClick}>
                <div className='reply-icon-style'><ReplyIcon /></div>
                <span>{label}</span>
            </button>
        </>
    )
}

export default ReplyBtn;