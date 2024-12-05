const BASE_URL = "http://localhost:3001/api"; // Updated to include /api
export const fetcher = async (url) => {
  try { 
      const response = await fetch(BASE_URL + url, {
          credentials: 'include', // Include cookies for session-based auth if needed
      });
      if (!response.ok) {  
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { errorMessage: '', data: await response.json() };
 
  } catch (err) {
      return { errorMessage: err.message, data: [] }; 
  }
}

export const getCategories = () => {
  return fetcher("/categories"); // Now calls /api/categories
}

// export const getProducts = (catId) => {
//   if (catId) {
//     return fetcher(`/products/${catId}`); // Calls /api/products/:catId
//   }
//   return fetcher(`/products`); // Calls /api/products
// };
// export const getProductsByID = (id) => {
//   console.log(id); // Ensure id is not undefined
//   return fetcher(`/products/${id}`);
// }


export const getProductsByQuery = async (query) => {
  if (!query) {
      return { errorMessage: 'No query provided', data: [] }; // Reflects an error if no query is provided
  }

  try {
      const response = await fetcher(`/products?query=${encodeURIComponent(query)}`); // Consider server-side filtering
      return response;
  } catch (error) {
      return { errorMessage: error.message, data: [] };
  }
};
