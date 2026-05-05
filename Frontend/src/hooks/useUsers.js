import { useState, useCallback } from 'react';
import { authAPI } from '../utils/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    setError(null);
    try {
      const response = await authAPI.updateUser(userId, userData);
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? response.data.user : user))
      );
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    setError(null);
    try {
      await authAPI.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  }, []);

  return {
    users,
    setUsers,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
  };
}