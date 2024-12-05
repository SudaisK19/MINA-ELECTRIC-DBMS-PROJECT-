import './adminDashboard.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Reviews from './pages/Reviews';

const App = () => {
    const [metrics, setMetrics] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalCustomers: 0,
    });

    // Fetch dashboard metrics on component mount
    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/admin/metrics');
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        }
    };

    return (
        <div className="app-container">
            <header className="main-header">
                    Mina Electric Admin Dashboard
            </header>
            <Sidebar />
            <div className="main-content">        
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="dashboard">
                    
                                <div className="dashboard-metrics">
                                    <div className="metric-card">
                                        <h3>Total Products</h3>
                                        <p>{metrics.totalProducts}</p>
                                    </div>
                                    <div className="metric-card">
                                        <h3>Total Categories</h3>
                                        <p>{metrics.totalCategories}</p>
                                    </div>
                                    <div className="metric-card">
                                        <h3>Total Orders</h3>
                                        <p>{metrics.totalOrders}</p>
                                    </div>
                                    <div className="metric-card">
                                        <h3>Total Customers</h3>
                                        <p>{metrics.totalCustomers}</p>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/reviews" element={<Reviews />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;