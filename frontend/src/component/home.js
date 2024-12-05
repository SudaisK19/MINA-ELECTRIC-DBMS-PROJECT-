import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  // Simulate API fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with your API calls
        const fetchedFeaturedProducts = [
          { id: 1, image: "/assets/streetlight6.jpg", title: "Street Light" },
          { id: 2, image: "/assets/ledbulb4.jpg", title: "LED Bulb" },
          { id: 3, image: "/assets/floodlight6.jpg", title: "Flood Light" },
        ];
        const fetchedBestSellingProducts = [
          { id: 1, image: "/assets/solarlight2.jpg", title: "Solar Light" },
          { id: 2, image: "/assets/panellight1.jpg", title: "Panel Light" },
          { id: 3, image: "/assets/streetlight2.jpg", title: "Street Light" },
        ];
        setFeaturedProducts(fetchedFeaturedProducts);
        setBestSellingProducts(fetchedBestSellingProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const bannerItems = [
    { type: "video", src: "/assets/banner1.mp4" },
    { type: "image", src: "/assets/banner2.png" },
    { type: "image", src: "/assets/banner3.png" },
    { type: "image", src: "/assets/banner4.jpg" },
  ];

  const renderBannerItems = () =>
    bannerItems.map((item, index) => (
      <div key={index}>
        {item.type === "video" ? (
          <VideoBanner autoPlay loop muted>
            <source src={item.src} type="video/mp4" />
            Your browser does not support the video tag.
          </VideoBanner>
        ) : (
          <BannerImage src={item.src} alt={`Banner ${index + 1}`} />
        )}
      </div>
    ));

  const renderProductCards = (products) => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return <p>No products available</p>; // Show a placeholder if products are empty
    }
    return products.map((product) => (
      <ProductCard key={product.id}>
        <ProductImage src={product.image} alt={product.title} />
        <ProductTitle>{product.title}</ProductTitle>
      </ProductCard>
    ));
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
  };

  return (
    <PageContainer>
      <HomePageContainer>
        {/* Banner Slider */}
        <BannerSection>
          <StyledSlider {...sliderSettings}>{renderBannerItems()}</StyledSlider>
        </BannerSection>

        {/* Featured Products Section */}
        <ProductsGrid>
          <Heading>Featured Products</Heading>
          {renderProductCards(featuredProducts)}
        </ProductsGrid>

        {/* Best Selling Products Section */}
        <ProductsGrid>
          <Heading>Best Selling Products</Heading>
          {renderProductCards(bestSellingProducts)}
        </ProductsGrid>

        <MapSection>
          <MapContainer>
            <iframe
              title="Google Map showing our location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d905.0753187933582!2d67.00434386957429!3d24.853557848620895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e0479a862eb%3A0x44c8074b4d2cbfa6!2sDenso%20Hall%2C%20Market%20Quarter%2C%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1733029461371!5m2!1sen!2s"
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            />
          </MapContainer>
        </MapSection>
      </HomePageContainer>
    </PageContainer>
  );
};

export default HomePage;

// Styled Components
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const PageContainer = styled.div`
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: 96vw;
  margin: 0 auto;
`;

const BannerSection = styled.div`
  width: 99%;
  height: 400px;
  overflow: hidden;
  border-radius:10px;
  position: relative;

`;

const StyledSlider = styled(Slider)`
  .slick-dots li button:before {
    color: #007bff;
  }
`;

const CustomArrow = ({ className, style, onClick, direction }) => (
  <Arrow
    className={className}
    style={{ ...style }}
    onClick={onClick}
    direction={direction}
  />
);

const Arrow = styled.div`
  z-index: 2;
  font-size: 2rem;
  color: #007bff;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.direction === "right" ? "right: 10px;" : "left: 10px;")}
`;

const BannerImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const VideoBanner = styled.video`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 products in a row */
  gap: 5px; /* Reduced gap between items */
  justify-items: center;
  text-align: center;

  /* Center the heading and products */
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* 2 products in a row on tablets */
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* 1 product per row on small screens */
  }
`;

const Heading = styled.h2`
  font-size: 1.8rem;
  color: black;
  margin-bottom: 20px; /* Space between heading and products */
  text-align: center;
  grid-column: span 3; /* Make sure heading spans the full width of the grid */
`;

const ProductCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  max-width: 300px;
  width: 100%; /* Make the card width dynamic */
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ProductTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
`;
const MapSection = styled.section`
  margin-top: 50px;
  padding: 20px;
  background-color: transparent;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;  /* You can adjust the height to your preference */
  border-radius: 10px;
  overflow: hidden;
`;
