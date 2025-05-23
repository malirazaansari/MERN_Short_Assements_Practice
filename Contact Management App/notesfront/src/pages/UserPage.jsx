import React, { useEffect, useState } from 'react';
import { Input, List, message } from 'antd';
import axios from 'axios';

const { Search } = Input;

const UserPage = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load contacts');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        📒 Contact List
      </h1>
      <Search
        placeholder="Search by name"
        allowClear
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <List
        bordered
        dataSource={filteredContacts}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.name}
              description={`Email: ${item.email} | Phone: ${item.phone}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default UserPage;
