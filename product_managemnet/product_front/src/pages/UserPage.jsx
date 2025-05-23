import React, { useEffect, useState } from 'react';
import {
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  Card,
  Pagination,
  Spin,
  message,
  Modal,
  Button,
} from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Search } = Input;

const UserPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setFilteredProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch products:', err); // DEBUG
      message.error('Failed to load products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= minPrice &&
        product.price <= maxPrice
    );

    setFilteredProducts(filtered);
    setPage(1);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, products]);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
  <h1 className="mb-8 font-bold text-gray-800 text-3xl text-center">
    🛍 Product Store
  </h1>

  {/* Filters */}
  <div className="bg-white shadow-md mb-8 p-6 rounded-lg">
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      <div>
        <Search
          placeholder="Search by product name"
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Select
          placeholder="Filter by category"
          allowClear
          onChange={(value) => setSelectedCategory(value)}
          className="w-full"
        >
          <Option value="electronics">Electronics</Option>
          <Option value="clothing">Clothing</Option>
          <Option value="books">Books</Option>
          <Option value="home">Home</Option>
        </Select>
      </div>
      <div>
        <InputNumber
          placeholder="Min Price"
          className="w-full"
          min={0}
          value={minPrice}
          onChange={(val) => setMinPrice(val || 0)}
        />
      </div>
      <div>
        <InputNumber
          placeholder="Max Price"
          className="w-full"
          min={0}
          value={maxPrice}
          onChange={(val) => setMaxPrice(val || 100000)}
        />
      </div>
    </div>
  </div>

  {/* Product List */}
  {loading ? (
    <div className="flex justify-center items-center">
      <Spin size="large" />
    </div>
  ) : (
    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {paginatedProducts.length === 0 ? (
        <p className="col-span-full text-gray-500 text-center">
          No products found
        </p>
      ) : (
        paginatedProducts.map((product) => (
          <div
            key={product._id}
            className="flex flex-col justify-between bg-white shadow-md p-4 rounded-lg"
          >
            <h2 className="font-semibold text-gray-800 text-lg">
              {product.name}
            </h2>
            <p className="text-gray-600 text-sm">
              <strong>Category:</strong> {product.category}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Price:</strong> ${product.price}
            </p>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <Button
              type="link"
              className="mt-4 text-blue-500"
              onClick={() => showModal(product)}
            >
              View Details
            </Button>
          </div>
        ))
      )}
    </div>
  )}

  {/* Pagination */}
  <div className="flex justify-center mt-8">
    <Pagination
      current={page}
      pageSize={pageSize}
      total={filteredProducts.length}
      onChange={(newPage) => setPage(newPage)}
    />
  </div>

  {/* Modal */}
  <Modal
    title={
      <span className="font-semibold text-gray-800 text-lg">
        {selectedProduct?.name || 'Product Details'}
      </span>
    }
    visible={isModalVisible}
    onOk={handleOk}
    onCancel={handleCancel}
    footer={[
      <Button key="cancel" onClick={handleCancel}>
        Close
      </Button>,
    ]}
  >
    {selectedProduct && (
      <div className="text-gray-700">
        <p>
          <strong>Category:</strong> {selectedProduct.category}
        </p>
        <p>
          <strong>Price:</strong> ${selectedProduct.price}
        </p>
        <p>
          <strong>Description:</strong> {selectedProduct.description}
        </p>
      </div>
    )}
  </Modal>
</div>
  );
};

export default UserPage;
