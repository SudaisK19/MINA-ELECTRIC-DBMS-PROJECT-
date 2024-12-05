import React, { useContext } from "react";
import styled from "styled-components";
import { WishlistContext } from "../contexts/wishlistContext";
import { CartContext } from "../contexts/cartContext";

const Wishlist = ({ isOpen, toggleWishlist }) => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addProducts } = useContext(CartContext); // Access CartContext for adding to basket

  const handleAddToBasket = async (ProductID, Title) => {
    try {
      // Use addProducts from CartContext
      await addProducts({ id: ProductID, quantity: 1 });
  
      alert(`Product "${Title}" added to basket!`);
    } catch (error) {
      console.error("Error adding to basket:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <WishlistSidebar isOpen={isOpen}>
      <SidebarOverlay onClick={toggleWishlist} />
      <SidebarContent>
        <SidebarHeader>
          <h2>Your Wishlist</h2>
          <CloseButton onClick={toggleWishlist}>X</CloseButton>
        </SidebarHeader>
        <WishlistContent>
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <WishlistItem key={item.ProductID}>
                <ProductImage src={item.ImageURL} alt={item.Title} />
                <ProductDetails>
                  <h3>{item.Title}</h3>
                  <Features>
                    {item.Features ? (
                      <ul>
                        {item.Features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No features listed.</p>
                    )}
                  </Features>
                  <Actions>
                    <Button
                      onClick={() => {
                        handleAddToBasket(item.ProductID, item.Title);
                        removeFromWishlist(item.ProductID);
                      }}
                    >
                      Add to Basket
                    </Button>
                    <Button red onClick={() => removeFromWishlist(item.ProductID)}>
                      Remove
                    </Button>
                  </Actions>
                </ProductDetails>
              </WishlistItem>
            ))
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </WishlistContent>
      </SidebarContent>
    </WishlistSidebar>
  );
};

export default Wishlist;

// Styled Components
const WishlistSidebar = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-100%")};
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px); /* Adds a blur effect */
  background: rgba(0, 0, 0, 0.7); /* Dark transparent background */
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
`;

const SidebarOverlay = styled.div`
  flex: 1;
  height: 100%;
  background: transparent;
`;

const SidebarContent = styled.div`
  width: 400px;
  height: 100%;
  background: rgba(255, 255, 255, 0.9); /* Slightly transparent white */
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background:  #007bff;
  color: white;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

const WishlistContent = styled.div`
  padding: 20px;
  flex: 1;
  overflow-y: auto;
`;

const WishlistItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 8px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  h3 {
    font-size: 1rem;
    margin-bottom: 5px;
    color: #333;
  }
`;

const Features = styled.div`
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: 0.9rem;
    color: #555;

    li {
      margin-bottom: 3px;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Button = styled.button`
  background: ${(props) => (props.red ? "#dc3545" : "#007bff")};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.red ? "#c82333" : "#0056b3")};
  }
`;
