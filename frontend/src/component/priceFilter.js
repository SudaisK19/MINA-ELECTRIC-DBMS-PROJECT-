import React, { useState } from 'react';
import styled from 'styled-components';

// Filter Component to filter by price range and sorting order
const PriceFilter = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('lowToHigh'); // Default sorting order (Low to High)

  // Handle when the filter button is clicked
  const handleFilterChange = async () => {
    const min = minPrice ? Number(minPrice) : '';
    const max = maxPrice ? Number(maxPrice) : '';

    try {
      const response = await fetch(
        `http://localhost:3001/api/filter/products?minPrice=${min}&maxPrice=${max}&sortOrder=${sortOrder}`
      );
      if (response.ok) {
        const data = await response.json();
        onFilterChange(data); // Pass the filtered data back to the parent (Category.js)
      } else {
        console.error('No products found or API error');
        onFilterChange([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      onFilterChange([]); // Pass an empty array if the API call fails
    }
  };

  return (
    <FilterContainer>
      <InputGroup>
        <Label>Min Price:</Label>
        <Input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
        />
      </InputGroup>

      <InputGroup>
        <Label>Max Price:</Label>
        <Input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
        />
      </InputGroup>

      <InputGroup>
        <Label>Sort By:</Label>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </Select>
      </InputGroup>

      <ApplyButton onClick={handleFilterChange}>Apply Filter</ApplyButton>
    </FilterContainer>
  );
};

export default PriceFilter;

// Styled Components

// Styled Components
const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Space between inputs */
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 20px; /* Reduced padding from top and bottom, but kept more on the sides */
  width: 85%; /* Set a fixed width for the filter container */
  margin: 0 auto; /* This will center it horizontally */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 20%; /* Adjust width of each input field container */
`;

const Label = styled.label`
  font-size: 12px;
  color: #555;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 5px;
  font-size: 13px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 5px;
  font-size: 13px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ApplyButton = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  background: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #0056b3;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: #004494;
  }
`;
