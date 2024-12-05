import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/cartContext";
import { WishlistContext } from "../contexts/wishlistContext";
//import { getProductsByID } from "./fetcher";

const Basket = () => {
  const {  increaseQuantity, decreaseQuantity, removeProducts, clearBasket } =
    useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const handleIncreaseQuantity = async (item) => {
    await increaseQuantity({ id: item.id, quantity: item.quantity });
  };
  
  const handleDecreaseQuantity = async (item) => {
    if (item.quantity > 1) {
      // Decrease the quantity by 1 if greater than 1
      await decreaseQuantity({ id: item.id, quantity: item.quantity });
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      // If the quantity is 1, remove the product from the cart
      await handleRemoveProduct(item.id);
      setCartItems((prev) =>
        prev.filter((cartItem) => cartItem.id !== item.id)
      );
    }
  };
  
  
  
  const handleRemoveProduct = async (item) => {
    await removeProducts({ id: item.id });
  };
  
  const handleClearBasket = async () => {
    await clearBasket();
  };
  
  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/cart', {
          credentials: 'include',
        });
  
        if (!response.ok) {
          console.error('Error fetching cart:', response.statusText);
          return;
        }
  
        const data = await response.json();
  
        // Ensure data is an array
        if (Array.isArray(data)) {
          const updatedItems = data.map((item) => ({
            id: item.ProductID,
            title: item.Title,
            price: item.Price,
            image: item.ImageURL,
            quantity: item.Quantity,
            dimensions: item.Dimensions,
            rating: item.Rating,
            model: item.Model,
          }));
          setCartItems(updatedItems);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
  
    fetchCartProducts();
  }, []);
  
  
  const renderTotal = () => {
    if (!Array.isArray(cartItems)) return "0.00"; // Handle non-array gracefully
    const total = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return total.toFixed(2);
  };
  

  const renderCart = () => {
    // Check if cartItems is a valid array and not empty
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return <EmptyMessage>Your basket is currently empty!</EmptyMessage>;
    }
  
    return cartItems.map((item) => (
      <CartItem key={item.id}>
        <ProductImage
          src={item.image || "/assets/default-product.jpg"}
          alt={item.title}
        />
        <ProductDetails>
          <ProductTitle>{item.title}</ProductTitle>
          <ProductSubInfo>Model: {item.model || "N/A"}</ProductSubInfo>
          <ProductSubInfo>
            Dimensions: {item.dimensions || "N/A"}
          </ProductSubInfo>
          <ProductSubInfo>
            Rating: {item.rating || "Not Rated Yet"}
          </ProductSubInfo>
          <ButtonRow>
            <Button
              red
              onClick={() => {
                handleRemoveProduct(item);
                setCartItems((prev) =>
                  prev.filter((cartItem) => cartItem.id !== item.id)
                );
              }}
            >
              <span role="img" aria-label="Trash Bin">
                🗑
              </span>{" "}
              Remove Item
            </Button>
            <Button
              secondary
              onClick={() => {
                addToWishlist({
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  image: item.image,
                });
                handleRemoveProduct(item);
                setCartItems((prev) =>
                  prev.filter((cartItem) => cartItem.id !== item.id)
                );
              }}
            >
              <span role="img" aria-label="Heart">
                ❤️
              </span>{" "}
              Move To Wishlist
            </Button>
          </ButtonRow>
        </ProductDetails>
        <ProductActions>
          <QuantityButton
            onClick={() => {
              handleDecreaseQuantity(item);
              setCartItems((prev) =>
                prev.map((cartItem) =>
                  cartItem.id === item.id
                    ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 1) }
                    : cartItem
                )
              );
            }}
          >
            -
          </QuantityButton>
          <Quantity>{item.quantity}</Quantity>
          <QuantityButton
            onClick={() => {
              handleIncreaseQuantity(item);
              setCartItems((prev) =>
                prev.map((cartItem) =>
                  cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
                )
              );
            }}
          >
            +
          </QuantityButton>
          <ProductPrice>₨ {item.price * item.quantity}</ProductPrice>
        </ProductActions>
      </CartItem>
    ));
  };
  
  

  return (
    <BasketContainer>
      <BasketHeader>Shopping Cart</BasketHeader>
      <BasketContent>
        <CartSection>
          <CartHeader>Cart ({cartItems.length} items)</CartHeader>
          {renderCart()}
        </CartSection>
        <SummarySection>
          <SummaryHeader>The total amount of</SummaryHeader>
          <SummaryDetails>
            <SummaryRow>
              <span>Total amount</span>
              <span>₨ {renderTotal()}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Shipping</span>
              <span>FREE</span>
            </SummaryRow>
            <SummaryDivider />
            <SummaryRow bold>
              <span>The total amount of (Including VAT)</span>
              <span>₨ {renderTotal()}</span>
            </SummaryRow>
            
          </SummaryDetails>
          <SummaryDivider />
          <CheckoutButton onClick={() => navigate("/checkout")}>
            Go To Checkout
          </CheckoutButton>
          <SummaryDivider />
          <ClearCart red onClick={handleClearBasket}>Clear Cart</ClearCart>
        </SummarySection>
      </BasketContent>
    </BasketContainer>
  );
};

export default Basket;

// Styled Components
const BasketContainer = styled.div`
  padding: 20px;
  background-color: transparent;
  min-height: 100vh;
  width: 95vw; /* Full viewport width */
  margin: 0; /* Remove any margins */
  box-sizing: border-box; /* Include padding and border in width */
`;


const BasketHeader = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const BasketContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const CartSection = styled.div`
  flex: 2;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* Full width for cart section */
`;

const CartHeader = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductDetails = styled.div`
  flex: 2;
  margin-left: 20px;
`;

const ProductTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
`;

const ProductSubInfo = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-top: 5px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  background: ${(props) =>
    props.red ? "#dc3545" : props.secondary ? "#c0c0c0" : "#007bff"};
  color: ${(props) =>
    props.red ? "#fff" : props.secondary ? "#333" : "#c0c0c0"};
  border: ${(props) => (props.secondary || props.red ? "1px solid #ddd" : "none")};
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: ${(props) =>
      props.red ? "#c82333" : props.secondary ? "#e0e0e0" : "#0056b3"};
  }
`;

const ProductActions = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
`;

const Quantity = styled.span`
  font-size: 1rem;
  font-weight: bold;
  margin: 5px 0;
`;

const ProductPrice = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const SummarySection = styled.div`
  flex: 1;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SummaryHeader = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const SummaryDetails = styled.div`
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${(props) => (props.bold ? "1.2rem" : "1rem")};
  font-weight: ${(props) => (props.bold ? "bold" : "normal")};
  margin-bottom: 10px;
`;

const SummaryDivider = styled.hr`
  border: 0;
  height: 1px;
  background: #ddd;
  margin: 20px 0;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;
const ClearCart = styled.button`
  width: 100%;
  padding: 10px;
  background: #ff6347;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
`;