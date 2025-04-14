import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  message
} from 'antd';
import axios from 'axios';

const { Option } = Select;

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      message.success('Product deleted');
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error('Failed to delete product');
    }
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, values);
        message.success('Product updated');
      } else {
        await axios.post('http://localhost:5000/api/products', values);
        message.success('Product added');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error('Submit failed');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Price', dataIndex: 'price' },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
  <div className="mx-auto max-w-7xl">
    {/* Page Header */}
    <h1 className="mb-6 font-bold text-gray-800 text-3xl text-center">
      Admin Panel - Product Management
    </h1>

    {/* Add Product Button */}
    <div className="flex justify-end mb-4">
      <Button
        type="primary"
        onClick={handleAdd}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold text-white"
      >
        Add Product
      </Button>
    </div>

    {/* Product Table */}
    <div className="bg-white shadow-md p-4 rounded-lg">
      <Table
        rowKey="_id"
        dataSource={products}
        columns={columns}
        pagination={{ pageSize: 5 }}
        className="w-full"
      />
    </div>

    {/* Modal */}
    <Modal
      title={
        <span className="font-semibold text-gray-800 text-lg">
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </span>
      }
      visible={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={handleFormSubmit}
      okText={editingProduct ? 'Update' : 'Create'}
      className="rounded-lg"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter the product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select category">
            <Option value="electronics">Electronics</Option>
            <Option value="clothing">Clothing</Option>
            <Option value="books">Books</Option>
            <Option value="home">Home</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter the price' }]}
        >
          <InputNumber
            placeholder="Enter price"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea
            rows={4}
            placeholder="Enter product description"
          />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</div>
  );
};

export default AdminPage;
