import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';

// Styled Components
const ProductsContainer = styled.div`
  
  padding: 20px;
`;

const Table = styled.table`
  
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  color: #495057;
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: left;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  color: #343a40;
`;

const AddProductButton = styled(Button)`
  margin-bottom: 10px;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f1f3f5;
  }
`;

const ModalContent = styled.div`
  padding: 20px;
`;

const StyledModalHeader = styled(Modal.Header)`
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const StyledModalTitle = styled(Modal.Title)`
  font-size: 18px;
  color: #343a40;
`;

const ModalFooterButton = styled(Button)`
  margin-left: 10px;
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    ProductID: '',
    Title: '',
    Model: '',
    Description: '',
    Stock: '',
    CategoryID: '',
    Manufacturer: '',
    Features: '',
    Price: '',
    ImageURL: '',
    Rating: '',
    Dimensions: '',
    StockStatus: true,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Fetch products and categories when component mounts
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    // Validation logic for enabling the submit button
    const isValid =
      newProduct.Title.trim() !== '' &&
      newProduct.Stock !== '' &&
      newProduct.CategoryID !== '' &&
      newProduct.Price !== '' &&
      newProduct.StockStatus !== null;

    setIsFormValid(isValid);
  }, [newProduct]);

  const handleAddOrEditProduct = async () => {
    if (newProduct.ProductID) {
      // Editing an existing product
      try {
        await axios.put(`http://localhost:3001/api/admin/products/${newProduct.ProductID}`, newProduct);
        setProducts((prev) =>
          prev.map((product) =>
            product.ProductID === newProduct.ProductID ? newProduct : product
          )
        );
        console.log('Product updated successfully.');
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update the product. Please try again.');
      }
    } else {
      // Adding a new product
      try {
        const response = await axios.post('http://localhost:3001/api/admin/products', newProduct);
        setProducts((prev) => [...prev, response.data]);
        console.log('Product added successfully.');
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add the product. Please try again.');
      }
    }

    // Reset the form and close the modal
    resetForm();
    setShowModal(false);
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/admin/products/${id}`);
        setProducts((prev) => prev.filter((product) => product.ProductID !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete the product. Please try again.');
      }
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      ProductID: product.ProductID,
      Title: product.Title || '',
      Model: product.Model || '',
      Description: product.Description || '',
      Stock: product.Stock || '',
      CategoryID: product.CategoryID || '',
      Manufacturer: product.Manufacturer || '',
      Features: product.Features || '',
      Price: product.Price || '',
      ImageURL: product.ImageURL || '',
      Rating: product.Rating || '',
      Dimensions: product.Dimensions || '',
      StockStatus: product.StockStatus || true,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setNewProduct({
      ProductID: '',
      Title: '',
      Model: '',
      Description: '',
      Stock: '',
      CategoryID: '',
      Manufacturer: '',
      Features: '',
      Price: '',
      ImageURL: '',
      Rating: '',
      Dimensions: '',
      StockStatus: true,
    });
  };

  return (
    <ProductsContainer>
      <h1>Products</h1>
      {/* Add Product Button */}
      <AddProductButton
        variant="primary"
        onClick={() => {
          resetForm(); // Reset form to ensure no pre-filled values
          setShowModal(true);
        }}
      >
        + Add Product
      </AddProductButton>

      {/* Product Table */}
      <Table className="mt-3">
        <thead>
          <tr>
            <TableHeader>ProductID</TableHeader>
            <TableHeader>Title</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Stock</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <TableRow key={product.ProductID}>
              <TableCell>{product.ProductID}</TableCell>
              <TableCell>{product.Title}</TableCell>
              <TableCell>
                {categories.find((category) => category.CategoryID === product.CategoryID)
                  ?.Title || 'Unknown Category'}
              </TableCell>
              <TableCell>{product.Price}</TableCell>
              <TableCell>{product.Stock}</TableCell>
              <TableCell>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteProduct(product.ProductID)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <StyledModalHeader  closeButton>
          <StyledModalTitle>
            {newProduct.ProductID ? 'Edit Product' : 'Add New Product'}
          </StyledModalTitle>
        </StyledModalHeader>
        <Modal.Body>
          <ModalContent>
            <Form>
                <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter product title"
                    value={newProduct.Title}
                    onChange={(e) => setNewProduct({ ...newProduct, Title: e.target.value })}
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Model</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter model"
                    value={newProduct.Model}
                    onChange={(e) => setNewProduct({ ...newProduct, Model: e.target.value })}
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="Enter description"
                    value={newProduct.Description}
                    onChange={(e) =>
                    setNewProduct({ ...newProduct, Description: e.target.value })
                    }
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                    value={newProduct.CategoryID || ''}
                    onChange={(e) =>
                    setNewProduct({ ...newProduct, CategoryID: parseInt(e.target.value) })
                    }
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                    <option key={category.CategoryID} value={category.CategoryID}>
                        {category.Title}
                    </option>
                    ))}
                </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={newProduct.Price}
                    onChange={(e) => setNewProduct({ ...newProduct, Price: e.target.value })}
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter stock quantity"
                    value={newProduct.Stock}
                    onChange={(e) => setNewProduct({ ...newProduct, Stock: e.target.value })}
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Manufacturer</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter manufacturer"
                    value={newProduct.Manufacturer}
                    onChange={(e) =>
                    setNewProduct({ ...newProduct, Manufacturer: e.target.value })
                    }
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Features</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter features"
                    value={newProduct.Features}
                    onChange={(e) => setNewProduct({ ...newProduct, Features: e.target.value })}
                />
                </Form.Group>
                
                <Form.Group className="mb-3">
                <Form.Label>Dimensions</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter dimensions"
                    value={newProduct.Dimensions}
                    onChange={(e) => setNewProduct({ ...newProduct, Dimensions: e.target.value })}
                />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="In Stock"
                        checked={newProduct.StockStatus}
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, StockStatus: e.target.checked })
                        }
                    />
                </Form.Group>
            </Form>
          </ModalContent>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <ModalFooterButton
            variant="primary"
            onClick={handleAddOrEditProduct}
            disabled={!isFormValid}
          >
            {newProduct.ProductID ? 'Update Product' : 'Add Product'}
          </ModalFooterButton>
        </Modal.Footer>
      </Modal>
    </ProductsContainer>
  );
};

export default Products;
