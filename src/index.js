import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './component/App';
import ProductDetail from './component/productDetail';
import Basket from './component/basket';
import Checkout from './component/checkout';



import {
  BrowserRouter,
  Route,
  
  Routes
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="basket" element={<Basket />} />
        <Route path="checkout" element={<Checkout />} />
        {/* <Route path="products/:productsId" element={<ProductDetail/>}/> */}
        <Route path="products/:productId" element={<ProductDetail />} />


      </Routes>

    </BrowserRouter>
  </React.StrictMode>
);










