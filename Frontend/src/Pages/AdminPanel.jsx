import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaFileAlt, FaChartBar, FaSave, FaTimes, FaSearch, FaEdit, FaTrash, FaClock, FaDownload, FaUserPlus, FaUserEdit, FaComments } from 'react-icons/fa';
import { useSops } from '../hooks/useSops';
import { useUsers } from '../hooks/useUsers';
import { useContacts } from '../hooks/useContacts';
import html2pdf from 'html2pdf.js';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-center text-gray-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
    { id: 'sops', label: 'SOP Management', icon: FaFileAlt },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'feedback', label: 'Feedback Requests', icon: FaComments },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage your application and users</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'sops' && <AdminSops />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'feedback' && <AdminFeedback />}
        </div>
      </div>
    </div>
  );
}

function AdminSops() {
  const { user } = useAuth();
  const { sops, loading, error, fetchSops, createSop, updateSop, deleteSop, searchSops } = useSops();

  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ id: null, title: '', content: '', tags: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load SOPs on mount
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchSops();
    }
  }, [user, fetchSops]);

  function formatDate(iso) {
    return new Date(iso).toLocaleString();
  }

  function resetForm() {
    setForm({ id: null, title: '', content: '', tags: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setMessage('Title is required');
      return;
    }

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setIsSubmitting(true);

    try {
      if (form.id) {
        // Update existing SOP
        await updateSop(form.id, title, form.content, tags);
        setMessage('SOP updated successfully');
      } else {
        // Create new SOP
        await createSop(title, form.content, tags);
        setMessage('SOP created successfully');
      }
      resetForm();
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setMessage(err.message || 'Failed to save SOP');
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(sop) {
    setForm({
      id: sop._id,
      title: sop.title,
      content: sop.content,
      tags: (sop.tags || []).join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(sop) {
    if (!confirm(`Delete SOP "${sop.title}"?`)) return;

    try {
      await deleteSop(sop._id);
      setMessage('SOP deleted');
      if (selectedId === sop._id) setSelectedId(null);
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to delete SOP');
    }
  }

  async function handleSearch(searchQuery) {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      try {
        await searchSops(searchQuery);
      } catch (err) {
        setMessage('Search failed');
      }
    } else {
      await fetchSops();
    }
  }

  function handleDownload(sop) {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333;">${sop.title}</h1>
        <p style="color: #666; font-size: 14px;">Tags: ${(sop.tags || []).join(', ')}</p>
        <p style="color: #666; font-size: 14px;">Created by: ${sop.userId?.firstName} ${sop.userId?.lastName} (${sop.userId?.email})</p>
        <p style="color: #999; font-size: 12px;">Last updated: ${formatDate(sop.updatedAt)}</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <div style="white-space: pre-wrap; line-height: 1.6;">${sop.content}</div>
      </div>
    `;

    const options = {
      margin: 1,
      filename: `${sop.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  }

  function selectSop(sop) {
    setSelectedId(sop._id);
  }

  const filtered = query.trim()
    ? sops
    : sops.filter((s) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        (s.tags || []).join(' ').toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
      );
    });

  const selected = sops.find((s) => s._id === selectedId);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">SOP Management</h2>
      <p className="text-gray-600 mb-4">Manage all Standard Operating Procedures across the system.</p>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-3 mb-6">
            <h3 className="font-semibold">{form.id ? 'Edit SOP' : 'New SOP'}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="hr, onboarding"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                rows={4}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Step-by-step SOP content..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-400"
              >
                <FaSave /> {isSubmitting ? 'Saving...' : form.id ? 'Save Changes' : 'Create SOP'}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm} className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">
                  <FaTimes /> Cancel
                </button>
              )}
            </div>

            {message && <p className="text-sm text-teal-700 mt-2">{message}</p>}
          </form>

          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search SOPs"
              className="block w-full rounded-md border border-gray-300 shadow-sm px-10 py-2"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading && <p className="text-sm text-gray-500">Loading SOPs...</p>}
            {!loading && filtered.length === 0 && <p className="text-sm text-gray-500">No SOPs found</p>}
            {filtered.map((s) => (
              <div key={s._id} className={`bg-white p-3 rounded-md shadow-sm ${selectedId === s._id ? 'ring-2 ring-teal-200' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <button onClick={() => selectSop(s)} className="text-left text-sm font-medium text-gray-900 hover:text-teal-600">
                      {s.title}
                    </button>
                    <p className="text-xs text-gray-500">{(s.tags || []).join(', ')}</p>
                    <p className="text-xs text-gray-400">By: {s.userId?.firstName} {s.userId?.lastName}</p>
                    <p className="text-xs text-gray-400">{`Updated ${formatDate(s.updatedAt)}`}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => startEdit(s)} className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDownload(s)} className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">
                      <FaDownload /> Download
                    </button>
                    <button onClick={() => handleDelete(s)} className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold">{selected.title}</h3>
              <p className="text-sm text-gray-500">{(selected.tags || []).join(', ')}</p>
              <p className="text-sm text-gray-500">Created by: {selected.userId?.firstName} {selected.userId?.lastName} ({selected.userId?.email})</p>
              <p className="text-xs text-gray-400 mb-4">Last updated {formatDate(selected.updatedAt)}</p>

              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm">{selected.content}</pre>
              </div>

              <div className="mt-6">
                <h4 className="font-medium flex items-center gap-2"><FaClock /> Version history</h4>
                {(!selected.versions || selected.versions.length === 0) && <p className="text-sm text-gray-500">No previous versions.</p>}
                <div className="space-y-3 mt-3">
                  {selected.versions &&
                    selected.versions.map((v, i) => (
                      <div key={i} className="flex items-start justify-between bg-gray-50 p-3 rounded">
                        <div>
                          <p className="text-sm text-gray-700">{v.content.slice(0, 200) || '[empty]'}</p>
                          <p className="text-xs text-gray-400">Saved {formatDate(v.updatedAt)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 text-gray-500">
              <p>Select an SOP to view details and version history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const { users, fetchUsers } = useUsers();
  const { sops, fetchSops } = useSops();

  // Load data on mount
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
      fetchSops();
    }
  }, [user, fetchUsers, fetchSops]);

  // Calculate stats
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalRegularUsers = totalUsers - totalAdmins;
  const totalSops = sops.length;
  const globalSops = sops.filter(s => s.isGlobal).length;
  const userSops = totalSops - globalSops;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of your application statistics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaUserPlus className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{totalAdmins}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaFileAlt className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total SOPs</p>
              <p className="text-2xl font-bold text-gray-900">{totalSops}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaChartBar className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Global SOPs</p>
              <p className="text-2xl font-bold text-gray-900">{globalSops}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">System initialized</p>
              <p className="text-xs text-gray-500">Admin panel is ready for use</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Real-time updates enabled</p>
              <p className="text-xs text-gray-500">SOP changes are now synchronized across all users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const { user } = useAuth();
  const { users, loading, error, fetchUsers, updateUser, deleteUser } = useUsers();

  const [form, setForm] = useState({ id: null, firstName: '', lastName: '', email: '', role: 'user' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load users on mount
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  function formatDate(iso) {
    return new Date(iso).toLocaleString();
  }

  function resetForm() {
    setForm({ id: null, firstName: '', lastName: '', email: '', role: 'user' });
  }

  function startEdit(user) {
    setForm({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { firstName, lastName, email, role } = form;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setMessage('All fields are required');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUser(form.id, { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), role });
      setMessage('User updated successfully');
      resetForm();
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setMessage(err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(user) {
    if (!confirm(`Delete user "${user.firstName} ${user.lastName}"? This action cannot be undone.`)) return;

    try {
      await deleteUser(user._id);
      setMessage('User deleted successfully');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to delete user');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">User Management</h2>
        <p className="text-gray-600">Manage user accounts, roles, and permissions.</p>
      </div>

      {/* Edit User Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaUserEdit /> {form.id ? 'Edit User' : 'Create User'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting || !form.id}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
            >
              <FaSave /> {isSubmitting ? 'Updating...' : 'Update User'}
            </button>

            {form.id && (
              <button type="button" onClick={resetForm} className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">
                <FaTimes /> Cancel
              </button>
            )}
          </div>

          {message && <p className="text-sm text-teal-700 mt-2">{message}</p>}
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaUsers /> All Users ({users.length})
        </h3>

        {loading && <p className="text-sm text-gray-500">Loading users...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {!loading && users.length === 0 && <p className="text-sm text-gray-500">No users found</p>}
          {users.map((u) => (
            <div key={u._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    <p className="text-xs text-gray-400">Joined {formatDate(u.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${u.role === 'admin'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
                  }`}>
                  {u.role}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(u)}
                    className="flex items-center gap-2 text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u)}
                    disabled={u._id === user.id} // Prevent self-deletion
                    className="flex items-center gap-2 text-xs px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminFeedback() {
  const { user } = useAuth();
  const { contacts, loading, error, fetchContacts, updateContactStatus, deleteContact } = useContacts();

  const [message, setMessage] = useState('');

  // Load contacts on mount
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchContacts();
    }
  }, [user, fetchContacts]);

  function formatDate(iso) {
    return new Date(iso).toLocaleString();
  }

  function getStatusColor(status) {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  async function handleStatusUpdate(contactId, newStatus) {
    const result = await updateContactStatus(contactId, newStatus);
    if (result.success) {
      setMessage('Contact status updated successfully');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(result.error || 'Failed to update status');
    }
  }

  async function handleDelete(contactId) {
    if (!confirm('Delete this contact request? This action cannot be undone.')) return;

    const result = await deleteContact(contactId);
    if (result.success) {
      setMessage('Contact deleted successfully');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(result.error || 'Failed to delete contact');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Feedback Requests</h2>
        <p className="text-gray-600">Manage contact requests and feedback from users.</p>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaComments /> All Feedback Requests ({contacts.length})
        </h3>

        {loading && <p className="text-sm text-gray-500">Loading feedback requests...</p>}

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {!loading && contacts.length === 0 && (
            <p className="text-sm text-gray-500">No feedback requests found</p>
          )}
          {contacts.map((contact) => (
            <div key={contact._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                  <p className="text-xs text-gray-400">Submitted {formatDate(contact.createdAt)}</p>
                </div>

                <div className="flex gap-2">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}