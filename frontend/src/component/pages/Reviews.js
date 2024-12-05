import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components for Reviews
const ReviewsContainer = styled.div`
    padding: 20px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHeader = styled.th`
    padding: 10px;
    text-align: left;
    background-color: #f8f9fa;
    color: #495057;
`;

const TableData = styled.td`
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

const DangerButton = styled(Button)`
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
`;

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    // Fetch reviews on component mount
    useEffect(() => {
        fetchReviews();
    }, []);

    // Fetch reviews from backend
    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/admin/reviews');
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    // Handle delete review
    const handleDeleteReview = async (reviewId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this review?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3001/api/admin/reviews/${reviewId}`);
                setReviews((prev) => prev.filter((review) => review.ReviewID !== reviewId));
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('Failed to delete the review. Please try again.');
            }
        }
    };

    return (
        <ReviewsContainer>
            <h1>Reviews</h1>

            {/* Reviews Table */}
            <Table className="mt-3">
                <thead>
                    <tr>
                        <TableHeader>ReviewID</TableHeader>
                        <TableHeader>Customer Name</TableHeader>
                        <TableHeader>Product Name</TableHeader>
                        <TableHeader>Rating</TableHeader>
                        <TableHeader>Comment</TableHeader>
                        <TableHeader>Date</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review, index) => (
                        <TableRow key={review.ReviewID}>
                            <TableData>{review.ReviewID}</TableData>
                            <TableData>{review.CustomerName}</TableData>
                            <TableData>{review.ProductName}</TableData>
                            <TableData>{review.Rating}</TableData>
                            <TableData>{review.ReviewText || 'No comment'}</TableData>
                            <TableData>{new Date(review.ReviewDate).toLocaleDateString()}</TableData>
                            <TableData>
                                <DangerButton
                                    variant="danger"
                                    onClick={() => handleDeleteReview(review.ReviewID)}
                                >
                                    Delete
                                </DangerButton>
                            </TableData>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </ReviewsContainer>
    );
};

export default Reviews;
