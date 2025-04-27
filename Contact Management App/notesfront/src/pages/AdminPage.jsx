import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Modal, message } from 'antd';
import axios from 'axios';

const AdminPage = () => {
  const [contacts, setContacts] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    const res = await axios.get('http://localhost:5000/api/contacts');
    setContacts(res.data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('http://localhost:5000/api/contacts', values);
      message.success('Contact added');
      setIsModalOpen(false);
      form.resetFields();
      fetchContacts();
    } catch (error) {
      console.error(error);
      message.error('Failed to add contact');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/contacts/${id}`);
    message.success('Contact deleted');
    fetchContacts();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    {
      title: 'Action',
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      )
    }
  ];

  return (
    <div className="p-6">
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Admin - Manage Contacts
      </h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: '20px' }}>
        Add Contact
      </Button>

      <Table rowKey="_id" dataSource={contacts} columns={columns} />

      <Modal
        title="Add Contact"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddContact}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
