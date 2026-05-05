import React from 'react'
import { FaLightbulb, FaShieldAlt, FaUsers, FaBriefcase } from 'react-icons/fa'

function coreValues() {
  const values = [
    {
      title: 'Innovation',
      description: 'We continuously improve and embrace new technologies to solve complex problems.',
      icon: FaLightbulb
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and strong ethical principles in all dealings.',
      icon: FaShieldAlt
    },
    {
      title: 'Collaboration',
      description: 'We believe in teamwork and fostering a culture of mutual respect and support.',
      icon: FaUsers
    },
    {
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do and deliver outstanding results.',
      icon: FaBriefcase
    }
  ];

  return (
    <div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Our Core Values</h2>
            <p className="text-xl text-gray-600">These principles guide every decision we make</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
                  <Icon className="text-4xl text-teal-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  )
}

export default coreValues
