
import './App.css';
import React, { useState } from 'react';
// import Category from './category';

import { getCategories, getProducts } from './fetcher';

import { Link } from 'react-router-dom';

function App() {
  //hook statement used to change the state
  const [categories, setCategories] = useState({ errorMessage: '', data: [] });
 const [products, setProducts] = useState({ errorMessage: '', data: [] });



  //using for mount ----fetching api
  React.useEffect(() => {
    const fetchData = async () => {

      const responseObject = await getCategories();
      setCategories(responseObject);
    }
    fetchData();

  }, []


  )

  const handleCategoryClick = id => {
    // alert('id:' +id);
    // console.log("Category clicked:", id);
    const fetchData = async () => {

      const responseObject = await getProducts(id);
      setProducts(responseObject);
    }
    fetchData();




    //   fetch("http://localhost:3001/products?catId=" + id)
    // .then(response => response.json())
    // .then(data => {
    //   console.log(data);
    //   setProducts(data);
    // })

  }

  const renderCategory = () => {
    return categories.data.map(c =>
      <li key={c.id}>
        <Link to={`/categories/${c.id}`}>{c.title}</Link>
      </li>
      // <Category key={c.id} id={c.id} title ={c.title} onCategoryClick={() => handleCategoryClick(c.id)}/>
    );


  }


  return (
    <React.Fragment>
      <header>Mina Electric</header>


      <section>
        <nav>

          {categories.errorMessage && <div>Error: {categories.errorMessage}</div>}
          <ul>
            {categories.data && renderCategory()}
          </ul>

        </nav>
        <main>

        </main>
      </section>


      <footer>
        footer
      </footer>

    </React.Fragment>
  );
}


export default App;


