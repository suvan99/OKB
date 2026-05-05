import React from 'react';

export const Container = ({ children, className = '', bgColor = 'white' }) => {
  const bgClass = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-linear-to-r from-teal-600 to-blue-600',
  };

  return (
    <section className={`py-20 ${bgClass[bgColor]}`}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-8 ${className}`}>
        {children}
      </div>
    </section>
  );
};

export default Container;
