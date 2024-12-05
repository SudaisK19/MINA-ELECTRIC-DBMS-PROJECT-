import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import backgroundImage from './how-using-led-lights-can-help-you-save-money.jpg'; // Import your image

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110vh;
  width: 100%;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const FormBox = styled.div`
  width: 400px; /* Made the form box smaller */
  background-color: rgba(255, 255, 255, 0.9); /* White with slight transparency */
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  height: 110vh;
`;

const HeaderForm = styled.div`
  margin-bottom: 15px;
  text-align: center;

  .icon {
    font-size: 90px; /* Reduced the size of the icon */
    color: #007bff;
  }
`;

const BodyForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  .input-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;

    input {
      padding: 10px;
      width: 100%;
      border: 1px solid ${(props) => (props.error ? 'red' : '#ccc')};
      outline: none;
      border-radius: 5px;
      background-color: ${(props) => (props.error ? '#ffcccc' : 'white')}; /* Light red when error */
    }
  }

  .input-heading {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
    color: ${(props) => (props.error ? 'red' : '#333')};
  }

  .error-text {
    font-size: 12px;
    color: red;
    text-align: left;
    width: 100%;
    margin-top: 5px;
  }
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.div`
  margin-top: 10px;
  text-align: center;
  color: ${(props) => (props.success ? 'green' : 'red')};
`;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = true;
    if (!formData.lastName) tempErrors.lastName = true;
    if (!formData.email) tempErrors.email = true;
    if (!formData.password || formData.password.length < 7)
      tempErrors.password = 'Password must be at least 7 characters';
    if (!formData.address) tempErrors.address = true;
    if (!formData.phone) tempErrors.phone = true;
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post('http://localhost:3001/register', formData, {
        withCredentials: true,
      });
      setMessage({ text: response.data.message, success: true });
      navigate('/login'); // Redirect to login after successful registration
    } catch (error) {
      console.error('Error registering:', error);
      setMessage({
        text: error.response?.data?.message || 'Error registering',
        success: false,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear field error when typing
  };

  return (
    <Container>
      <FormBox>
        <HeaderForm>
          <i className="fa fa-user-circle icon"></i>
        </HeaderForm>
        <BodyForm onSubmit={handleRegister}>
          {[
            { label: 'First Name', name: 'firstName' },
            { label: 'Last Name', name: 'lastName' },
            { label: 'Email', name: 'email' },
            { label: 'Password', name: 'password' },
            { label: 'Address', name: 'address' },
            { label: 'Phone', name: 'phone' },
          ].map((field) => (
            <div className="input-group" key={field.name}>
              <label className="input-heading">{field.label}</label>
              <input
                type={field.name === 'password' ? 'password' : 'text'}
                name={field.name}
                placeholder={field.label}
                value={formData[field.name]}
                onChange={handleInputChange}
                error={!!errors[field.name]}
              />
              {field.name === 'password' && errors.password && (
                <div className="error-text">{errors.password}</div>
              )}
            </div>
          ))}
          <Button type="submit">Register</Button>
          {message && (
            <Message success={message.success}>{message.text}</Message>
          )}
        </BodyForm>
      </FormBox>
    </Container>
  );
};

export default Register;
