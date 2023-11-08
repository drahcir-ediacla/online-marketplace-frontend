// import React, { useState } from 'react';
// import testData from '../../data/testData.json'

// function FormDropdown() {
//   const [selectedOption, setSelectedOption] = useState(''); // State to track the selected option
//   const [isDropdownOpen, setDropdownOpen] = useState(false); // State to track if the dropdown is open

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//     setDropdownOpen(false);
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <div>
//       <h2>Select a Form:</h2>
//       <div className="custom-dropdown" onClick={toggleDropdown}>
//         <div className="selected-option">
//           {selectedOption ? selectedOption : 'Select an option'}
//         </div>
//         <ul className={`options ${isDropdownOpen ? 'open' : ''}`}>
//           {testData.map((option) => (
//             <li key={option.value} onClick={() => handleOptionClick(option.value)}>
//               {option.label}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {selectedOption === 'form1' && (
//         <div>
//           <h3>Form 1</h3>
//           {/* Render your Form 1 component here */}
//         </div>
//       )}

//       {selectedOption === 'form2' && (
//         <div>
//           <h3>Form 2</h3>
//           {/* Render your Form 2 component here */}
//         </div>
//       )}

//       {selectedOption === 'form3' && (
//         <div>
//           <h3>Form 3</h3>
//           {/* Render your Form 3 component here */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default FormDropdown;



// import React, { useState } from 'react';

// const options = [
//   { value: 'option1', label: 'Option 1', fields: ['field1', 'field2'] },
//   { value: 'option2', label: 'Option 2', fields: ['field3'] },
//   { value: 'option3', label: 'Option 3', fields: ['field4', 'field5'] },
//   { value: 'option4', label: 'Option 4', children: [
//     { value: 'suboption1', label: 'Suboption 1', fields: ['field6', 'field7'] },
//     { value: 'suboption2', label: 'Suboption 2', fields: ['field8'] },
//   ]}
// ];

// function CustomSelect() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const filteredOptions = options.filter(option =>
//     option.label.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   }

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//     setIsOpen(false);
//   }

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   }

//   return (
//     <div className="custom-select">
//       <div className={`select-container ${isOpen ? 'open' : ''}`}>
//         <div className="selected-option" onClick={toggleDropdown}>
//           <input placeholder={selectedOption.label || 'Select an option'} readOnly/>
//         </div>
//         {isOpen && (
//           <div className="options">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//             <ul>
//               {filteredOptions.map((option) => (
//                 <li
//                   key={option.value}
//                   onClick={() => handleOptionClick(option)}
//                   className={option.value === selectedOption.value ? 'selected' : ''}
//                 >
//                   {option.label}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {selectedOption.fields && (
//         <div className="form-fields">
//           {selectedOption.fields.map((fieldName) => (
//             <div key={fieldName}>
//               <label>{fieldName}:</label>
//               <input type="text" name={fieldName} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default CustomSelect;


// import React, { useState } from 'react';

// function CheckboxWithTextarea({ label }) {
//   const [isChecked, setIsChecked] = useState(false);
//   const [textValue, setTextValue] = useState('');

//   const handleCheckboxChange = () => {
//     setIsChecked(!isChecked);
//     if (!isChecked) {
//       // Clear the textarea when the checkbox is unchecked
//       setTextValue('');
//     }
//   };

//   const handleTextareaChange = (event) => {
//     setTextValue(event.target.value);
//   };

//   return (
//     <div>
//       <label>
//         <input
//           type="checkbox"
//           checked={isChecked}
//           onChange={handleCheckboxChange}
//         />
//         {label}
//       </label>
//       {isChecked && (
//         <textarea
//           value={textValue}
//           onChange={handleTextareaChange}
//           placeholder="Enter your text here..."
//         />
//       )}
//     </div>
//   );
// }

// export default CheckboxWithTextarea;


// import React, { useState } from 'react';
// import './style.scss'

// const ImageUpload = () => {
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const maxImages = 10; // Define the maximum number of images allowed

//   const handleImageChange = (e) => {
//     const files = e.target.files;
//     const selectedImagesArray = Array.from(files);

//     // Check if the total selected images don't exceed the maximum allowed
//     if (selectedImagesArray.length + selectedImages.length > maxImages) {
//       alert(`You can select up to ${maxImages} images.`);
//       return;
//     }

//     const imagePreviewsArray = [];

//     selectedImagesArray.forEach((image) => {
//       if (!image.type.startsWith('image/')) {
//         alert('Only image files are allowed.');
//         return;
//       }

//       const reader = new FileReader();

//       reader.onload = (e) => {
//         imagePreviewsArray.push(e.target.result);
//         if (imagePreviewsArray.length === selectedImagesArray.length) {
//           setImagePreviews((prevPreviews) => [...prevPreviews, ...imagePreviewsArray]);
//           setSelectedImages((prevImages) => [...prevImages, ...selectedImagesArray]);
//         }
//       };

//       reader.readAsDataURL(image);
//     });
//   };

//   const removeImage = (file) => {
//     const updatedPreviews = imagePreviews.filter((preview) => preview !== file.preview);
//     const updatedImages = selectedImages.filter((image) => image !== file.image);
//     setImagePreviews(updatedPreviews);
//     setSelectedImages(updatedImages);
//   };

//   return (
//     <div className="upload__box">
//       <div className="upload__btn-box">
//         <label className="upload__btn">
//           <p>Upload images</p>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             className="upload__inputfile"
//             onChange={handleImageChange}
//           />
//         </label>
//       </div>
//       <div className="upload__img-wrap">
//         {imagePreviews.map((preview, index) => (
//           <div className="upload__img-box" key={index}>
//             <div
//               className="img-bg"
//               style={{ backgroundImage: `url(${preview})` }}
//               data-number={index}
//             >
//               <div className="upload__img-close" onClick={() => removeImage({ preview, image: selectedImages[index] })}>
                
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageUpload;


import React, { useState } from 'react';

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const maxImages = 10; // Define the maximum number of images allowed

  const handleImageChange = (e) => {
    const files = e.target.files;
    const selectedImagesArray = Array.from(files);

    if (selectedImagesArray.length + selectedImages.length > maxImages) {
      alert(`You can select up to ${maxImages} images.`);
      return;
    }

    const imagePreviewsArray = [];

    selectedImagesArray.forEach((image) => {
      if (!image.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        imagePreviewsArray.push(e.target.result);
        if (imagePreviewsArray.length === selectedImagesArray.length) {
          setImagePreviews((prevPreviews) => [...prevPreviews, ...imagePreviewsArray]);
          setSelectedImages((prevImages) => [...prevImages, ...selectedImagesArray]);
        }
      };

      reader.readAsDataURL(image);
    });
  };

  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setSelectedImages(updatedImages);
  };

  const handleSubmit = () => {
    // You can send the selected images to your server here using an API request
    const formData = new FormData();

    selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    // Use fetch or an HTTP library like axios to send the images to your API
    fetch('/api/upload-images', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server, which should include product information and image URLs
        console.log(data);
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
      });
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      <div>
        {imagePreviews.map((preview, index) => (
          <div key={index}>
            <img src={preview} alt={`Img ${index}`} width="100" />
            <button onClick={() => removeImage(index)}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ImageUpload;
