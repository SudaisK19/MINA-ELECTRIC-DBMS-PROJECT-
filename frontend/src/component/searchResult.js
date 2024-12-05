import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryProduct from './categoryProduct';
import styled from 'styled-components';

const SearchResult = () => {
  const [products, setProducts] = React.useState({ errorMessage: '', data: [] });
  const [searchParams] = useSearchParams();
  const query = searchParams.get('s');

  React.useEffect(() => {
    const fetchData = async () => {
      if (query) {
        try {
          const response = await fetch(`http://localhost:3001/api/search?query=${query}`);
          const responseData = await response.json();
          if (response.ok) {
            setProducts({ errorMessage: '', data: responseData.data });
          } else {
            setProducts({ errorMessage: responseData.message, data: [] });
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setProducts({ errorMessage: 'Failed to fetch results', data: [] });
        }
      } else {
        setProducts({ errorMessage: '', data: [] });
      }
    };

    fetchData();
  }, [query]);

  const renderProducts = () => {
    if (products.data.length > 0) {
      return products.data.map((p) => (
        <CategoryProduct key={p.id} {...p}>
          {p.ProductName} {/* Assuming 'ProductName' is the field you want to display */}
        </CategoryProduct>
      ));
    } else {
      return <div>{products.errorMessage || 'No results found'}</div>;
    }
  };

  return (
    <StyledContainer >
      <h1>Searched Results</h1>
      <ProductGrid>
        {renderProducts()}
      </ProductGrid>
    </StyledContainer >
  );
};

export default SearchResult;

const StyledContainer = styled.div`
  padding: 20px;
  text-align: left;
  background-color: transparent;
  min-height: 100vh;
  padding:20px;
  width: 95vw;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 95vw;
  margin-top: 20px;
  padding: 0 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for medium screens */
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* 1 column for small screens */
  }
`;
