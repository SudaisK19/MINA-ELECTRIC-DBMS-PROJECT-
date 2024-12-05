import React, { createContext, useReducer, useEffect } from "react";
import { CartReducer } from "./cartReducer";

export const CartContext = createContext();

const initialState = { cartItems: [] };

const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CartReducer, initialState);

  useEffect(() => {
    // Save cart items to localStorage whenever state changes
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const addProducts = async (payload) => {
    try {
      // First, optimistically update the cart state in the frontend
      const optimisticCart = [
        ...state.cartItems, // assuming `state.cartItems` holds the current cart
        { id: payload.id, quantity: 1 },
      ];
  
      // Dispatch to immediately reflect this in the UI
      dispatch({ type: "LOAD_CART", payload: optimisticCart });
  
      // Now, send the POST request to the backend
      const response = await fetch("http://localhost:3001/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: payload.id, quantity: 1 }),
      });
  
      if (response.ok) {
        // Fetch the updated cart from the backend, just to sync the data
        const cartItems = await getItems();
        dispatch({ type: "LOAD_CART", payload: cartItems });
      } else {
        // Handle error - rollback optimistic update
        dispatch({ type: "LOAD_CART", payload: state.cartItems });
        const error = await response.json();
        console.error("Error adding product to cart:", error.message);
      }
    } catch (error) {
      // Handle unexpected error - rollback optimistic update
      dispatch({ type: "LOAD_CART", payload: state.cartItems });
      console.error("Error adding product to cart:", error);
    }
  };
  

  const increaseQuantity = async (payload) => {
    try {
      await fetch("http://localhost:3001/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: payload.id, quantity: payload.quantity + 1 }),
      });
      const updatedCart = await getItems(); // Fetch updated cart from backend
      dispatch({ type: "LOAD_CART", payload: updatedCart }); // Update state with new cart
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const decreaseQuantity = async (payload) => {
    try {
      if (payload.quantity > 0) {
        await fetch("http://localhost:3001/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId: payload.id, quantity: payload.quantity - 1 }),
        });
        const updatedCart = await getItems(); // Fetch updated cart from backend
        dispatch({ type: "LOAD_CART", payload: updatedCart }); // Update state with new cart
      } else {
        console.error("Quantity cannot be less than 1.");
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const removeProducts = async (payload) => {
    try {
      await fetch(`http://localhost:3001/api/cart/${payload.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const updatedCart = await getItems(); // Fetch updated cart from backend
      dispatch({ type: "LOAD_CART", payload: updatedCart }); // Update state with new cart
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };
  
  const clearBasket = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cart/clear", {
        method: "DELETE",
        credentials: "include",
      });
  
      if (response.ok) {
        dispatch({ type: "CLEAR" }); // Clear frontend state
        alert("Cart cleared successfully!");
      } else {
        const error = await response.json();
        console.error("Failed to clear basket:", error.message);
        alert(`Error clearing basket: ${error.message}`);
      }
    } catch (error) {
      console.error("Error clearing basket:", error);
      alert("An unexpected error occurred.");
    }
  };
  
  
  
  
  const getItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cart", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched cart items:", data); // Debug log
        return Array.isArray(data) ? data : []; // Ensure valid array
      } else {
        console.error("Failed to fetch cart items:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  };
  
  
  

  const contextValues = {
    addProducts,
    increaseQuantity,
    decreaseQuantity,
    removeProducts,
    clearBasket,
    getItems,
    ...state,
  };

  return (
    <CartContext.Provider value={contextValues}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
