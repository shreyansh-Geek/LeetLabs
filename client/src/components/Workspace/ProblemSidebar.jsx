// components/Problems/ProblemSidebar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Map,
  Plus,
  Moon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Avatar from 'boring-avatars';
import LeetLabsLogoDark from '../../assets/smart-logo.png';

const ProblemSidebar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: 'Practice',
      href: '/problems',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      label: 'Sheets',
      href: '/sheets',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: isExpanded ? 'Less' : 'More',
      href: '#',
      icon: isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />,
      onClick: () => setIsExpanded(!isExpanded),
    },
    ...(isExpanded
      ? [
          {
            label: 'Courses',
            href: '/courses',
            icon: <GraduationCap className="h-5 w-5" />,
          },
          {
            label: 'Roadmap',
            href: '/roadmap',
            icon: <Map className="h-5 w-5" />,
          },
          {
            label: 'Contribute',
            href: '/contribute',
            icon: <Plus className="h-5 w-5" />,
          },
        ]
      : []),
  ];

  const bottomItems = [
    {
      label: 'Dark Mode',
      href: '#',
      icon: <Moon className="h-5 w-5" />,
      onClick: () => {}, // Placeholder for dark mode toggle
    },
    ...(isAuthenticated
      ? [
          {
            label: 'Logout',
            href: '#',
            icon: <LogOut className="h-5 w-5" />,
            onClick: handleLogout,
          },
          {
            label: 'Profile',
            href: '/profile',
            icon: (
              <Avatar
                size={24}
                name={user?.name || 'Guest'}
                variant="beam"
                colors={['#f5b210', '#166534', '#ef4444', '#3b82f6', '#ffffff']}
                className="shrink-0 rounded-full"
              />
            ),
          },
        ]
      : [
          {
            label: 'Login',
            href: '/login',
            icon: <LogOut className="h-5 w-5" />,
          },
          {
            label: 'Join',
            href: '/signup',
            icon: <Plus className="h-5 w-5" />,
          },
        ]),
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="fixed top-0 left-0 h-[100vh] w-[80px] border-r border-[#333333] bg-[#181d23] flex flex-col items-center py-4 font-satoshi z-50"
        style={{ overflow: 'hidden' }}
      >
        {/* Logo */}
        <div className="mb-8">
          <Link to="/">
            <img
              src={LeetLabsLogoDark}
              alt="LeetLabs Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col items-center gap-6">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              onClick={item.onClick}
              className="flex flex-col items-center gap-1 text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out"
            >
              {item.icon}
              <span className="text-xs font-medium text-center">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Items */}
        <div className="flex flex-col items-center gap-6 mb-2">
          {bottomItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              onClick={item.onClick}
              className="flex flex-col items-center gap-1 text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out"
            >
              {item.icon}
              <span className="text-xs font-medium text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-0 left-0 w-full h-12 bg-[#181d23] flex items-center justify-between px-4 z-50">
        <img src={LeetLabsLogoDark} alt="LeetLabs Logo" className="h-6 w-auto" />
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle sidebar"
          className="text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed top-0 left-0 h-[100vh] w-[80px] bg-[#181d23] flex flex-col items-center py-4 font-satoshi z-50">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" onClick={() => setIsMobileOpen(false)}>
              <img
                src={LeetLabsLogoDark}
                alt="LeetLabs Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col items-center gap-4">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                onClick={() => {
                  item.onClick?.();
                  setIsMobileOpen(false);
                }}
                className="flex flex-col items-center gap-1 text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out"
              >
                {item.icon}
                <span className="text-xs font-medium text-center">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Items */}
          <div className="flex flex-col items-center gap-4">
            {bottomItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                onClick={() => {
                  item.onClick?.();
                  setIsMobileOpen(false);
                }}
                className="flex flex-col items-center gap-1 text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out"
              >
                {item.icon}
                <span className="text-xs font-medium text-center">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProblemSidebar;