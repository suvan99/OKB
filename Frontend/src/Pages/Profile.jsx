import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, LoadingSpinner } from '../components/common';
import { FaUser, FaEnvelope, FaIdCard, FaSignOutAlt } from 'react-icons/fa';

const ProfileField = ({ label, icon: Icon, value }) => (
  <div className="border-b pb-4">
    <p className="text-gray-600 text-sm flex items-center gap-2">
      <Icon className="w-4 h-4" /> {label}
    </p>
    <p className="text-lg font-semibold mt-1">{value}</p>
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      navigate('/login');
    }
  }, [loading, token, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <div className="space-y-4">
          <ProfileField label="First Name" icon={FaUser} value={user.firstName} />
          <ProfileField label="Last Name" icon={FaUser} value={user.lastName} />
          <ProfileField label="Email" icon={FaEnvelope} value={user.email} />
          <ProfileField label="Role" icon={FaIdCard} value={user.role?.toUpperCase()} />
        </div>

        <Button
          onClick={handleLogout}
          variant="danger"
          className="w-full mt-8 flex items-center justify-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </Button>
      </div>
    </main>
  );
}
