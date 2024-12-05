import React, { createContext, useReducer, useEffect } from "react";
import { wishlistReducer } from "./wishlistReducer";

export const WishlistContext = createContext();

const initialWishlistState = {
  wishlistItems: [],
};

const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialWishlistState);

  // Fetch wishlist from the backend on load
  // Fetch wishlist from the backend
  const fetchWishlist = async () => { // Declare the function first
    try {
      const response = await fetch("http://localhost:3001/api/wishlist", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "LOAD_WISHLIST", payload: data });
      } else {
        console.error("Failed to fetch wishlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist(); // Now it is defined and can be used
  }, []);

  // Add item to wishlist
  const addToWishlist = async (payload) => {
    try {
      const response = await fetch("http://localhost:3001/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: payload.id }), // Send only productId
      });
  
      if (response.ok) {
        const updatedWishlist = await response.json();
        dispatch({ type: "LOAD_WISHLIST", payload: updatedWishlist });
      } else {
        const error = await response.json();
        console.error("Failed to add to wishlist:", error.message);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };
  

  // Remove item from wishlist
  const removeFromWishlist = async (productID) => {
    try {
      const response = await fetch(`http://localhost:3001/api/wishlist/${productID}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        dispatch({ type: "REMOVE_FROM_WISHLIST", payload: productID });
      } else {
        const error = await response.json();
        console.error("Failed to remove from wishlist:", error.message);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const contextValues = {
    wishlistItems: state.wishlistItems,
    fetchWishlist, // Expose fetchWishlist
    addToWishlist,
    removeFromWishlist,
  };

  return (
    <WishlistContext.Provider value={contextValues}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
