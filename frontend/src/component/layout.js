import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUser, FaShoppingCart, FaHeart } from "react-icons/fa";
import styled from "styled-components";
import Search from "./search";
import Wishlist from "./wishlist";
import { getCategories } from "./fetcher";

const Layout = () => {
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [categories, setCategories] = useState({ errorMessage: "", data: [] });

  const toggleWishlist = () => {
    setWishlistOpen(!isWishlistOpen);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      if (!response.errorMessage) {
        setCategories(response);
      } else {
        console.error("Error fetching categories:", response.errorMessage);
      }
    };

    fetchCategories();
  }, []);

  const renderCategories = () => {
    return categories.data.map((category) => (
      <DropdownItem key={category.CategoryID}>
        <Link to={`/categories/${category.CategoryID}`}>{category.Title}</Link>
      </DropdownItem>
    ));
  };

  return (
    <>
      <header>
        <HeaderContainer>
          {/* Profile Icon */}
          <ProfileSection>
            <Link to="/profile">
              <FaUser size={24} />
            </Link>
          </ProfileSection>

          {/* Mina Electric Logo */}
          <TitleSection>
            <Link to="/">MINA ELECTRIC</Link>
          </TitleSection>

          {/* Wishlist & Cart Icons */}
          <IconsSection>
            <button onClick={toggleWishlist} aria-label="Toggle Wishlist">
              <FaHeart size={24} />
            </button>
            <Link to="/basket">
              <FaShoppingCart size={24} />
            </Link>
          </IconsSection>
        </HeaderContainer>
      </header>

      {/* Wishlist Sidebar */}
      <Wishlist isOpen={isWishlistOpen} toggleWishlist={toggleWishlist} />

      <NavBar>
        <Search /> {/* Search bar on the left */}
        <NavItems>
          <NavItem>
            <Link to="/">Home</Link>
          </NavItem>
          <NavItemWithArrow>
            Categories
            <DropdownMenu>{renderCategories()}</DropdownMenu>
          </NavItemWithArrow>
          <NavItem>
            <Link to="/about">About Us</Link>
          </NavItem>
        </NavItems>
      </NavBar>

      <section>
        <main>
          <Outlet />
        </main>
      </section>

      <footer>
        <FooterContainer>
          <FooterLine />
          <FooterContent>
            <FooterLeft>Connect With Mina Electric</FooterLeft>
            <FooterLogoContainer>
              <FooterLogo>Mina Electric ©</FooterLogo>
              <FooterLinks>
                <FooterLink href="/">Home</FooterLink>
                <VerticalDivider />
                <FooterLink href="/about">About Us</FooterLink>
                <VerticalDivider />
                <FooterLink href="/login">Login</FooterLink>
              </FooterLinks>
            </FooterLogoContainer>
          </FooterContent>
        </FooterContainer>
      </footer>
    </>
  );
};

export default Layout;
// Styled Components
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  width: 100%;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;

  a {
    color: white;
    text-decoration: none;
    transition: transform 0.3s, color 0.3s ease;
  }

  a:hover {
    transform: scale(1.2); /* Slight zoom effect */
    color: #ffcc00; /* Unique hover color */
  }
`;

const TitleSection = styled.div`
  flex: 1;
  text-align: center;

  a {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
    letter-spacing: 2px;
    text-shadow: 
      0px 0px 30px rgba(255, 204, 0, 1), /* Core bright glow */
      0px 0px 50px rgba(255, 204, 0, 1), /* Surround glow */
      0px 0px 80px rgba(255, 204, 0, 1); /* Faint distant glow */
    animation: glowingEffect 5s infinite;
  }

  @keyframes glowingEffect {
    0% {
      text-shadow: 
        0px 0px 30px rgba(255, 204, 0, 1),
        0px 0px 50px rgba(255, 204, 0, 1),
        0px 0px 80px rgba(255, 204, 0,1);
    }
    50% {
      text-shadow: 
        0px 0px 80px rgba(255, 204, 0, 1), /* Peak brightness */
        0px 0px 100px rgba(255, 204, 0, 1),
        0px 0px 120px rgba(255, 204, 0, 1);
    }
    100% {
      text-shadow: 
        0px 0px 30px rgba(255, 204, 0, 1),
        0px 0px 50px rgba(255, 204, 0, 1),
        0px 0px 80px rgba(255, 204, 0, 1);
    }
  }
`;

const IconsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
      transform: rotate(15deg); /* Slight rotation effect */
      color: #dc3545; /* Red color for Wishlist */
    }
  }

  a {
    color: white;
    text-decoration: none;
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
      transform: rotate(-15deg); /* Slight rotation effect */
      color: #ffcc00; /* Unique hover color */
    }
  }
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(204, 204, 204, 0.8);
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
`;

const NavItems = styled.div`
  display: flex;
  justify-content: space-evenly ;
  flex: 1;
  gap: 20px;
  font-size: 1rem;
  font-weight: bold;
  color: darkslategrey;

  a {
    text-decoration: none;
    color: darkslategrey;
    padding: 5px 10px;
    transition: color 0.3s ease;

    &:hover {
      color: white;
      background-color: #007bff;
      border-radius: 5px;
    }
  }
`;

const NavItem = styled.div`
  position: relative;
  font-size: 1rem;
  font-weight: bold;
  color: darkslategrey;
  cursor: pointer;

  a {
    text-decoration: none;
    color: darkslategrey;
    padding: 5px 10px;
    transition: color 0.3s ease, background-color 0.3s ease;

    &:hover {
      color: white;
      background-color: #007bff;
      border-radius: 5px;
    }
  }

  &:hover > ul {
    display: block;
  }
`;

const NavItemWithArrow = styled(NavItem)`
  &::after {
    content: "▼";
    font-size: 0.8rem;
    margin-left: 5px;
    color: darkslategrey;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: rotate(180deg);
    color: white;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 40px;
  left: 0;
  background-color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  z-index: 1000;
  width: 300px;
  opacity: 0;  // Initially hidden
  visibility: hidden;  // Ensure it’s completely invisible
  transition: opacity 0.3s ease, visibility 0s linear 0.3s; // Add transition for smooth fade-in/out

  ${NavItemWithArrow}:hover & {
    opacity: 1; // Make it fully visible
    visibility: visible; // Make it visible
    transition: opacity 0.3s ease; // Fade-in effect when hovered
  }

  li {
    margin: 10px 0;
    padding: 10px;
    font-size: 1rem;
    color: darkslategrey;
    cursor: pointer;

    &:hover {
      background-color: #007bff;
      border-radius: 5px;
    }

    a {
      text-decoration: none;
      color: darkslategrey;

      &:hover {
        color: #f5f5f5;
      }
    }
  }
`;


const DropdownItem = styled.li`
  padding: 5px 10px;
`;

const FooterContainer = styled.div`
  background-color: #007bff;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  position: relative;
`;

const FooterLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
`;

const FooterLeft = styled.div`
  font-size: 1em;
  font-weight: normal;
  text-align: left;
`;

const FooterLogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FooterLogo = styled.h1`
  font-size: 1.8em;
  font-weight: bold;
  margin: 0 0 10px 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FooterLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1em;
  transition: color 0.3s ease;

  &:hover {
    color: #e0e0e0;
  }
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: white;
`;
