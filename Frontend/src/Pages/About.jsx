import React from 'react';
import { FaLightbulb, FaShieldAlt, FaRocket, FaUsers, FaBullseye, FaCheckCircle, FaBriefcase, FaAward } from 'react-icons/fa';
import { IconCard, FeatureCard, Container, SectionHeader } from '../components/common';

// Data Constants
const VALUES = [
  {
    icon: FaLightbulb,
    title: 'Innovation',
    description: 'We continuously innovate to provide cutting-edge solutions that meet evolving business needs.'
  },
  {
    icon: FaShieldAlt,
    title: 'Security',
    description: 'Your data security and privacy are our top priorities with enterprise-grade protection.'
  },
  {
    icon: FaUsers,
    title: 'Collaboration',
    description: 'We foster teamwork and open communication across organizations for better outcomes.'
  },
  {
    icon: FaBullseye,
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of our product and service delivery.'
  }
];

const STATS = [
  { number: '1000+', label: 'Active Organizations', description: 'Trusted by over 1000 organizations worldwide' },
  { number: '50K+', label: 'Users', description: 'Managing knowledge for thousands of users daily' },
  { number: '99.9%', label: 'Uptime', description: 'Reliable infrastructure ensuring continuous access' },
  { number: '24/7', label: 'Support', description: 'Dedicated support team always available to help' }
];

const TEAM = [
  { name: 'John Smith', role: 'Chief Executive Officer', icon: FaBriefcase },
  { name: 'Sarah Johnson', role: 'Chief Technology Officer', icon: FaRocket },
  { name: 'Michael Chen', role: 'Chief Product Officer', icon: FaBullseye },
  { name: 'Emily Davis', role: 'Head of Customer Success', icon: FaAward }
];

const VISION_BENEFITS = [
  'Reduce onboarding time by 50%',
  'Eliminate knowledge silos',
  'Ensure compliance and consistency',
  'Drive operational excellence'
];

const MISSION_HIGHLIGHTS = [
  { title: 'Trusted by Leaders', description: 'Used by Fortune 500 companies' },
  { title: 'Industry Standard', description: 'SOC 2 Type II Certified' }
];

// Section Components
const HeroSection = () => (
  <section className="bg-linear-to-r from-teal-500 to-teal-600 text-white py-20">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
      <h1 className="text-5xl font-extrabold mb-6">About OKB</h1>
      <p className="text-xl text-teal-100 max-w-3xl mx-auto">
        Organizational Knowledge Base is revolutionizing how companies manage, organize, and access critical operational knowledge. We empower teams to work smarter, faster, and more cohesively.
      </p>
    </div>
  </section>
);

const MissionHighlight = ({ title, description }) => (
  <div className="flex items-start gap-3">
    <FaCheckCircle className="text-teal-600 text-2xl mt-1" />
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const MissionSection = () => (
  <Container bgColor="white">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-lg text-gray-700 mb-4">
          We believe that organizational knowledge is a strategic asset that should be easily accessible, securely stored, and continuously improved. Our mission is to provide the most intuitive and powerful knowledge management platform for modern enterprises.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          By centralizing SOPs, policies, and compliance documentation, we help organizations reduce operational errors, accelerate onboarding, and maintain consistent practices across all teams.
        </p>
        <div className="flex gap-4">
          {MISSION_HIGHLIGHTS.map((highlight, idx) => (
            <MissionHighlight key={idx} {...highlight} />
          ))}
        </div>
      </div>
      <div className="bg-linear-to-br from-teal-100 to-blue-100 rounded-xl p-12 h-96 flex items-center justify-center">
        <div className="text-center">
          <FaRocket className="text-6xl text-teal-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">Transforming Knowledge Management</p>
        </div>
      </div>
    </div>
  </Container>
);

const VisionBenefit = ({ benefit }) => (
  <div className="flex items-center gap-3">
    <FaCheckCircle className="text-green-600 text-xl" />
    <span className="text-gray-700">{benefit}</span>
  </div>
);

const VisionSection = () => (
  <Container bgColor="gray">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="bg-linear-to-br from-orange-100 to-yellow-100 rounded-xl p-12 h-96 flex items-center justify-center order-2 md:order-1">
        <div className="text-center">
          <FaBullseye className="text-6xl text-orange-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">Strategic Knowledge Planning</p>
        </div>
      </div>
      <div className="order-1 md:order-2">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Our Vision</h2>
        <p className="text-lg text-gray-700 mb-4">
          In a world where information is power, we envision a future where every organization has a single source of truth for all operational knowledge.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          We're building the infrastructure that enables businesses to capture, organize, and leverage institutional knowledge to drive growth, innovation, and excellence.
        </p>
        <div className="space-y-3">
          {VISION_BENEFITS.map((benefit, idx) => (
            <VisionBenefit key={idx} benefit={benefit} />
          ))}
        </div>
      </div>
    </div>
  </Container>
);

const ValuesSection = () => (
  <Container bgColor="white">
    <SectionHeader title="Our Core Values" subtitle="These principles guide every decision we make" />
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {VALUES.map((value, idx) => (
        <IconCard key={idx} {...value} />
      ))}
    </div>
  </Container>
);

const StatsSection = () => (
  <section className="py-20 bg-linear-to-r from-teal-600 to-blue-600 text-white">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <SectionHeader title="By The Numbers" subtitle="Our impact across the globe" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((stat, idx) => (
          <FeatureCard key={idx} {...stat} isDark={true} />
        ))}
      </div>
    </div>
  </section>
);

const TeamMemberCard = ({ name, role, icon: Icon }) => (
  <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition text-center hover:-translate-y-2">
    <div className="bg-linear-to-br from-teal-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
      <Icon className="text-4xl text-teal-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
    <p className="text-teal-600 font-medium">{role}</p>
  </div>
);

const TeamSection = () => (
  <Container bgColor="gray">
    <SectionHeader title="Leadership Team" subtitle="Experienced leaders driving innovation" />
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {TEAM.map((member, idx) => (
        <TeamMemberCard key={idx} {...member} />
      ))}
    </div>
  </Container>
);

function About() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <MissionSection />
      <VisionSection />
      <ValuesSection />
      <StatsSection />
      <TeamSection />
    </main>
  );
}

export default About;