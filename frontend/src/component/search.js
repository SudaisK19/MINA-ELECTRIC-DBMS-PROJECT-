import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm) {
        navigate('/search?s=' + searchTerm);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm, navigate]);

  const handleChange = (ev) => {
    setSearchTerm(ev.target.value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        name="search"
        placeholder="Search..."
        onChange={handleChange}
      />
      <SearchIcon>
        <FaSearch />
      </SearchIcon>
    </SearchContainer>
  );
};

export default Search;

// Styled Components
const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 200px; /* Shorter width for the search bar */
  margin-left: 20px; /* Adjust spacing from the edge */
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 30px 8px 10px; /* Padding adjusted for smaller size */
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 10px;
  font-size: 1rem;
  color: #999;
  pointer-events: none;
`;
