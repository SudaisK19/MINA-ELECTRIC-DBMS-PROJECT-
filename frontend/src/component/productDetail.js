import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { CartContext } from "../contexts/cartContext";
import { WishlistContext } from "../contexts/wishlistContext";
import { FaShoppingBasket} from 'react-icons/fa';
const ProductDetail = () => {
  const [product, setProduct] = useState({ errorMessage: "", data: {} });
  const [reviews, setReviews] = useState([]); // State for reviews
  const [review, setReview] = useState({ rating: 0, comment: "" }); // State for review input
  const { addProducts } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { productId } = useParams();
  console.log('ProductID:', productId);

  useEffect(() => {
    // Fetch the product details by ID
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${productId}`);
        const data = await response.json();
        if (response.ok) {
          setProduct({ data }); // Set the product data if successful
        } else {
          setProduct({ errorMessage: data.message }); // Set error message if not found
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct({ errorMessage: "Failed to fetch product details." });
      }
    };

    // Fetch reviews for the product
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/reviews/${productId}`);
        const data = await response.json();
        if (!data.errorMessage) {
          setReviews(data); // Set the reviews if successful
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId]); // Trigger effect when productId changes

  // Handle Add to Basket
  const handleAddToBasket = async () => {
    try {
      // Use addProducts from CartContext
      await addProducts({ id: product.data.ProductID, quantity: 1 });
      alert(`Product "${product.data.Title}" added to basket!`);
    } catch (error) {
      console.error("Error adding to basket:", error);
      alert("An unexpected error occurred.");
    }
  };

  // Handle Add to Wishlist
  const handleAddToWishlist = () => {
    if (product.data) {
      addToWishlist({
        id: product.data.ProductID,
        title: product.data.Title,
        price: product.data.Price,
        image: product.data.ImageURL,
      });
      alert("Product added to wishlist!");
    }
  };

  // Handle Star Click for Review
  const handleStarClick = (value) => {
    setReview((prev) => ({ ...prev, rating: value }));
  };

  // Handle Comment Change for Review
  const handleCommentChange = (e) => {
    setReview((prev) => ({ ...prev, comment: e.target.value }));
  };

  // Handle Submit Review
  const handleSubmitReview = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({
          ProductID: productId,
          Rating: review.rating,
          ReviewText: review.comment,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setReview({ rating: 0, comment: "" });
        setReviews((prev) => [
          {
            CustomerID: "You",
            ProductID: productId,
            Rating: review.rating,
            ReviewText: review.comment,
            ReviewDate: new Date(),
          },
          ...prev,
        ]);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit the review.");
    }
  };

  // Process Features string into an array
  const featuresArray = product.data.Features ? product.data.Features.split(",") : [];

  return (
    <PageContainer>
<ProductDetailContainer>
        <ProductImage src={product.data.ImageURL || "/assets/default-image.jpg"} alt={product.data.Title} />
        <ProductDetails>
          <ProductTitle>{product.data.Title}</ProductTitle>
          <Manufacturer>Manufacturer: {product.data.Manufacturer || "N/A"}</Manufacturer>
          <ProductInfo>
            <ProductInfoHeader>Dimensions</ProductInfoHeader>
            <label>{product.data.Dimensions}</label>
          </ProductInfo>
          <ProductInfo>
            <ProductInfoHeader>Features</ProductInfoHeader>
            <ul>
              {featuresArray.map((feature, index) => (
                <ProductInfoListItem key={`feature${index}`}>{feature}</ProductInfoListItem>
              ))}
            </ul>
          </ProductInfo>
          <ProductDescription>
            <ProductInfoHeader>Description</ProductInfoHeader>
            <p>{product.data.Description || "No description available."}</p>
          </ProductDescription>
          <ProductPrice>₨: {product.data.Price}</ProductPrice>
          <ProductRating>Rating: {product.data.Rating || "N/A"} / 5</ProductRating>
          <ProductStock>
            {product.data.StockStatus ? (
              <>
                <StockLabel stockStatus={true}>In Stock</StockLabel>
                <FreeDeliveryText>FREE Delivery</FreeDeliveryText>
              </>
            ) : (
              <StockLabel stockStatus={false}>Out of Stock</StockLabel>
            )}
          </ProductStock>
          <ProductActions>
            <AddToBasketButton onClick={handleAddToBasket}>
              <FaShoppingBasket /> Add to Basket
            </AddToBasketButton>
            <AddToWishlistButton onClick={handleAddToWishlist}>
              <span role="img" aria-label="Heart Emoji">❤️</span> Add to Wishlist
            </AddToWishlistButton>
          </ProductActions>
        </ProductDetails>
      </ProductDetailContainer>
      {/* Add Review Section */}
      <ReviewAndRatingWrapper>
        <h1>Leave a Review</h1>
        <h2>How was your experience with this product?</h2>

        <RatingContainer>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`fa fa-star ${review.rating >= value ? "active" : ""}`}
              title={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => handleStarClick(value)}
            />
          ))}
        </RatingContainer>

        <FeedbackInput
          type="text"
          placeholder="Write your review here..."
          value={review.comment}
          onChange={handleCommentChange}
        />

        <SubmitButton
          onClick={handleSubmitReview}
          disabled={!review.rating || !review.comment.trim()}
        >
          Submit Review
        </SubmitButton>
      </ReviewAndRatingWrapper>

      {/* Display Reviews */}
      <ReviewsListWrapper>
        <h2>Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem key={review.ReviewID}>
              <ReviewerName>Customer ID: {review.CustomerID}</ReviewerName>
              <ReviewRating>Rating: {review.Rating} / 5</ReviewRating>
              <ReviewDate>Date: {new Date(review.ReviewDate).toLocaleDateString()}</ReviewDate>
              <ReviewText>{review.ReviewText}</ReviewText>
            </ReviewItem>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </ReviewsListWrapper>
    </PageContainer>
  );
};

