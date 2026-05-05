import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaUser, FaCalendar, FaTrash, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { Alert, LoadingSpinner, Button } from '../components/common';

const API_BASE_URL = 'http://localhost:5000/api/contact';
const STATUS_OPTIONS = ['all', 'new', 'replied', 'resolved'];
const STATUS_COLORS = {
  new: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800'
};


const getAuthConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});


const StatusButton = ({ status, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition ${isActive
        ? 'bg-teal-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </button>
);

const ContactInfo = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 text-gray-700 mb-2">
    <Icon className="text-teal-600" />
    <span className={label === 'name' ? 'font-semibold' : ''}>{value}</span>
  </div>
);

const StatusSelect = ({ value, onChange, onError }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      onChange(newStatus);
    } catch (err) {
      onError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={isUpdating}
      className={`px-3 py-1 rounded-md font-medium transition ${STATUS_COLORS[value]
        } disabled:opacity-50`}
    >
      <option value="new">New</option>
      <option value="replied">Replied</option>
      <option value="resolved">Resolved</option>
    </select>
  );
};

const ContactCard = ({ contact, onStatusChange, onDelete }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div>
        <ContactInfo icon={FaUser} label="name" value={contact.name} />
        <ContactInfo icon={FaEnvelope} label="email" value={contact.email} />
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <FaCalendar className="text-teal-600" />
          <span>{new Date(contact.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <StatusSelect
          value={contact.status}
          onChange={(newStatus) => onStatusChange(contact._id, newStatus)}
          onError={(err) => console.error('Error updating status:', err)}
        />
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(contact._id)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <FaTrash /> Delete
        </Button>
      </div>
    </div>
    <div className="bg-gray-50 p-4 rounded">
      <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
    </div>
  </div>
);

const EmptyState = ({ loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <p className="text-center text-gray-600 py-12">No contacts found</p>
  );
};

const UnauthorizedState = () => (
  <div className="max-w-6xl mx-auto px-6 py-12">
    <p className="text-center text-gray-600">Please login to view contacts</p>
  </div>
);


function ContactsManagement() {
  const { user, token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_BASE_URL, getAuthConfig(token));
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch contacts';
      setError(errorMsg);
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchContacts();
    }
  }, [user, token, fetchContacts]);

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${contactId}/status`,
        { status: newStatus },
        getAuthConfig(token)
      );
      if (response.data.success) {
        setContacts(contacts.map(c =>
          c._id === contactId ? { ...c, status: newStatus } : c
        ));
      }
    } catch (err) {
      console.error('Error updating contact status:', err);
      setError('Failed to update contact status');
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/${contactId}`,
        getAuthConfig(token)
      );
      if (response.data.success) {
        setContacts(contacts.filter(c => c._id !== contactId));
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact');
    }
  };

  const filteredContacts = selectedStatus === 'all'
    ? contacts
    : contacts.filter(c => c.status === selectedStatus);

  if (!user) {
    return <UnauthorizedState />;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
    
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Requests</h1>
        <Button
          onClick={fetchContacts}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-4"
        />
      )}

  
      <div className="mb-6 flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map(status => (
          <StatusButton
            key={status}
            status={status}
            isActive={selectedStatus === status}
            onClick={() => setSelectedStatus(status)}
          />
        ))}
      </div>


      {loading || filteredContacts.length > 0 ? (
        loading ? (
          <EmptyState loading={true} />
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact._id}
                contact={contact}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )
      ) : (
        <EmptyState loading={false} />
      )}
    </main>
  );
}

export default ContactsManagement;
