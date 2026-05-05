import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import { Button } from '../components/common';

function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <FaExclamationTriangle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button className="flex items-center justify-center gap-2">
            <FaHome /> Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default NotFound;