import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import Avatar from 'boring-avatars';
import { cn } from '@/lib/utils';
import { Zap, User, Mail, Trophy, Code, Clock, BookOpen, FileText, Star, LogOut } from 'lucide-react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import {
  IconDoorExit,
  IconBook,
  IconFileText,
  IconSettings,
  IconStar,
  IconPlus,
} from '@tabler/icons-react';
import LeetLabsLogoDark from '../assets/smart-logo.png';

export default function ProfilePage() {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <p className="text-gray-200 text-lg satoshi">Loading...</p>
      </div>
    );
  }

  // Determine if the user is an admin
  const isAdmin = user?.role === 'ADMIN';
  console.log('User:', user); // Debug: Check user object and role

  // Sidebar links
  const links = [
    {
      label: 'Practice Problems',
      href: '/problems',
      icon: <IconBook className="h-5 w-5 shrink-0 text-gray-200" />,
    },
    {
      label: 'Sheets Library',
      href: '/sheets',
      icon: <IconFileText className="h-5 w-5 shrink-0 text-gray-200" />,
    },
    {
      label: 'Featured Courses',
      href: '/courses',
      icon: <IconStar className="h-5 w-5 shrink-0 text-gray-200" />,
    },
    {
      label: 'Contribute',
      href: '/contribute',
      icon: <IconPlus className="h-5 w-5 shrink-0 text-gray-200" />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <IconSettings className="h-5 w-5 shrink-0 text-gray-200" />,
    },
    {
      label: 'Logout',
      href: '#',
      onClick: () => {
        logout();
        navigate('/login');
      },
      icon: <LogOut className="h-5 w-5 shrink-0 text-gray-200" />,
    },
  ];

  // Logo components
  const Logo = () => (
    <Link
      to="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <img src={LeetLabsLogoDark} alt="LeetLabs Logo" className="h-8 w-auto" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold whitespace-pre text-xl text-white arp-display"
      >
        Leet<span className="text-yellow-500">Labs</span>
      </motion.span>
    </Link>
  );

  const LogoIcon = () => (
    <Link
      to="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <img src={LeetLabsLogoDark} alt="LeetLabs Logo" className="h-8 w-auto" />
    </Link>
  );

  // Dummy data for stats, activity, and badges (replace with API calls later)
  const stats = {
    problemsSolved: 42,
    contributions: isAdmin ? 15 : 0,
    rank: 123,
  };

  const activity = [
    { id: 1, action: "Solved 'Two Sum'", date: 'May 15, 2025', icon: <Code className="h-5 w-5 text-yellow-500" /> },
    {
      id: 2,
      action: 'Contributed a problem',
      date: 'May 14, 2025',
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      adminOnly: true,
    },
    { id: 3, action: 'Joined LeetLabs', date: 'May 10, 2025', icon: <User className="h-5 w-5 text-yellow-500" /> },
  ];

  const badges = [
    { name: 'Problem Solver', icon: <Code className="h-6 w-6 text-yellow-500" /> },
    { name: 'Contributor', icon: <Trophy className="h-6 w-6 text-yellow-500" />, adminOnly: true },
    { name: 'Early Adopter', icon: <Clock className="h-6 w-6 text-yellow-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="relative flex flex-col h-screen bg-transparent shadow-lg">
          {/* Top Section: Logo and Links */}
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2.5">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    ...link,
                    href: link.href,
                    onClick: link.onClick || undefined,
                  }}
                  className="text-gray-200 hover:text-yellow-500 transition-all duration-300"
                />
              ))}
            </div>
          </div>
          {/* Bottom Section: Avatar */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <SidebarLink
              link={{
                label: user?.name || 'LeetLabs User',
                href: '/profile',
                icon: (
                  <Avatar
                    size={28}
                    name={user?.name || 'Guest'}
                    variant="beam"
                    colors={['#f5b210', '#166534', '#ef4444', '#3b82f6', '#ffffff']}
                    className="shrink-0 rounded-full border-2 border-yellow-500"
                  />
                ),
              }}
              className="text-gray-200 hover:text-yellow-500 transition-all duration-300"
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Navbar Spacer */}
        <div className="h-18.5 md:h-0"></div>

        {/* Two-Column Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Profile Card and Stats */}
          <div className="md:w-1/3 flex flex-col gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-neutral-900 rounded-xl p-6 shadow-2xl border border-yellow-500/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-50"></div>
              <div className="relative flex flex-col items-center gap-4">
                {/* Avatar */}
                <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
                  <Avatar
                    size={120}
                    name={user?.name || 'Guest'}
                    variant="beam"
                    colors={['#f5b210', '#166534', '#ef4444', '#3b82f6', '#ffffff']}
                    className="border-4 border-yellow-500 rounded-full shadow-xl"
                  />
                </motion.div>

                {/* User Info */}
                <div className="text-center space-y-2">
                  <h1 className="text-xl font-bold text-white arp-display">{user?.name || 'Guest'}</h1>
                  <p className="text-gray-200 flex items-center justify-center gap-2">
                    <Mail className="h-5 w-5 text-yellow-500" />
                    {user?.email || 'email@example.com'}
                  </p>
                  <p className="text-gray-200 flex items-center justify-center gap-2">
                    <User className="h-5 w-5 text-yellow-500" />
                    Role:{' '}
                    <span className={isAdmin ? 'text-yellow-500 font-bold' : 'text-yellow-500'}>
                      {user?.role || 'CODER'}
                    </span>
                  </p>
                  <div className="mt-4 flex justify-center">
                    <Link to="/pricing">
                      <ShimmerButton
                        shimmerColor="#f5b210"
                        borderRadius="7px"
                        shimmerSize="0.15em"
                        background="black"
                        className="h-10 px-6 text-sm font-semibold text-white group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] flex items-center gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        Upgrade to Pro
                      </ShimmerButton>
                    </Link>
                  </div>
                  <p className="mt-2 text-gray-400 text-sm">Upgrade to Unlock exclusive Pro features.</p>
                </div>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-800/50"
            >
              <h3 className="text-xl font-semibold text-white satoshi mb-4">Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Problems Solved', value: stats.problemsSolved, icon: <Code className="h-5 w-5 text-yellow-500" /> },
                  { label: 'Contributions', value: stats.contributions, icon: <Trophy className="h-5 w-5 text-yellow-500" /> },
                  { label: 'Rank', value: `#${stats.rank}`, icon: <Star className="h-5 w-5 text-yellow-500" /> },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 bg-neutral-800 rounded-lg p-3 hover:bg-neutral-800/70 transition-all duration-300"
                  >
                    <div>{stat.icon}</div>
                    <div>
                      <p className="text-gray-200">{stat.label}</p>
                      <p className="text-lg font-bold text-yellow-500">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contributions, Activity, Badges */}
          <div className="md:w-2/3 flex flex-col gap-6">
            {/* Contributions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-white satoshi mb-4">Contributions</h2>
              <div className="bg-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-800/50">
                {isAdmin ? (
                  <div>
                    <p className="text-gray-200 mb-4">As an admin, you can contribute problems to the platform.</p>
                    <Link to="/profile/add-problem">
                      <ShimmerButton
                        shimmerColor="#f5b210"
                        borderRadius="7px"
                        shimmerSize="0.15em"
                        background="black"
                        className="h-11 px-6 text-sm font-semibold text-white group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]"
                      >
                        Add New Problem
                      </ShimmerButton>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-200 mb-4">Only admins can contribute problems to the platform.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-white satoshi mb-4">Recent Activity</h2>
              <div className="bg-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-800/50">
                <div className="space-y-4">
                  {activity
                    .filter((item) => !item.adminOnly || isAdmin)
                    .map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-4 border-l-2 border-yellow-500 pl-4 py-2 hover:bg-neutral-800/70 rounded-lg transition-all duration-300"
                      >
                        <div>{item.icon}</div>
                        <div>
                          <p className="text-gray-200">{item.action}</p>
                          <p className="text-sm text-gray-400">{item.date}</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>

            {/* Badges Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h2 className="text-2xl font-semibold text-white satoshi mb-4">Achievements</h2>
              <div className="bg-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-800/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges
                    .filter((badge) => !badge.adminOnly || isAdmin)
                    .map((badge) => (
                      <motion.div
                        key={badge.name}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 bg-neutral-800 rounded-lg p-4 hover:bg-neutral-800/70 transition-all duration-300"
                      >
                        <div>{badge.icon}</div>
                        <p className="text-gray-200 font-semibold">{badge.name}</p>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}