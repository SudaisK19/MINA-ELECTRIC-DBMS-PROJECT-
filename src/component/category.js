import React from 'react';

import { useParams } from 'react-router-dom';

import { getProducts } from './fetcher';

import CategoryProduct from './categoryProduct';

const Category = ({ id, title, onCategoryClick }) => {

  const [products, setProducts] = useState({ errorMessage: "", data: [] });

  const { categoryId } = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      const responseObject = await getProducts(categoryId);
      setProducts(responseObject);
    }

    fetchData();
  }, [categoryId]);

  const renderProducts = () => {
    return products.data.map(p => <CategoryProduct key={p.id} {...p}>{p.title}</CategoryProduct>);
    // <div key={c.id} id={c.id} title ={c.title} onCategoryClick={() => handleCategoryClick(c.id)}/>
    // spread opearotr is ...



  }

  return (
    // <div key={id} onClick={ () => onCategoryClick(id) }>{title}</div>
    <div>
      <h1>Products</h1>
      {products.errorMessage && <div>Error: {products.errorMessage}</div>}
      {
        products && renderProducts()
      }

    </div>
  )
};

export default Category;