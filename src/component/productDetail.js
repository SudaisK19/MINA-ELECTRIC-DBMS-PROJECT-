

import React from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByID } from './fetcher';
import { useState } from 'react';
import styled from 'styled-components';


const ProductDetail = () => {
  const [products, setProducts] = useState({ errorMessage: '', data: {} });
  const { productId } = useParams();  // This matches with the route parameter

  React.useEffect(() => {
    const fetchData = async () => {
      const responseObject = await getProductsByID(productId);
      setProducts(responseObject);
    };
    fetchData();
  }, [productId]);

  return (
    <article>
      <ProductTitle>
        {products.data.title}
      </ProductTitle>
      <figure>
        <ProductImageContainer>
          <ProductImageContainerImage src={`./assets/${products.data.image}`} alt={products.data.title}/>
        </ProductImageContainer>
      </figure>
      <aside>
        <ProductInfo>
          <ProductInfoHeader>Dimensions</ProductInfoHeader>
          <label>{products.data.dimensions}</label>
        </ProductInfo>

        <ProductInfo>
          <ProductInfoHeader>Features</ProductInfoHeader>
          <ul>
            {products.data.features?.map((f, index) => {
              return <ProductInfoListItem key={`feature${index}`}>{f}</ProductInfoListItem>;
            })}
          </ul>
        </ProductInfo>
      </aside>

      <aside >
        <ProductInfoFinancePrice>
          ₨:{products.data.price}
        </ProductInfoFinancePrice>
        <ProductInfoFinanceStock>
          <ProductInfoFinanceStockLabel>Stock Level: {products.data.stock}</ProductInfoFinanceStockLabel>
          <ProductInfoFinanceStockLabel>FREE Delivery</ProductInfoFinanceStockLabel>
        </ProductInfoFinanceStock>
        <ProductInfoAction>
          <ProductInfoActionButton>Add to Basket</ProductInfoActionButton>
        </ProductInfoAction>
      </aside>

      {/* Correctly accessing the product description */}
      <ProductDescription>{products.data?.description}</ProductDescription>
    </article>
  );
};

export default ProductDetail;


//component CSS
const ProductDescription = styled.div`
grid-column: 1 / span 3;
`;

const ProductTitle = styled.div`
  grid-column: 1 / span 3;
  color: darkslateblue;
  font-weight: bold;
  font-size: 1.5em;
  padding-left: 10px;
`;
const ProductImageContainer = styled.div`
 padding: 10px;
  width: 100%; 
`;
const ProductImageContainerImage = styled.img`
  width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease;
  &:hover {
   transform: scale(1.05);
  }
  `;
const ProductInfo= styled.div`
   display: flex;
  flex-direction: column;
`;

const ProductInfoHeader= styled.h3`
   color: darkslateblue;
  font-size: 1em;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 5px;
`;

const ProductInfoListItem= styled.li`
padding-top: 5px;
`;

const ProductInfoFinancePrice= styled.div`
padding-top: 5px;
`;
/* Full width within grid item */
/* Center content vertically */
const ProductInfoFinanceStock= styled.div`
padding-left: 10px;
  margin-top: 20px; 
  padding-top: 10px;
  background-color: lightblue;
  height: 20%;
  width: 100%; 
  border-radius: 5px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center; 
`;

const ProductInfoFinanceStockLabel= styled.label`
padding-bottom: 5px;
`;
/* Center buttons horizontally */
const ProductInfoAction= styled.div`
 display: flex;
  flex-direction: column;
  align-items: center; 
`;

const ProductInfoActionButton= styled.button`
 margin-top: 20px;
  background-color: ${props => props.secondary ? 'darkblue' : 'var(--accent-color)'};
  color: ${props => props.secondary ? 'white' : 'inherit'};
  height: 40px;
  width: 180px;
  border-radius: 12px;
  font-weight: bold;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.secondary ? '#001f4d' : '#45a049'};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-3px);
  }

  &:focus {
    outline: none;
  }
`;