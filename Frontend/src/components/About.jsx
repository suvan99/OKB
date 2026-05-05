import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div data-aos="fade-right">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Why Choose OKB?</h2>
            <p className="text-gray-600 mb-6">
              Our Organizational Knowledge Base improves institutional memory, reduces knowledge loss,
              enhances compliance, and speeds onboarding. Built with modern technology, it ensures your
              team always has access to the right information at the right time.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <i className="bi bi-check-circle-fill text-teal-600 mr-2"></i>
                Unified store for SOPs and policies
              </li>
              <li className="flex items-center">
                <i className="bi bi-check-circle-fill text-teal-600 mr-2"></i>
                Auto‑tagging and rich search
              </li>
              <li className="flex items-center">
                <i className="bi bi-check-circle-fill text-teal-600 mr-2"></i>
                Versioning and audit logs
              </li>
            </ul>
          </div>

         
          <div className="flex justify-center" data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop"
              alt="Knowledge Base illustration"
              className="rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
