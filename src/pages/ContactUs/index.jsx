import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../apicalls/axios'
import './style.scss'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import TextArea from '../../components/FormField/TextArea'
import BtnClear from '../../components/Button/BtnClear'
import BtnGreen from '../../components/Button/BtnGreen'
import Input from '../../components/FormField/Input'
import FaqIcon from '../../assets/images/faq-icon.png'
import AlertMessage from '../../components/AlertMessage'
import { ReactComponent as CommunityIcon } from '../../assets/images/community-icon-solid.svg';
import { ReactComponent as PhoneIcon } from '../../assets/images/phone-icon.svg';
import { ReactComponent as LoadingSpinner } from "../../assets/images/loading-spinner.svg";
import { ReactComponent as AttachmentIcon } from "../../assets/images/attachment-icon.svg";


const ContactUs = () => {

    const dropDownCategory = useRef(null);
    const [helpWithSelectorOpen, setHelpWithSelectorOpen] = useState(false)
    const [files, setFiles] = useState([]); // Track files locally
    const [isSending, setIsSending] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [requiredHelpWith, setRequiredHelpWith] = useState('');
    const [requiredMessage, setRequiredMessage] = useState('');
    const [requiredCustomerEmail, setRequiredCustomerEmail] = useState('');
    const [successAlert, setSucessAlert] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errMsg, setErrMsg] = useState('');
    const helpWithOptions = [
        'My account',
        'My listings',
        'Report a user or listing',
        'Chat Issue',
        'Search Issue',
        'Other issues'
    ].map(option => ({
        label: option
    }));

    const [supportRequestInfo, setSupportRequestInfo] = useState({
        help_with: '',
        message: '',
        customer_email: '',
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
        setSupportRequestInfo({ ...supportRequestInfo, help_with: label })
        setHelpWithSelectorOpen(false)
    }

    const handleMessageChange = (e) => {
        setSupportRequestInfo({ ...supportRequestInfo, message: e.target.value })
    }

    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        const validFiles = selectedFiles.filter((file) => {
            if (file.size > MAX_FILE_SIZE) {
                alert(`File ${file.name} exceeds the maximum size of 3MB and will not be uploaded.`);
                return false;
            }
            return true;
        });

        setFiles([...files, ...validFiles]); // Add only valid files
    };

    const removeFile = (fileName) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };


    const handleAddFileClick = () => {
        document.getElementById('fileUpload').click();
    };

    const uploadFilesToCloudinary = async (files) => {
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('upload_preset', 'auwcvbw0');
            formData.append('cloud_name', 'yogeek-cloudinary');
            formData.append('folder', 'support_request_files');
            formData.append('file', files[i]);

            try {
                const response = await fetch('https://api.cloudinary.com/v1_1/yogeek-cloudinary/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    uploadedUrls.push({ filename: files[i].name, path: data.secure_url });
                } else {
                    console.error(`Error uploading ${files[i].name}: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error uploading ${files[i].name}:`, error);
            }
        }

        return uploadedUrls;
    };

    const validateForm = () => {
        let hasErrors = false;

        if (!supportRequestInfo.help_with) {
            setRequiredHelpWith('This field is required.');
            hasErrors = true;
        } else {
            setRequiredHelpWith('');
        }

        if (!supportRequestInfo.message) {
            setRequiredMessage('This field is required.');
            hasErrors = true;
        } else {
            setRequiredMessage('');
        }

        if (!supportRequestInfo.customer_email) {
            setRequiredCustomerEmail('This field is required.');
            hasErrors = true;
        } else {
            setRequiredCustomerEmail('');
        }

        return !hasErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowAlert(false);

        if (!validateForm()) {
            setErrMsg('Please fill up all the required fields');
            setShowAlert(true);
            return;
        }
        setIsSending(true)
        // Upload files to Cloudinary and get URLs
        const fileUrls = await uploadFilesToCloudinary(files);

        const requestWithFiles = {
            ...supportRequestInfo,
            attachments: fileUrls, // Includes { filename, path } for each file
        };

        try {
            const response = await axios.post('/api/send-support-request', requestWithFiles);
            console.log('Request sent successfully:', response.data);
            setSuccessMsg('Support request sent successfully!');
            setSucessAlert(true);

            // Reset the form
            setSupportRequestInfo({
                help_with: '',
                message: '',
                customer_email: '',
            });
            setFiles([]);
            setIsSending(false)
        } catch (error) {
            console.error('Error sending request:', error);
            setErrMsg('Unable to send your request. Please try again.');
            setShowAlert(true);
        } finally {
            setIsSending(false)
        }
    };



    return (
        <>
            {showAlert && <AlertMessage type="error" message={errMsg} />}
            {successAlert && <AlertMessage type="success" message={successMsg} />}
            <Header />
            <div className='how-can-we-help-container'>
                <h1>How can we help?</h1>
                <h6>For existing customers who need a hand, or other inquiries, contact us and we’ll get back to you within 24 hours.</h6>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='contact-us-form-row1'>
                    Fields marked <span className='asterisk'>*</span> are required.
                </div>
                <div className='contact-us-form-row2'>
                    <b>What do you need help with? <span className='asterisk'>*</span></b>
                    This helps make sure you get the right answer fast.
                    {requiredHelpWith && <span className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {requiredHelpWith}</span>}
                    <div className='select-help-with' ref={dropDownCategory}>
                        <div
                            className={`drop-down-arrow ${helpWithSelectorOpen ? 'active' : ''}`}
                            onClick={!isSending ? toggleHelpWithSelector : undefined}
                        >
                        </div>
                        <div className="selected-option">
                            <input type="text" id='selectHelp' placeholder='Please select one...' value={supportRequestInfo.help_with} readOnly />
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
                    <b>What is your question, comment, or issue? <span className='asterisk'>*</span></b>
                    Share all the details. The more we know, the better we can help you.
                    {requiredMessage && <span className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {requiredMessage}</span>}
                    <TextArea
                        rows='10'
                        placeholder="Write more information here..."
                        value={supportRequestInfo.message}
                        onChange={handleMessageChange}
                        readOnly={isSending}
                    />
                </div>
                <div className='contact-us-form-row4'>
                    <div><b>Send us a file, screenshot, or document</b> <span>(optional)</span></div>
                    Hold the shift key to select multiple files.
                    <input
                        type="file"
                        id='fileUpload'
                        multiple
                        onChange={handleFileChange}
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                        style={{ display: 'none' }}
                    />
                    <BtnClear type="button" label="Attach Files" className='contact-us-add-file' onClick={!isSending ? handleAddFileClick : undefined} />
                    <ul className="selected-files">
                        {files.map((file) => (
                            <li key={file.name} className='selected-files-li'>
                                <div className='attachment-icon'><AttachmentIcon /></div>
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                <button type="button" onClick={!isSending ? () => removeFile(file.name) : undefined} className='remove-attachment'>
                                    <i className="fa fa-times"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='contact-us-form-row5'>
                    <b>What is your email address? <span className='asterisk'>*</span></b>
                    This is where we’ll get back to you. Double check that it’s right.
                    {requiredCustomerEmail && <span className="errmsg"><FontAwesomeIcon icon={faInfoCircle} color='red' /> {requiredCustomerEmail}</span>}
                    <Input
                        type='email'
                        className='contact-us-input-email'
                        placeholder='Enter your email address'
                        value={supportRequestInfo.customer_email}
                        onChange={(e) => setSupportRequestInfo({ ...supportRequestInfo, customer_email: e.target.value })}
                        readOnly={isSending}
                    />
                </div>
                {!isSending ? (
                    <BtnGreen label='Send Support Request' onClick={() => setShowAlert(false)} />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '80px' }}><LoadingSpinner /></div>
                        Sending request...
                    </div>
                )}
            </form>
            <div className='other-help-support-options'>
                <div className='other-help-support-options-col1'>
                    <Link to='/forum'>
                        <div className='community-icon'><CommunityIcon /></div>
                    </Link>
                    <div style={{ textAlign: 'center' }}>
                        <Link to='/forum' className='help-support-option-label'>Ask the community</Link><br />
                        Find others with your same issue
                    </div>
                </div>
                <div className='other-help-support-options-col2'>
                    <img src={FaqIcon} alt='' />
                    <div style={{ textAlign: 'center' }}>
                        <span className='help-support-option-label'>Frequently Asked Question</span><br />
                        Find answers to commonly asked question.
                    </div>
                </div>
                <div className='other-help-support-options-col3'>
                    <div className='phone-icon'><PhoneIcon /></div>
                    <div style={{ textAlign: 'center' }}>
                        <span className='help-support-option-label'>Call Us</span><br />
                        (+63) 998-9311-115<br />
                        We will answer as soon as we can
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ContactUs