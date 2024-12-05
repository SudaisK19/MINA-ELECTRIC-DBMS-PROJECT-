import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CartContext } from "../contexts/cartContext";
import { WishlistContext } from "../contexts/wishlistContext";
import { FaShoppingBasket, FaEye } from 'react-icons/fa'; // FontAwesome icons


const CategoryProduct = ({
  ProductID,
  Title,
  Price,
  Rating,
  ImageURL,
  StockStatus,
}) => {
  const navigate = useNavigate();
  const { addProducts } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const handleAddToBasket = async () => {
    try {
      await addProducts({ id: ProductID, quantity: 1 });
      alert(`Product "${Title}" added to basket!`);
    } catch (error) {
      console.error("Error adding to basket:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist({
        id: ProductID, // Only send the ID as `productId` to the backend
      });
      alert(`Product "${Title}" added to wishlist!`);
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      alert("Failed to add product to wishlist. Please try again.");
    }
  };

  return (
    <ProductContainer>
      <ProductTitle>
        <Link to={`products/${ProductID}`}>{Title}</Link>
      </ProductTitle>
      <ProductImageContainer>
        <ProductImageContainerImage src={ImageURL} alt={Title} />
      </ProductImageContainer>
      <ProductInfo>
        <ProductInfoHeader>Price</ProductInfoHeader>
        <label>₨{Price}</label>
      </ProductInfo>
      <ProductInfo>
        <ProductInfoHeader>Stock Status</ProductInfoHeader>
        <label>{StockStatus ? "Available" : "Out of Stock"}</label>
      </ProductInfo>
      <ProductInfo>
        <ProductInfoHeader>Rating</ProductInfoHeader>
        <label>{Rating}</label>
      </ProductInfo>
      <ProductInfoAction>
        <ProductInfoActionButton onClick={() => navigate(`products/${ProductID}`)}>
          <FaEye /> View Product
        </ProductInfoActionButton>
        <ProductInfoActionButton onClick={handleAddToBasket}>
          <FaShoppingBasket /> Add to Basket
        </ProductInfoActionButton>
        <ProductInfoActionButtonW onClick={handleAddToWishlist}>
          <span role="img" aria-label="Heart Emoji">❤️</span> Add to Wishlist
        </ProductInfoActionButtonW>
      </ProductInfoAction>
    </ProductContainer>
  );
};

// Styled Components

const ProductContainer = styled.article`
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 280px; /* Reduced the width of the grid item */
  width: 100%; /* Ensure it adapts to the grid */
  margin: 10px; /* Space between items */
`;

const ProductTitle = styled.div`
  color: darkslateblue;
  font-weight: bold;
  font-size: 1.1em; /* Slightly smaller font size */
  padding: 5px;
  text-align: center;
  word-wrap: break-word; /* Allow text wrapping */
`;

const ProductImageContainer = styled.div`
  padding: 5px;
  display: flex;
  justify-content: center;
`;

const ProductImageContainerImage = styled.img`
  width: 80%;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  align-items: center;
`;

const ProductInfoHeader = styled.h3`
  color: darkslateblue;
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ProductInfoAction = styled.div`
  display: grid; /* Using grid to align buttons */
  grid-template-columns: repeat(2, 1fr); /* 2 buttons in the first row */
  grid-template-rows: auto; /* Auto sizing for rows */
  grid-gap: 10px; /* Gap between buttons */
  margin-top: 15px;
  width: 100%;
`;

const ProductInfoActionButton = styled.button`
  background-color: #007bff; /* Blue color */
  color: #fff;
  height: 40px;
  border-radius: 8px;
  font-weight: normal; /* Non-bold text */
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Space between icon and text */
  transition: background-color 0.3s ease;
  white-space: normal; /* Allow text wrapping inside button */
  
  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

const ProductInfoActionButtonW = styled.button`
  background-color: #d3d3d3; /* Mid grey background color */
  color: #000; /* Black text color */
  height: 40px;
  border-radius: 8px;
  font-weight: normal; /* Non-bold text */
  border: 1px solid #d3d3d3; /* Thin border with the same grey color */
  cursor: pointer;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Space between icon and text */
  transition: background-color 0.3s ease, border-color 0.3s ease; /* Smooth border color transition */
  white-space: normal; /* Allow text wrapping inside button */
  
  &:hover {
    background-color: #c0c0c0; /* Slightly darker grey when hovered */
    border-color: #c0c0c0; /* Darker grey border on hover */
  }

  &:focus {
    outline: none;
  }
  
  /* Make the button take full width when it's the last one */
  grid-column: span 2; /* Span both columns (full width) */
`;

export default CategoryProduct;
