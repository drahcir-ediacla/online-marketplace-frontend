import './style.scss'
import Header from '../../layouts/Header'
import CustomSelect from '../../components/FormField/CustomSelect'

const ContactUs = () => {
    return (
        <>
            <Header />
            <div className='how-can-we-help-container'>
                <h1>How can we help?</h1>
                <h6>For existing customers who need a hand, or other inquiries, contact us and we’ll get back to you within an hour.</h6>
            </div>
            <form>
                <div className='contact-us-form-row1'>
                    Fields marked <span className='asterisk'>*</span> are required.
                </div>
                <div className='contact-us-form-row2'>
                    <b>What do you need help with? <span className='asterisk'>*</span></b>
                    This helps make sure you get the right answer fast.
                    {/* <CustomSelect /> */}
                </div>
            </form>
        </>
    )
}

export default ContactUs