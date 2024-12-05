import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import backgroundImage from './how-using-led-lights-can-help-you-save-money.jpg'; // Import your image
import { WishlistContext } from '../contexts/wishlistContext';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const FormBox = styled.div`
  width: 380px;
  height: 500px;
  background-color: rgba(255, 255, 255, 0.8); /* White with transparency */
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 10px; /* Slightly rounded corners */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Subtle shadow for a raised look */
`;

const HeaderForm = styled.div`
  margin-bottom: 15px;
  text-align: center;

  .icon {
    font-size: 100px;
    color: #007bff; /* Blue color for the logo */
  }
`;

const BodyForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  .input-group {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;

    .input-group-prepend {
      background-color: #007bff;
      padding: 10px;
      border-radius: 5px 0 0 5px;
    }

    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      outline: none;
      border-radius: 0 5px 5px 0;
    }
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
  color: red;
`;

const Social = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;

  button {
    background: none;
    border: none;
    cursor: pointer;

    i {
      font-size: 35px;
      color: #007bff;

      &:hover {
        color: #0056b3;
      }
    }
  }
`;

const Footer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: #333;

  a {
    color: #007bff;
    text-decoration: underline;

    &:hover {
      color: #0056b3;
    }
  }
`;

const Login = ({ setIsAuthenticated, redirectPath = '/' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { fetchWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for session management
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Check for admin credentials
        if (email === 'admin2@gmail.com' && password === 'admin222') {
          // Admin login, redirect to admin dashboard
          localStorage.setItem('auth', 'true');
          setIsAuthenticated(true);
          navigate('/adminDashboard');
        } else if (email === 'admin1@gmail.com' && password === 'admin111') {
          // Another admin login, redirect to a different admin dashboard
          localStorage.setItem('auth', 'true');
          setIsAuthenticated(true);
          navigate('/adminDashboard');
        } else {
          // Customer login, redirect to the home page
          localStorage.setItem('auth', 'true');
          setIsAuthenticated(true);
          setMessage('Login successful!');
          navigate(redirectPath); // Redirect to the specified path
          fetchWishlist();
        }
      } else {
        setMessage(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <Container>
      <FormBox>
        <HeaderForm>
          <i className="fa fa-user-circle icon"></i>
        </HeaderForm>
        <BodyForm onSubmit={handleLogin}>
          <div className="input-group">
            <div className="input-group-prepend">
              <i className="fa fa-user"></i>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <i className="fa fa-lock"></i>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Login</Button>
          <Button onClick={() => navigate('/register')}>Register</Button>
          {message && <Message>{message}</Message>}
        </BodyForm>
        <Footer>
          <div>
            <input type="checkbox" /> Remember Me
          </div>
          <a href="/forgot-password">Forgot your password?</a>
        </Footer>
        <Social>
          <button onClick={() => console.log('Facebook Clicked')} aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </button>
          <button onClick={() => console.log('Twitter Clicked')} aria-label="Twitter">
            <i className="fab fa-twitter-square"></i>
          </button>
          <button onClick={() => console.log('Google Clicked')} aria-label="Google">
            <i className="fab fa-google"></i>
          </button>
        </Social>
      </FormBox>
    </Container>
  );
};

export default Login;
