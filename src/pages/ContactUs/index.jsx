import { useEffect, useState, useRef } from 'react'
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import TextArea from '../../components/FormField/TextArea'
import BtnClear from '../../components/Button/BtnClear'
import BtnGreen from '../../components/Button/BtnGreen'
import Input from '../../components/FormField/Input'


const ContactUs = () => {

    const dropDownCategory = useRef(null);
    const [helpWithSelectorOpen, setHelpWithSelectorOpen] = useState(false)
    const [selectedHelpWith, setSelectedHelpWith] = useState(null)
    const [email, setEmail] = useState(null)
    const helpWithOptions = [
        'My account',
        'My listings',
        'Report a user or listing',
        'Other issues'
    ].map(option => ({
        label: option
    }));

    const [supportRequestInfo, setSupportRequestInfo] = useState({
        help_with: '',
        message: '',
        customer_email: '',
        // attachments: fileUrls
    })

    useEffect(() => {
        const handleGlobalClick = (e) => {
            if (dropDownCategory.current && !dropDownCategory.current.contains(e.target)) {
                setHelpWithSelectorOpen(false)
            }
        }
        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [])

    const toggleHelpWithSelector = () => {
        setHelpWithSelectorOpen(!helpWithSelectorOpen)
    }

    const handleHelpWithSelect = (label) => {
        setSupportRequestInfo({...supportRequestInfo, help_with: label})
        setSelectedHelpWith(label)
        setHelpWithSelectorOpen(false)
    }


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
                    <div className='select-help-with' ref={dropDownCategory}>
                        <div className={`drop-down-arrow ${helpWithSelectorOpen ? 'active' : ''}`} onClick={toggleHelpWithSelector}></div>
                        <div className="selected-option">
                            <input type="text" id='selectHelp' placeholder='Please select one...' value={selectedHelpWith} readOnly />
                        </div>
                        {helpWithSelectorOpen &&
                            <div className="options">
                                {helpWithOptions.map((option) => (
                                    <div
                                        key={option.label}
                                        className={`option`}
                                        onClick={() => handleHelpWithSelect(option.label)}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className='contact-us-form-row3'>
                    <b>What’s your question, comment, or issue? <span className='asterisk'>*</span></b>
                    Share all the details. The more we know, the better we can help you.
                    <TextArea
                        rows='10'
                    />
                    <small>0/255</small>
                </div>
                <div className='contact-us-form-row4'>
                    <div><b>Send us a file, screenshot, or document</b> <span>(optional)</span></div>
                    Hold the shift key to select multiple files.
                    <BtnClear type="button" label="Add Files" className='contact-us-add-file' />
                </div>
                <div className='contact-us-form-row5'>
                    <b>What’s your email address? <span className='asterisk'>*</span></b>
                    This is where we’ll get back to you. Double check that it’s right.
                    <Input
                        type='email'
                        className='contact-us-input-email'
                        placeholder='Enter your email address'
                        value={setSupportRequestInfo.customer_email}
                        onChange={(e) => setSupportRequestInfo({ ...supportRequestInfo, customer_email: e.target.value })}
                    />
                </div>
                <BtnGreen label='Send Support Request' />
            </form>
            <Footer />
        </>
    )
}

export default ContactUs