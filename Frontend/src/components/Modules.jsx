import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaFileAlt, FaTags, FaSearch, FaBook } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const modules = [
  {
    name: "Dashboard",
    icon: MdDashboard,
    description: "Central hub for all your data",
    route: "/"
  },
  {
    name: "SOP Creator",
    icon: FaFileAlt,
    description: "Create and manage procedures",
    route: "/sops"
  },
  {
    name: "Auto Tagging",
    icon: FaTags,
    description: "Automatic content classification",
    route: "/auto-tagging"
  },
  {
    name: "Search",
    icon: FaSearch,
    description: "Advanced search capabilities",
    route: "/search"
  },
  {
    name: "Audit Log",
    icon: FaBook,
    description: "Track all activities",
    route: "/audit"
  }
];

const Modules = () => {
  const navigate = useNavigate();

  const handleModuleClick = (route) => {
    navigate(route);
  };

  return (
    <section className="py-20 bg-white" id="modules">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Modules</h2>
        <p className="text-gray-600 mb-12">Building blocks of a powerful knowledge base</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={index}
                onClick={() => handleModuleClick(module.route)}
                className="module-box bg-linear-to-br from-gray-50 to-teal-50 border-2 border-teal-500 rounded-xl p-8 shadow-md hover:shadow-xl transition transform hover:-translate-y-2 hover:bg-linear-to-br hover:from-teal-500 hover:to-teal-600 hover:text-white group cursor-pointer"
              >
                <Icon className="text-4xl mx-auto mb-4 text-teal-600 group-hover:text-white transition" />
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-white mb-2">{module.name}</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-100">{module.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Modules;

