// cartReducer.js
const updateStorage = (cartItems) => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cartItems.length > 0 ? cartItems : [])
  );
};
// Helper function to sync cart state with the backend
const syncWithBackend = async (method, data, clear = false) => {
  const url = clear
    ? "http://localhost:3001/api/cart/clear"
    : "http://localhost:3001/api/cart";

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies for authentication
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      console.error("Failed to sync with backend:", response.statusText);
    }
  } catch (error) {
    console.error("Error syncing with backend:", error);
  }
};

// Your CartReducer function
export const CartReducer = (state, action) => {
  let index = -1;
  const newItems = [...state.cartItems];

  if (action.payload) {
    index = newItems.findIndex((item) => item.id === action.payload.id);
  }

  switch (action.type) {
    case "LOAD_CART":
      return { ...state, cartItems: action.payload };

    case "ADD":
      if (index === -1) {
        newItems.push({ ...action.payload, quantity: 1 });
      } else {
        newItems[index].quantity += 1;
      }
      syncWithBackend("POST", action.payload); // Sync "ADD" action with backend
      break;

    case "INCQTY":
      if (index > -1) {
        newItems[index].quantity += 1;
        syncWithBackend("PUT", { productId: newItems[index].id, quantity: newItems[index].quantity });
      }
      break;

    case "DECQTY":
      if (index > -1) {
        newItems[index].quantity = Math.max(newItems[index].quantity - 1, 0);
        syncWithBackend("PUT", { productId: newItems[index].id, quantity: newItems[index].quantity });
      }
      break;

    case "REMOVE":
      if (index > -1) {
        syncWithBackend("DELETE", { productId: newItems[index].id });
        newItems.splice(index, 1);
      }
      break;

    case "CLEAR":
      syncWithBackend("DELETE", null, true); // Sync "CLEAR" action with backend
      newItems.length = 0;
      break;

    default:
      return state;
  }

  updateStorage(newItems);
  return { ...state, cartItems: newItems };
};
