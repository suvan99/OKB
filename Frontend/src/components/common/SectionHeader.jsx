import React from 'react';

export const SectionHeader = ({ title, subtitle, align = 'center' }) => {
  const alignClass = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
  };

  return (
    <div className={`mb-12 ${alignClass[align]}`}>
      <h2 className="text-4xl font-extrabold text-gray-900 mb-3">{title}</h2>
      {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
    </div>
  );
};

export const HeroSectionHeader = ({ title, subtitle }) => (
  <section className="bg-linear-to-r from-teal-500 to-teal-600 text-white py-20">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-6">{title}</h1>
        {subtitle && <p className="text-xl text-teal-100 max-w-3xl mx-auto">{subtitle}</p>}
      </div>
    </div>
  </section>
);

export default SectionHeader;
