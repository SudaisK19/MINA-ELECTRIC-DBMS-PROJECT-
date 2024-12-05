import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        } else {
          console.error('Failed to fetch order details.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (!orderDetails || orderDetails.length === 0) {
    return <p>Order not found.</p>;
  }

  const orderSummary = orderDetails[0];

  const handleBackToHome = () => {
    navigate('/');
  };

  // const handleGenerateSlip = () => {
  //   alert('Generating slip...');
  // };

  return (
    <PageWrapper>
      <ConfirmationCard>
        <IconWrapper>
          {loading ? <Spinner /> : <TickIcon>✔</TickIcon>}
        </IconWrapper>
        <h1>Your Order is Placed</h1>
        <p>Thank you for ordering! Your order has been successfully placed.</p>

        <OrderDetails>
          <OrderSummary>
            <SectionTitle>Order Summary</SectionTitle>
            <p><strong>Order ID:</strong> {orderSummary.OrderID}</p>
            <p><strong>Date:</strong> {new Date(orderSummary.OrderDate).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ₨ {orderSummary.TotalAmount}</p>
            <p><strong>Shipping Address:</strong> {orderSummary.ShippingAddress}</p>
            <p><strong>Order Status:</strong> {orderSummary.OrderStatus || 'Order Placed'}</p>
          </OrderSummary>

          <VerticalDivider />

          <ProductDetails>
            <SectionTitle>Items in Your Order</SectionTitle>
            {orderDetails.map((item) => (
              <Item key={item.OrderItemID}>
                <strong>{item.ProductTitle}</strong>
                <p>Price: ₨ {item.ItemPrice}</p>
                <p>Quantity: {item.Quantity}</p>
                <p>Manufacturer: {item.ProductManufacturer}</p>
              </Item>
            ))}
          </ProductDetails>
        </OrderDetails>

        <ButtonContainer>
          <Button lightRed onClick={handleBackToHome}>Continue Shopping</Button>
         
        </ButtonContainer>
      </ConfirmationCard>
    </PageWrapper>
  );
};

export default OrderConfirmation;

// Styled Components

// Page animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  animation: ${fadeIn} 1s ease-in-out;
`;

const ConfirmationCard = styled.div`
  background-color: #f9f9f9;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 95vw;
  
`;

const IconWrapper = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const TickIcon = styled.span`
  color: #46a758;
  animation: ${bounce} 1.5s ease infinite;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #46a758;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `} 2s linear infinite;
`;

const OrderDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  text-align: left;
`;

const OrderSummary = styled.div`
  flex: 1;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const VerticalDivider = styled.div`
  width: 2px;
  background-color: #ddd;
  margin: 0 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

const Item = styled.div`
  margin-bottom: 15px;

  strong {
    display: block;
    margin-bottom: 5px;
    font-size: 16px;
    color: #333;
  }

  p {
    font-size: 14px;
    color: #555;
    margin: 3px 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 25px;
  font-size: 16px;
  background-color: ${(props) => (props.lightRed ? '#ff4d4d' : props.primary ? '#007bff' : '#f8f9fa')};
  color: ${(props) => (props.lightRed ? '#white' : props.primary ? '#fff' : '#333')};
  border: ${(props) => (props.lightRed ? '1px solid #f5c6cb' : 'none')};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  

  &:hover {
    background-color: ${(props) =>
      props.lightRed ? '#f5c6cb' : props.primary ? '#0056b3' : '#e2e6ea'};
  }
`;
