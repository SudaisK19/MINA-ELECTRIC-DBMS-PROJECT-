import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' for React 18
import App from './component/App'; // Your main App component
import CartContextProvider from './contexts/cartContext'; // Cart context provider
import WishlistProvider from "./contexts/wishlistContext"; // Wishlist context provider

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot instead of render

root.render(
  <React.StrictMode>
    <CartContextProvider>
      <WishlistProvider> {/* Wrap WishlistProvider around App */}
        <App />
      </WishlistProvider>
    </CartContextProvider>
  </React.StrictMode>
);
