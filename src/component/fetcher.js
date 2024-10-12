
const BASE_URL="http://localhost:3001";

export const fetcher = async (url) => {
let responseObject = { errorMessage : '' , data: [] };

    try{ 
    const response = await fetch(BASE_URL + url);
    //   .then(response => response.json())
    //   .then(data => {
    //     // console.log(data);
    //     // setCategories(data);
    //     return data;
    //   });
    if (!response.ok) {  // Check if the response is not OK (status code is not 2xx)
        throw new Error(`HTTP error! status: ${response.status}`);

      }
    const responseData = await response.json();
    
    responseObject.errorMessage = '';
    responseObject.data = responseData;
   
    }catch (err){
        responseObject.errorMessage = err.message; 
    }
    return responseObject;
}

export const getCategories = () => {
    return fetcher("/categories");
}

export const getProducts = id => {
        return fetcher("/products?catId=" + id);
}

export const getProductsByID = id => {
    return fetcher('/products/' + id);
}