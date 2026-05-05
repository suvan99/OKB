import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
  const hoverClass = hover ? 'hover:shadow-xl transition transform hover:-translate-y-2' : '';

  return (
    <div className={`bg-white p-8 rounded-xl shadow-md ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export const IconCard = ({ icon: Icon, title, description, className = '' }) => (
  <Card hover className={className}>
    <Icon className="text-4xl text-teal-600 mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);

export const FeatureCard = ({ number, label, description, isDark = false }) => (
  <div className={`text-center ${isDark ? 'text-white' : ''}`}>
    <div className="text-5xl font-extrabold mb-2">{number}</div>
    <div className="text-xl font-semibold mb-2">{label}</div>
    <p className={isDark ? 'text-teal-100' : 'text-gray-600'}>{description}</p>
  </div>
);

export default Card;
