import { useState, useCallback, useEffect } from 'react';
import io from 'socket.io-client';
import { sopAPI } from '../utils/api';

export function useSops() {
  const [sops, setSops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Listen for real-time SOP updates
    newSocket.on('sopUpdated', (data) => {
      console.log('Real-time SOP update:', data);
      if (data.action === 'create') {
        setSops((prev) => [data.sop, ...prev]);
      } else if (data.action === 'update') {
        setSops((prev) =>
          prev.map((s) => (s._id === data.sop._id ? data.sop : s))
        );
      } else if (data.action === 'delete') {
        setSops((prev) => prev.filter((s) => s._id !== data.sopId));
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchSops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await sopAPI.getAll();
      setSops(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch SOPs');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSop = useCallback(async (title, content, tags) => {
    setError(null);
    try {
      const response = await sopAPI.create({ title, content, tags });
      // Local state update removed - socket will handle real-time update
      return response.data.sop;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create SOP');
      throw err;
    }
  }, []);

  const updateSop = useCallback(async (sopId, title, content, tags) => {
    setError(null);
    try {
      const response = await sopAPI.update(sopId, { title, content, tags });
      // Local state update removed - socket will handle real-time update
      return response.data.sop;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update SOP');
      throw err;
    }
  }, []);

  const deleteSop = useCallback(async (sopId) => {
    setError(null);
    try {
      await sopAPI.delete(sopId);
      // Local state update removed - socket will handle real-time update
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete SOP');
      throw err;
    }
  }, []);

  const searchSops = useCallback(async (query) => {
    setError(null);
    try {
      const response = await sopAPI.search(query);
      setSops(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    }
  }, []);

  return {
    sops,
    setSops,
    loading,
    error,
    fetchSops,
    createSop,
    updateSop,
    deleteSop,
    searchSops,
  };
}
