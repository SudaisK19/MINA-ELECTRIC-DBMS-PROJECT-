import "./App.css";
import React, { useState, useEffect } from "react";
import { getCategories } from "./fetcher";
import ProductDetail from "./productDetail";
import Basket from "./basket";
import Checkout from "./checkout";
import Category from "./category";
import Layout from "./layout";
import Home from "./home";
import OrderConfirmation from "./orderConfirmation";
import SearchResult from "./searchResult";
import About from "./about";
import Profile from "./profile";
import Login from "./login";
import Register from "./register"; // Import Register component
import AdminDashboard from "./adminDashboard"; // Import admin dashboard component
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Reviews from './pages/Reviews';

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

function App() {
  const [categories, setCategories] = useState({ errorMessage: "", data: [], isLoading: true });
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("auth") === "true");

  useEffect(() => {
    const fetchData = async () => {
      const responseObject = await getCategories();
      setCategories({ ...responseObject, isLoading: false });
    };
    fetchData();
  }, []);

  // Listen to storage events to handle auth changes across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const storedAuth = localStorage.getItem("auth") === "true";
      setIsAuthenticated(storedAuth);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}  redirectPath="/" />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout categories={categories} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<Home />} />
          <Route path="basket" element={<Basket />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/orderConfirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="search" element={<SearchResult />} />
          <Route path="categories/:catId" element={<Category />} />
          <Route path="categories/:categoryId/products/:productId" element={<ProductDetail />} />
          <Route path="about" element={<About />} />
        </Route>

          {/* Admin Routes */}
          <Route
          path="/adminDashboard"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
        >
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
