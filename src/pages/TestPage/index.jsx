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


import React, { useState } from 'react';
import data from '../../data/productCategoryData.json'



function CategorySelector() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [breadcrumbPath, setBreadcrumbPath] = useState('');

  const updateBreadcrumb = (categoryValue) => {
    const selectedCategoryData = getCategoryData(categoryValue);
    if (selectedCategoryData) {
      const path = buildBreadcrumbPath(selectedCategoryData);
      setBreadcrumbPath(path);
    } else {
      setBreadcrumbPath('');
    }
  };

  const getCategoryData = (categoryValue) => {
    return data.find((category) => category.value === categoryValue);
  };

  const buildBreadcrumbPath = (categoryData) => {
    const path = [categoryData.label];
    let parentCategory = getCategoryData(categoryData.value);
    while (parentCategory) {
      path.unshift(parentCategory.label);
      parentCategory = getCategoryData(parentCategory.value);
    }
    return path.join(' > ');
  };

  const handleCategoryChange = (e) => {
    const categoryValue = e.target.value;
    setSelectedCategory(categoryValue);
    updateBreadcrumb(categoryValue);
  };

  return (
    <div>
      <div id="breadcrumb">{breadcrumbPath}</div>
      <select
        id="categorySelector"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">Select a Category</option>
        {data.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelector;