import React, { useState } from 'react';

// Sample data structure for categories and subcategories
const categoriesData = [
  {
    id: 1,
    name: 'Electronics',
    subcategories: [
      {
        label: 'Mobile Phones'
      },
      {
        label: 'Laptops'
      },
      {
        label: 'Cameras'
      }
    ]
  },
  {
    id: 2,
    name: 'Clothing',
    subcategories: [
      {
        label: 'Men'
      },
      {
        label: 'Women'
      },
      {
        label: 'Kids'
      }
    ]
  },
  {
    id: 3,
    name: 'Books',
    subcategories: [
      {
        label: 'Fiction'
      },
      {
        label: 'Non Fiction'
      },
      {
        label: 'Children'
      }
    ]
  }
];

const SearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categoriesData);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm === '') {
      setFilteredCategories(categoriesData); // Reset to all categories when searchTerm is empty
      return;
    }

    const filtered = categoriesData.filter(category => {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subcategories.some(sub => sub.label.toLowerCase().includes(searchTerm.toLowerCase()))

    });

    setFilteredCategories(filtered);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search categories and subcategories..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <ul>
        {filteredCategories.map((category) => (
          <li key={category.id}>
            <strong>{category.name}</strong>
            <ul>
              {category.subcategories.map((subcategory, index) => (
                subcategory.label.toLowerCase().includes(searchTerm.toLowerCase()) && (
                  <li key={index}>{subcategory.label}</li>
                )
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchFilter;
