import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';




const QuillEditor = ({ className, value, onChange, id, name }) => {

    // const [value, setValue] = useState('')
    const [isHtmlMode, setIsHtmlMode] = useState(false);

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ["link", "image", "video"],
            ['html'],
        ]
    }

    const toggleHtmlMode = () => {
        setIsHtmlMode(!isHtmlMode);
    };

    return (
        <>
            <ReactQuill
                id={id}
                name={name}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                className={className}
                placeholder="Type the details of your product here..."
            />
        </>
    )
}

export default QuillEditor