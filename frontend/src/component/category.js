import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CategoryProduct from "./categoryProduct";
import PriceFilter from "./priceFilter";  // Import the PriceFilter component

const Category = () => {
  const [products, setProducts] = useState({ errorMessage: "", data: [] });
  const [filteredProducts, setFilteredProducts] = useState([]);  // State for filtered products
  const { catId } = useParams();

  // Fetch products based on category ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the products directly based on category ID
        const response = await fetch(`http://localhost:3001/api/products/category/${catId}`);
        const result = await response.json();

        if (response.ok) {
          setProducts({ errorMessage: "", data: result });
          setFilteredProducts(result);  // Initially, show all products
        } else {
          setProducts({ errorMessage: result.error || "Failed to fetch products", data: [] });
        }
      } catch (error) {
        setProducts({ errorMessage: error.message, data: [] });
      }
    };

    fetchData();
  }, [catId]);

  // Handle the price filter changes and update the displayed products
  const handleFilterChange = (filteredData) => {
    setFilteredProducts(filteredData); // Update the filtered products in the state
  };

  return (
    <div>
      <h1>Products</h1>

      {/* Price filter component */}
      <PriceFilter onFilterChange={handleFilterChange} />

      {/* Error handling */}
      {products.errorMessage && <div>Error: {products.errorMessage}</div>}

      {/* Display filtered products */}
      <ProductGrid>
        {filteredProducts.map((product) => (
          <CategoryProduct
            key={product.ProductID}
            ProductID={product.ProductID}
            Title={product.Title}
            Price={product.Price}
            Rating={product.Rating}
            ImageURL={product.ImageURL}
            StockStatus={product.StockStatus}
          />
        ))}
      </ProductGrid>
    </div>
  );
};

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Exactly 3 products per row */
  gap: 20px;
  padding: 20px;
  width: 95vw;
  justify-items: center;
`;

export default Category;
