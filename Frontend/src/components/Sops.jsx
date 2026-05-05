import React, { useEffect, useState } from 'react';
import { useSops } from '../hooks/useSops';
import { useAuth } from '../context/AuthContext';
import { FaSave, FaTimes, FaSearch, FaEdit, FaTrash, FaClock, FaDownload } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

export default function Sops() {
  const { user } = useAuth();
  const { sops, loading, error, fetchSops, createSop, updateSop, deleteSop, searchSops } = useSops();

  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ id: null, title: '', content: '', tags: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load SOPs on mount
  useEffect(() => {
    if (user) {
      fetchSops();
    }
  }, [user, fetchSops]);

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

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-center text-gray-600">Please login to manage SOPs</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-4">SOPs</h1>
      <div className="flex items-center gap-4 mb-3">
        <p className="text-gray-600">Create and manage Standard Operating Procedures. Each update keeps a version history you can revert to.</p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-3">
            <h2 className="font-semibold">{form.id ? 'Edit SOP' : 'New SOP'}</h2>

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
                rows={6}
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

          <div className="mt-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search SOPs"
                className="block w-full rounded-md border border-gray-300 shadow-sm px-10 py-2"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {loading && <p className="text-sm text-gray-500">Loading SOPs...</p>}
            {!loading && filtered.length === 0 && <p className="text-sm text-gray-500">No SOPs found</p>}
            {filtered.map((s) => (
              <div key={s._id} className={`bg-white p-3 rounded-md shadow-sm ${selectedId === s._id ? 'ring-2 ring-teal-200' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button onClick={() => selectSop(s)} className="text-left text-sm font-medium text-gray-900 hover:text-teal-600">
                        {s.title}
                      </button>
                      {s.isGlobal && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{(s.tags || []).join(', ')}</p>
                    {s.isGlobal && s.userId && (
                      <p className="text-xs text-gray-400">Published by: {s.userId.firstName} {s.userId.lastName}</p>
                    )}
                    <p className="text-xs text-gray-400">{`Updated ${formatDate(s.updatedAt)}`}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!s.isGlobal && (
                      <>
                        <button onClick={() => startEdit(s)} className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">
                          <FaEdit /> Edit
                        </button>
                        <button onClick={() => handleDelete(s)} className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">
                          <FaTrash /> Delete
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDownload(s)} className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">
                      <FaDownload /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {selected ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold">{selected.title}</h2>
                {selected.isGlobal && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Admin Published
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{(selected.tags || []).join(', ')}</p>
              {selected.isGlobal && selected.userId && (
                <p className="text-sm text-gray-500">Published by: {selected.userId.firstName} {selected.userId.lastName} ({selected.userId.email})</p>
              )}
              <p className="text-xs text-gray-400 mb-4">Last updated {formatDate(selected.updatedAt)}</p>

              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm">{selected.content}</pre>
              </div>

              <div className="mt-6">
                <h3 className="font-medium flex items-center gap-2"><FaClock /> Version history</h3>
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