export default ProductDetail;


const AddToWishlistButton = styled.button`
  background-color: #d3d3d3; /* Mid grey background color */
  color: #000; /* Black text color */
  height: 40px;
  border-radius: 8px;
    width: 200px; /* Increased width for a more prominent button */
  font-weight: normal; /* Non-bold text */
  border: 1px solid #d3d3d3; /* Thin border with the same grey color */
  cursor: pointer;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Space between icon and text */
  transition: background-color 0.3s ease, border-color 0.3s ease; /* Smooth border color transition */
  white-space: normal; /* Allow text wrapping inside button */
  
  &:hover {
    background-color: #c0c0c0; /* Slightly darker grey when hovered */
    border-color: #c0c0c0; /* Darker grey border on hover */
  }

  &:focus {
    outline: none;
  }
  
  /* Make the button take full width when it's the last one */
  grid-column: span 2; /* Span both columns (full width) */
`;


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95vw; /* Use percentage to prevent overflow */
   padding-left: 15px;
  margin: 0;
  box-sizing: border-box; /* Ensures padding doesn't add extra width */
  overflow-x: hidden; /* Prevent horizontal scrollbars */
`;
const ProductDetailContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 20px;
  box-sizing: border-box; /* Ensures padding doesn't cause overflow */
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 48%; /* Ensure both sections fit without exceeding 100% */
  max-width: 100%; /* Prevent image from exceeding container width */
  border-radius: 8px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  width: 48%; /* Matches the image width */
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.9rem; /* Reduced font size for compact layout */
`;

const ProductTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Manufacturer = styled.p`
  font-size: 1rem;
  font-weight: normal;
`;

const ProductInfo = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
`;
const StockLabel = styled.span`
  font-size: 0.9rem;
  color: ${(props) => (props.stockStatus ? 'green' : 'red')}; /* Green for in-stock, Red for out-of-stock */
  font-weight: bold;
`;

const FreeDeliveryText = styled.strong`
  color: green; /* Make it green */
  font-weight: bold;
  animation: pop-shake 2s infinite; /* Apply the pop-shake effect every 2 seconds */
  
  /* Pop-up shaking animation */
  @keyframes pop-shake {
    0% {
      transform: scale(1) translateY(0);
    }
    25% {
      transform: scale(1.1) translateY(-5px); /* Slightly enlarge and move up */
    }
    50% {
      transform: scale(0.9) translateY(5px);  /* Slightly shrink and move down */
    }
    75% {
      transform: scale(1.1) translateY(-5px); /* Slightly enlarge and move up again */
    }
    100% {
      transform: scale(1) translateY(0); /* Reset to original position and size */
    }
  }
`;

const ProductInfoHeader = styled.h3`
  font-size: 1rem;
  font-weight: bold;
`;

const ProductInfoListItem = styled.li`
  list-style-type: disc;
  margin-left: 20px;
`;

const ProductDescription = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  p {
    margin: 5px 0;
  }
`;

const ProductPrice = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  color: #e60000;
`;

const ProductRating = styled.p`
  font-size: 1rem;
`;

const ProductStock = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-top: 10px;
`;




const ProductActions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;
const AddToBasketButton = styled.button`
  background-color: #007bff; /* Blue color */
  color: #fff;
  height: 40px;
    width: 200px; /* Increased width for a more prominent button */
  border-radius: 8px;
  font-weight: normal; /* Non-bold text */
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Space between icon and text */
  transition: background-color 0.3s ease;
  white-space: normal; /* Allow text wrapping inside button */
  
  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

// Reviews Section Styling
const ReviewAndRatingWrapper = styled.div`
  margin-top: 20px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
`;

const ReviewsListWrapper = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ReviewItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

const ReviewerName = styled.h4`
  margin: 0;
  color: #007bff;
`;

const ReviewRating = styled.p`
  margin: 5px 0;
  font-weight: bold;
  color: #555;
`;

const ReviewDate = styled.p`
  margin: 5px 0;
  color: #777;
`;

const ReviewText = styled.p`
  margin: 5px 0;
  color: #333;
  font-style: italic;
`;
const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
`;

const Star = styled.i`
  font-size: 2rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s;

  &:hover,
  &.active {
    color: #007bff;
  }
`;

const FeedbackInput = styled.textarea`
  width: 100%;
  height: 100px;
  margin: 15px 0;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    background-color: #3e8e41;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
