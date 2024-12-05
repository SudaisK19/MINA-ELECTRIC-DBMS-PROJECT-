import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components for Customers page
const CustomersContainer = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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

const Customers = () => {
    const [customers, setCustomers] = useState([]);

    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Fetch customers from backend
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/admin/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    return (
        <CustomersContainer>
            <h1>Customers</h1>

            {/* Customers Table */}
            <Table className="mt-3">
                <thead>
                    <tr>
                        <TableHeader>CustomerID</TableHeader>
                        <TableHeader>First Name</TableHeader>
                        <TableHeader>Last Name</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Address</TableHeader>
                        <TableHeader>Phone</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <TableRow key={customer.CustomerID}>
                            <TableCell>{customer.CustomerID}</TableCell>
                            <TableCell>{customer.FirstName}</TableCell>
                            <TableCell>{customer.LastName}</TableCell>
                            <TableCell>{customer.Email}</TableCell>
                            <TableCell>{customer.Address}</TableCell>
                            <TableCell>{customer.Phone}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </CustomersContainer>
    );
};

export default Customers;
