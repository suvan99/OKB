import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const ContactComp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:5000/api/contact/submit', formData);

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit contact request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Contact</h2>
          <p className="text-gray-600">We’d love to hear about your needs</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-2">
            <h3 className="text-xl font-semibold mb-4">Reach Us</h3>
            <p className="text-gray-700 mb-2 flex items-center gap-2"><FaEnvelope className="text-teal-600" /> Email: info@okb.com</p>
            <p className="text-gray-700 mb-4 flex items-center gap-2"><FaPhone className="text-teal-600" /> Phone: +91 98765 43210</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-600 hover:text-orange-500 transition text-2xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition text-2xl">
                <FaLinkedin />
              </a>
            </div>
          </div>

        
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-2">
            <h3 className="text-xl font-semibold mb-4">Quick Message</h3>

            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                <FaCheckCircle /> Your message has been sent successfully!
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Suvan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Tell us about your requirements..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg shadow-md transition transform hover:-translate-y-1 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                <FaPaperPlane /> {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactComp;
