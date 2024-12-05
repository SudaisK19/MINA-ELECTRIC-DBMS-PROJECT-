import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import styled from "styled-components";

// Styled components for the Orders page
const OrdersContainer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  margin: 0;
`;

const SearchForm = styled(Form)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  max-width: 500px;
`;

const SearchInputContainer = styled.div`
  position: relative;
  flex-grow: 1;
  width: 100%;
`;

const SearchInput = styled(Form.Control)`
  width: 100%;
  padding: 6px 30px 6px 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.2;
  height: 36px;
`;

const SearchIcon = styled.i`
  position: absolute;
  right: 10px;
  top: 32%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #495057;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  color: #495057;
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: left;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  color: #343a40;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f1f3f5;
  }
`;

const NestedTable = styled.table`
  width: 100%;
  margin-top: 10px;
`;

const NestedTableHeader = styled.th`
  padding: 8px;
  text-align: left;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
`;

const NestedTableCell = styled.td`
  padding: 8px;
  text-align: left;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
`;

// Styled Button for "Show Items" and "Hide Items"
const StyledButton = styled.button`
  background-color: #007bff; /* Blue color */
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }

  &:focus {
    outline: none;
  }
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusOptions] = useState([
    "Pending",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [searchCustomerId, setSearchCustomerId] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    if (searchCustomerId) {
      fetchOrdersByCustomer(searchCustomerId);
    } else {
      fetchAllOrders();
    }
  }, [searchCustomerId]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/admin/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrdersByCustomer = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/admin/orders/search?customerId=${customerId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/api/admin/orders/${orderId}`, {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === orderId
            ? { ...order, OrderStatus: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const toggleExpandOrder = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null); // Collapse if already expanded
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/admin/orders/${orderId}/items`
        );
        const orderItems = response.data;
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.OrderID === orderId ? { ...order, items: orderItems } : order
          )
        );
        setExpandedOrder(orderId); // Expand the selected order
      } catch (error) {
        console.error("Error fetching order items:", error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();  // Prevent form submission
    if (searchCustomerId) {
      fetchOrdersByCustomer(searchCustomerId);  // Perform search
    } else {
      fetchAllOrders();  // If empty, show all orders
    }
  };

  return (
    <OrdersContainer>
      <Title>Orders</Title>
      
      {/* Search form with input */}
      <SearchForm onSubmit={handleSearch}>
        <SearchInputContainer>
          <SearchInput
            type="text"
            placeholder="Search by Customer ID"
            value={searchCustomerId}
            onChange={(e) => setSearchCustomerId(e.target.value)}
            className="search-input mb-3"
          />
          <SearchIcon className="fas fa-search" />
        </SearchInputContainer>
      </SearchForm>

      {/* Orders Table */}
      <Table>
        <thead>
          <tr>
            <TableHeader>OrderID</TableHeader>
            <TableHeader>Customer ID</TableHeader>
            <TableHeader>Total Amount</TableHeader>
            <TableHeader>Order Date</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Actions</TableHeader>
            <TableHeader>Items</TableHeader>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.OrderID}>
              <TableRow>
                <TableCell>{order.OrderID}</TableCell>
                <TableCell>{order.CustomerID}</TableCell>
                <TableCell>{order.TotalAmount.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.OrderDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.OrderStatus}</TableCell>
                <TableCell>
                  <Form.Select
                    value={order.OrderStatus}
                    onChange={(e) =>
                      handleStatusChange(order.OrderID, e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </TableCell>
                <TableCell>
                  <StyledButton
                    onClick={() => toggleExpandOrder(order.OrderID)}
                  >
                    {expandedOrder === order.OrderID ? "Hide Items" : "Show Items"}
                  </StyledButton>
                </TableCell>
              </TableRow>
              {expandedOrder === order.OrderID && order.items && (
                <TableRow>
                  <TableCell colSpan="7">
                    <NestedTable>
                      <thead>
                        <tr>
                          <NestedTableHeader>Product ID</NestedTableHeader>
                          <NestedTableHeader>Quantity</NestedTableHeader>
                          <NestedTableHeader>Price</NestedTableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.ProductID}>
                            <NestedTableCell>{item.ProductID}</NestedTableCell>
                            <NestedTableCell>{item.Quantity}</NestedTableCell>
                            <NestedTableCell>{item.Price}</NestedTableCell>
                          </tr>
                        ))}
                      </tbody>
                    </NestedTable>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </OrdersContainer>
  );
};

export default Orders;
