import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Home from './Pages/Home';
import Features from './Pages/Features';
import Modules from './Pages/Modules';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Profile from './Pages/Profile';
import Sops from './components/Sops';
import AdminPanel from './Pages/AdminPanel';
import AutoTagging from './Pages/AutoTagging';
import PolicyIndex from './Pages/PolicyIndex';
import AdvancedSearch from './Pages/AdvancedSearch';
import Versions from './Pages/Versions';
import AuditLog from './Pages/AuditLog';
import ContactsManagement from './Pages/ContactsManagement';
import NotFound from './Pages/NotFound';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="scroll-smooth font-sans bg-gray-50 text-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/modules" element={<Modules />} />
            <Route path="/sops" element={<Sops />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPanel />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/auto-tagging" element={<AutoTagging />} />
            <Route path="/policy-index" element={<PolicyIndex />} />
            <Route path="/search" element={<AdvancedSearch />} />
            <Route path="/versions" element={<Versions />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route
              path="/contacts-management"
              element={
                <ProtectedRoute>
                  <ContactsManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
