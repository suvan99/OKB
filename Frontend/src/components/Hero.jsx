import React from 'react';
import { FaRocket, FaChartLine, FaBolt, FaFileAlt, FaShieldAlt } from 'react-icons/fa';

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="bg-teal-100 text-teal-600 p-3 rounded-full">
      <Icon className="text-xl" />
    </div>
    <div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const HeroFeatures = () => (
  <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
    <FeatureItem
      icon={FaBolt}
      title="Auto‑Tagging"
      description="Smart metadata assigns tags automatically."
    />
    <FeatureItem
      icon={FaFileAlt}
      title="SOP Creator"
      description="Write, update, and version SOPs smoothly."
    />
    <FeatureItem
      icon={FaShieldAlt}
      title="Audit Log"
      description="Track changes, approvals, and history."
    />
  </div>
);

const Hero = () => {
  return (
    <header className="bg-linear-to-r from-teal-500 to-teal-300 text-gray-900 py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
        
        <div className="lg:w-1/2 space-y-6" data-aos="fade-right">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            Organizational Knowledge Base
          </h1>
          <p className="text-lg text-gray-800">
            Centralize SOPs, policies, and compliance. Faster onboarding, fewer errors, and consistent operations across your organization.
          </p>
          <div className="flex gap-4">
            <a
              href="/modules"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1"
            >
              <FaRocket /> Explore Module
            </a>
          </div>
        </div>

       
        <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center" data-aos="fade-left">
          <HeroFeatures />
        </div>
      </div>
    </header>
  );
};

export default Hero;
