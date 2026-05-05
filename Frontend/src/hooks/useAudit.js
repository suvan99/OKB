import { useState, useCallback } from 'react';
import { auditAPI } from '../utils/api';

export function useAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchLogs = useCallback(async (limit = 50, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await auditAPI.getAll(limit, page);
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByType = useCallback(async (type) => {
    setError(null);
    try {
      const response = await auditAPI.getByType(type);
      setLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch logs by type');
    }
  }, []);

  const fetchByAction = useCallback(async (action) => {
    setError(null);
    try {
      const response = await auditAPI.getByAction(action);
      setLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch logs by action');
    }
  }, []);

  const clearLogs = useCallback(async () => {
    setError(null);
    try {
      await auditAPI.clear();
      setLogs([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear logs');
      throw err;
    }
  }, []);

  return {
    logs,
    loading,
    error,
    pagination,
    fetchLogs,
    fetchByType,
    fetchByAction,
    clearLogs,
  };
}
