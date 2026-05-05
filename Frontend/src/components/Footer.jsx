import React from 'react';
import { FaHome, FaStar, FaBox, FaInfoCircle, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const QUICK_LINKS = [
  { href: '#home', icon: FaHome, label: 'Home' },
  { href: '#features', icon: FaStar, label: 'Features' },
  { href: '#modules', icon: FaBox, label: 'Modules' },
  { href: '#about', icon: FaInfoCircle, label: 'About' },
  { href: '#contact', icon: FaPhone, label: 'Contact' },
];

const SOCIAL_LINKS = [
  { href: '#', icon: FaFacebook },
  { href: '#', icon: FaTwitter },
  { href: '#', icon: FaLinkedin },
];

const FooterLink = ({ href, icon: Icon, label }) => (
  <li>
    <a href={href} className="flex items-center gap-2 hover:text-orange-400 transition">
      <Icon /> {label}
    </a>
  </li>
);

const SocialLink = ({ href, icon: Icon }) => (
  <a href={href} className="hover:text-orange-400 transition">
    <Icon />
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-12">

        <div>
          <h6 className="text-white font-bold mb-4">About OKB</h6>
          <p className="text-sm">
            Organizational Knowledge Base is a modern solution to centralize SOPs, policies,
            and compliance for enterprises. Built for reliability, clarity, and speed.
          </p>
        </div>


        <div>
          <h6 className="text-white font-bold mb-4">Quick Links</h6>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <FooterLink key={link.href} {...link} />
            ))}
          </ul>
        </div>


        <div>
          <h6 className="text-white font-bold mb-4">Contact</h6>
          <p className="text-sm mb-2 flex items-center gap-2">
            <FaEnvelope /> Email: info@okb.com
          </p>
          <p className="text-sm mb-4 flex items-center gap-2">
            <FaPhone /> Phone: +91 98765 43210
          </p>
          <div className="flex gap-4 text-xl">
            {SOCIAL_LINKS.map((link, idx) => (
              <SocialLink key={idx} {...link} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        © 2026 Organizational Knowledge Base · All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
