import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaTags, FaFolder, FaSearch, FaHistory, FaShieldAlt } from 'react-icons/fa';

const defaultFeatures = [
  {
    icon: FaFileAlt,
    title: 'SOP Creator',
    description: 'Compose, update, and version SOPs using a consistent structure that scales.'
  },
  {
    icon: FaTags,
    title: 'Auto‑Tagging',
    description: 'Automatic metadata extraction categorizes documents for faster discovery.'
  },
  {
    icon: FaFolder,
    title: 'Policy Index',
    description: 'Centralized index of policies organized by department, process, or compliance.'
  },
  {
    icon: FaSearch,
    title: 'Advanced Search',
    description: 'Search across titles, descriptions, tags, and revision histories.'
  },
  {
    icon: FaHistory,
    title: 'Version History',
    description: 'Track changes and revert when necessary for operational confidence.'
  },
  {
    icon: FaShieldAlt,
    title: 'Audit Log',
    description: 'Capture updates, approvals, and access patterns for compliance readiness.'
  }
];

export default function Features({ features = defaultFeatures, id = 'features' }) {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50" id={id}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center" data-aos="fade-up">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Key Features</h2>
        <p className="text-gray-600 mb-12">Streamline knowledge management across your organization</p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const title = feature.title
            const routeMap = {
              'SOP Creator': '/sops',
              'Auto‑Tagging': '/auto-tagging',
              'Policy Index': '/policy-index',
              'Advanced Search': '/search',
              'Version History': '/versions',
              'Audit Log': '/audit'
            }
            const route = routeMap[title]
            const isLink = Boolean(route)

            return (
              <article
                key={feature.title}
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-2 ${isLink ? 'cursor-pointer' : ''}`}
                aria-labelledby={`feature-${feature.title.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={isLink ? () => navigate(route) : undefined}
                onKeyDown={isLink ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(route) } } : undefined}
                tabIndex={isLink ? 0 : undefined}
                role={isLink ? 'button' : undefined}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-teal-100 text-teal-600 p-4 rounded-full">
                    <feature.icon className="text-3xl" aria-hidden="true" />
                  </div>
                </div>

                <h3 id={`feature-${feature.title.replace(/\s+/g, '-').toLowerCase()}`} className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export { defaultFeatures };

