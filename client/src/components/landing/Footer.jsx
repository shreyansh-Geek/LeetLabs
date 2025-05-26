// src/components/landing/Footer.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  Instagram,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import LeetLabsDark from "../../assets/LeetLabs-logo-dark.png";

// Social Media Links (replace with actual URLs)
const socialLinks = [
  {
    name: "Twitter",
    icon: <Twitter className="w-5 h-5" />,
    url: "https://twitter.com",
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    url: "https://instagram.com",
  },
  {
    name: "Github",
    icon: <Github className="w-5 h-5" />,
    url: "https://github.com",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    url: "https://linkedin.com",
  },
];

// Quick Links (Updated: Removed Home and Coding Leadership, Added Report an Issue and Feedback)
const quickLinks = [
  { name: "Problems", url: "/problems" },
  { name: "Profile", url: "/profile" },
  { name: "Report an Issue", url: "/report-issue" },
  { name: "Feedback", url: "/feedback" },
];

// Legal Links
const legalLinks = [
  { name: "Privacy Policy", url: "/privacy" },
  { name: "Terms of Service", url: "/terms" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null); // null, "success", "error"

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailStatus("success");
      setEmail("");
      setTimeout(() => setEmailStatus(null), 3000); // Reset status after 3 seconds
    } else {
      setEmailStatus("error");
      setTimeout(() => setEmailStatus(null), 3000);
    }
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Subtle Grain Texture and Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#f5b210]/10 to-transparent"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-0">
        {/* Top Section: Branding */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white arp-display tracking-tight">
            LeetLabs
          </h2>
          <p className="text-sm md:text-base text-gray-300 satoshi mt-2">
            Empowering Coders to Excel, One Challenge at a Time
          </p>
        </motion.div>

        {/* Middle Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <h3 className="text-lg font-semibold text-white arp-display mb-4 tracking-wide">
              About LeetLabs
            </h3>
            <p className="text-sm text-gray-300 satoshi leading-relaxed">
              LeetLabs is your ultimate platform for coding excellence. Solve
              problems, track progress, and grow your skills with our
              cutting-edge tools and vibrant community.
            </p>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-lg font-semibold text-white arp-display mb-4 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-sm text-gray-300 satoshi hover:text-[#f5b210] transition-colors duration-300 ease-in-out"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <h3 className="text-lg font-semibold text-white arp-display mb-4 tracking-wide">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#f5b210] flex-shrink-0" />
                <span className="text-sm text-gray-300 satoshi">
                  support@leetlabs.com
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#f5b210] flex-shrink-0" />
                <span className="text-sm text-gray-300 satoshi">
                  +91 123 456 789
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#f5b210] flex-shrink-0" />
                <span className="text-sm text-gray-300 satoshi">
                  123 Leet Street, Tech City
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <h3 className="text-lg font-semibold text-white arp-display mb-4 tracking-wide">
              Newsletter
            </h3>
            <p className="text-sm text-gray-300 satoshi mb-4">
              Stay updated with the latest coding challenges and tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 text-sm text-gray-900 satoshi bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f5b210] transition-all duration-300 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#f5b210] text-black px-4 py-1.5 rounded-md text-sm satoshi font-medium hover:bg-[#f5b210]/90 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: emailStatus ? 1 : 0,
                  y: emailStatus ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
              >
                {emailStatus === "success" && (
                  <p className="text-sm text-green-400 satoshi">
                    Subscribed successfully!
                  </p>
                )}
                {emailStatus === "error" && (
                  <p className="text-sm text-red-400 satoshi">
                    Please enter a valid email.
                  </p>
                )}
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Bottom Section: Social Media, Copyright, Legal Links, and Large LeetLabs Text */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 mb-8">
            {/* Social Media Icons */}
            <motion.div
              className="flex space-x-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#f5b210] hover:-rotate-6 transition-colors duration-300 ease-in-out"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Copyright and Legal Links */}
            <motion.div
              className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              <p className="text-sm text-gray-300 satoshi">
                © {new Date().getFullYear()} LeetLabs. All rights reserved.
              </p>
              <div className="flex space-x-4">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-sm text-gray-300 satoshi hover:text-[#f5b210] transition-colors duration-300 ease-in-out"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Large LeetLabs Text in Yellow */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          >
            <h2
              className="font-bold text-[#f5b210] arp-display tracking-tight"
              style={{ fontSize: "11rem", lineHeight: "1" }}
            >
              <span className="text-white">Leet </span>Labs
            </h2>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;