/*import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../styles/Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        Title: '',
    });

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch categories from backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data); // Set data from API
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Handle Add or Edit Category
    const handleAddCategory = async () => {
        try {
            if (newCategory.CategoryID) {
                // Edit existing category
                await axios.put(
                    `http://localhost:5000/api/categories/${newCategory.CategoryID}`,
                    { Title: newCategory.Title }
                );
                console.log('Category updated successfully');
            } else {
                // Add new category
                await axios.post('http://localhost:5000/api/categories', {
                    Title: newCategory.Title,
                });
                console.log('Category added successfully');
            }
            fetchCategories(); // Refresh categories list
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save the category. Please try again.');
        }
    };

    // Handle Delete Category
    const handleDeleteCategory = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/categories/${id}`);
                fetchCategories(); // Refresh categories list
                console.log(`Deleted category with ID: ${id}`);
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete the category. Please try again.');
            }
        }
    };

    // Handle Edit Category
    const handleEditCategory = (category) => {
        setNewCategory({ ...category });
        setShowModal(true);
    };

    // Reset Form
    const resetForm = () => {
        setNewCategory({
            Title: '',
        });
    };

    return (
        <div className="categories">
            <h1>Categories</h1>
            {/* Add Category Button }
            <Button
                variant="primary"
                onClick={() => {
                    resetForm(); // Reset form for new category
                    setShowModal(true);
                }}
            >
                + Add Category
            </Button>

            {/* Category Table }
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>CategoryID</th>
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={category.CategoryID}>
                            <td>{category.CategoryID}</td>
                            <td>{category.Title}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleEditCategory(category)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteCategory(category.CategoryID)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add/Edit Category Modal }
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {newCategory.CategoryID ? 'Edit Category' : 'Add New Category'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category name"
                                value={newCategory.Title || ''}
                                onChange={(e) =>
                                    setNewCategory({ ...newCategory, Title: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddCategory}>
                        {newCategory.CategoryID ? 'Update Category' : 'Add Category'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Categories;
*/

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';

// Styled components for Categories page
const CategoriesContainer = styled.div`
  padding: 20px;
`;

const AddCategoryButton = styled(Button)`
  margin-bottom: 10px;
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

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        Title: '',
    });

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch categories from backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/admin/categories');
            setCategories(response.data); // Set data from API
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Handle Add or Edit Category
    const handleAddCategory = async () => {
        try {
            if (newCategory.CategoryID) {
                // Edit existing category
                await axios.put(
                    `http://localhost:3001/api/admin/categories/${newCategory.CategoryID}`,
                    { Title: newCategory.Title }
                );
                console.log('Category updated successfully');
            } else {
                // Add new category
                await axios.post('http://localhost:3001/api/admin/categories', {
                    Title: newCategory.Title,
                });
                console.log('Category added successfully');
            }
            fetchCategories(); // Refresh categories list
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save the category. Please try again.');
        }
    };

    // Handle Delete Category
    const handleDeleteCategory = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3001/api/admin/categories/${id}`);
                fetchCategories(); // Refresh categories list
                console.log(`Deleted category with ID: ${id}`);
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete the category. Please try again.');
            }
        }
    };

    // Handle Edit Category
    const handleEditCategory = (category) => {
        setNewCategory({ ...category });
        setShowModal(true);
    };

    // Reset Form
    const resetForm = () => {
        setNewCategory({
            Title: '',
        });
    };

    return (
        <CategoriesContainer>
            <h1>Categories</h1>
            {/* Add Category Button */}
            <AddCategoryButton
                variant="primary"
                onClick={() => {
                    resetForm(); // Reset form for new category
                    setShowModal(true);
                }}
            >
                + Add Category
            </AddCategoryButton>

            {/* Category Table */}
            <Table className="mt-3">
                <thead>
                    <tr>
                        <TableHeader>CategoryID</TableHeader>
                        <TableHeader>Category Name</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <TableRow key={category.CategoryID}>
                            <TableCell>{category.CategoryID}</TableCell>
                            <TableCell>{category.Title}</TableCell>
                            <TableCell>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleEditCategory(category)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteCategory(category.CategoryID)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>

            {/* Add/Edit Category Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <StyledModalHeader closeButton>
                    <StyledModalTitle>
                        {newCategory.CategoryID ? 'Edit Category' : 'Add New Category'}
                    </StyledModalTitle>
                </StyledModalHeader>
                <Modal.Body>
                    <ModalContent>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Category Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter category name"
                                    value={newCategory.Title || ''}
                                    onChange={(e) =>
                                        setNewCategory({ ...newCategory, Title: e.target.value })
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
                    <ModalFooterButton variant="primary" onClick={handleAddCategory}>
                        {newCategory.CategoryID ? 'Update Category' : 'Add Category'}
                    </ModalFooterButton>
                </Modal.Footer>
            </Modal>
        </CategoriesContainer>
    );
};

export default Categories;
