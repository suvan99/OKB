import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const typeStyles = {
    success: 'bg-green-100 text-green-700 border-green-400',
    error: 'bg-red-100 text-red-700 border-red-400',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
    info: 'bg-blue-100 text-blue-700 border-blue-400',
  };

  const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    warning: <FaExclamationCircle />,
    info: <FaInfoCircle />,
  };

  return (
    <div
      className={`mb-4 p-3 border rounded flex items-center gap-2 ${typeStyles[type]} ${className}`}
      role="alert"
    >
      <span className="text-lg">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto hover:opacity-70 transition"
          aria-label="Close alert"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default Alert;
