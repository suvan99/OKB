import { useState, useCallback } from 'react';
import { contactAPI } from '../utils/api';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contactAPI.getAll();
      setContacts(response.data.contacts);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContactStatus = useCallback(async (contactId, status) => {
    try {
      const response = await contactAPI.updateStatus(contactId, status);
      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact._id === contactId ? response.data.contact : contact
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update contact status');
      return { success: false, error: err.response?.data?.error };
    }
  }, []);

  const deleteContact = useCallback(async (contactId) => {
    try {
      await contactAPI.delete(contactId);
      setContacts(prevContacts =>
        prevContacts.filter(contact => contact._id !== contactId)
      );
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete contact');
      return { success: false, error: err.response?.data?.error };
    }
  }, []);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    updateContactStatus,
    deleteContact
  };
};