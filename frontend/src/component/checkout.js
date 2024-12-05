import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Checkout = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    billingAddress1: "",
    shippingAddress1: "",
  });

  const [basketItems, setBasketItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [copyAddress, setCopyAddress] = useState(false);
  const [useSavedData, setUseSavedData] = useState(false); // New state for "Use Saved Data"

  const navigate = useNavigate();

  // Errors for validation
  const errors = {
    shippingAddress1: form.shippingAddress1.length === 0,
  };

  const disabled = Object.keys(errors).some((x) => errors[x]);

  // Fetch customer details and basket items
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customer details
        const customerResponse = await fetch("http://localhost:3001/api/profile", {
          method: "GET",
          credentials: "include",
        });
        const customerData = await customerResponse.json();

        // Save customer data separately for the "Use Saved Data" checkbox
        setForm((prev) => ({
          ...prev,
          savedData: {
            name: `${customerData.FirstName} ${customerData.LastName}`,
            email: customerData.Email,
            billingAddress1: customerData.Address,
          },
        }));

        // Fetch basket items
        const basketResponse = await fetch("http://localhost:3001/api/cart", {
          method: "GET",
          credentials: "include",
        });
        const basketData = await basketResponse.json();
        setBasketItems(basketData);
        const total = basketData.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
        setTotalPrice(total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle changes in form fields
  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle copying billing address to shipping address
  const handleCopyAddress = () => {
    setCopyAddress(!copyAddress);
    if (!copyAddress) {
      setForm((prev) => ({
        ...prev,
        shippingAddress1: prev.billingAddress1,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        shippingAddress1: "",
      }));
    }
  };

  // Handle "Use Saved Data" checkbox
  const handleUseSavedData = () => {
    setUseSavedData(!useSavedData);
    if (!useSavedData) {
      setForm((prev) => ({
        ...prev,
        name: prev.savedData?.name || "",
        email: prev.savedData?.email || "",
        billingAddress1: prev.savedData?.billingAddress1 || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        name: "",
        email: "",
        billingAddress1: "",
      }));
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (disabled) return;
    // Submit the form
    navigate("/orderConfirmation");
  };
  const handlePlaceOrder = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shippingAddress: form.shippingAddress1 }),
      });

      if (response.ok) {
        const { orderId } = await response.json(); // Ensure backend returns orderId
        if (!orderId) {
          console.error('Order ID missing in response');
          return;
        }
        navigate(`/orderConfirmation/${orderId}`); // Pass the orderId to the URL
      } else {
        console.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <CheckoutContainer>
      {/* Checkout Form Section */}
      <FormSection>
        <form onSubmit={handleSubmit}>
          <CheckoutTitle>Checkout</CheckoutTitle>

          {/* Billing Details */}
          <CheckoutHeader>
            <h4>Billing Details</h4>
          </CheckoutHeader>
          <CheckboxContainer>
            <input
              type="checkbox"
              checked={useSavedData}
              onChange={handleUseSavedData}
            />
            Use Saved Data
          </CheckboxContainer>
          <CheckoutHeaderLine />
          <CheckoutTable>
            <CheckoutFormLabel>Name</CheckoutFormLabel>
            <StyledInput
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Name"
            />

            <CheckoutFormLabel>Email</CheckoutFormLabel>
            <StyledInput
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
            />

            <CheckoutFormLabel>Billing Address</CheckoutFormLabel>
            <StyledInput
              type="text"
              name="billingAddress1"
              value={form.billingAddress1}
              onChange={handleChange}
              placeholder="Enter Billing Address"
            />
          </CheckoutTable>

          {/* Shipping Details */}
          <CheckoutHeader>
            <h4>Shipping Details</h4>
          </CheckoutHeader>
          <CheckoutHeaderLine />
          <CheckoutTable>
            <CheckoutFormLabel>
              Shipping Address
              <CheckboxContainer>
                <input type="checkbox" checked={copyAddress} onChange={handleCopyAddress} />
                Copy Billing Address
              </CheckboxContainer>
            </CheckoutFormLabel>
            <StyledInput
              type="text"
              name="shippingAddress1"
              value={form.shippingAddress1}
              onChange={handleChange}
              placeholder="Enter Shipping Address"
              hasError={errors.shippingAddress1}
            />
          </CheckoutTable>

          {/* Buttons */}
          <ButtonContainer>
            <CancelButton onClick={() => navigate("/cart")}>Cancel</CancelButton>
            <CheckoutButton onClick={ handlePlaceOrder} disabled={disabled}>Confirm Order</CheckoutButton>
          </ButtonContainer>
        </form>
      </FormSection>

      {/* Order Summary Section */}
      <DetailsSection>
        <OrderTitle>Order Summary</OrderTitle>
        {basketItems.map((item) => (
          <OrderItem key={item.ProductID}>
            <ItemName>{item.Title}</ItemName>
            <ItemPrice>₨ {item.Price * item.Quantity}</ItemPrice>
          </OrderItem>
        ))}
        <TotalPrice>
          <strong>Total: ₨ {totalPrice}</strong>
        </TotalPrice>
      </DetailsSection>
    </CheckoutContainer>
  );
};

export default Checkout;

// Styled Components remain the same except for adding new styling if needed.

const CheckoutContainer = styled.div`
  display: flex;
  width: 95vw;
  height: auto;
  min-height: 100vh;
  background-color: transparent;
  padding: 20px;
  gap: 20px;
  box-sizing: border-box;
`;

const FormSection = styled.div`
  flex: 2;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const CheckboxContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #555;

  input[type="checkbox"] {
    margin-right: 5px;
    cursor: pointer;
  }
`;

const DetailsSection = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const CheckoutTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const CheckoutHeader = styled.div`
  margin: 10px 0;
`;

const CheckoutHeaderLine = styled.hr`
  width: 100%;
  border: 1px solid #ddd;
`;

const CheckoutTable = styled.div`
  margin: 10px 0;

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const CheckoutFormLabel = styled.label`
  font-size: 1rem;
  color: #555;
  margin-bottom: 5px;
  display: block;
`;

// const CheckoutAddress = styled.div`
//   margin-bottom: 20px;
// `;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  background-color: #ff4d4d;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e60000;
  }
`;

const CheckoutButton = styled.button`
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#007bff")};
  color: ${({ disabled }) => (disabled ? "#666" : "#fff")};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid ${({ hasError }) => (hasError ? "red" : "#ccc")};
  border-radius: 4px;
  background-color: ${({ hasError }) => (hasError ? "#ffe6e6" : "white")};
`;

const OrderTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ItemName = styled.div`
  font-size: 1rem;
  color: #555;
`;

const ItemPrice = styled.div`
  font-size: 1rem;
  color: #555;
`;

const TotalPrice = styled.div`
  font-size: 1.2rem;
  color: #333;
  margin-top: 20px;
  text-align: right;
`;
