import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useSheets } from '@/lib/sheets';
import { useProfile } from '@/lib/profile';
import Avatar from 'boring-avatars';
import { IconBook, IconFileText, IconStar, IconPlus } from '@tabler/icons-react';
import { LogOut, Home, Map } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import LeetLabsLogoDark from '../assets/smart-logo.png';
import StatCard from '@/components/Profile/StatCard';
import HeroSection from '@/components/Profile/HeroSection';
import ActivityHeatmap from '@/components/Profile/ActivityHeatmap';
import SkillsRadar from '@/components/Profile/SkillsRadar';
import DifficultyChart from '@/components/Profile/DifficultyChart';
import RecentActivity from '@/components/Profile/RecentActivity';
import ProgressChart from '@/components/Profile/ProgressChart';
import QuickActions from '@/components/Profile/QuickActions';
import SubmissionsHistory from '@/components/Profile/SubmissionsHistory';
import { CheckCircle, Code, Flame, Target } from 'lucide-react';

const ProfilePage = () => {
  const { isAuthenticated, user, isLoading: authLoading, logout } = useAuth();
  const { fetchUserSheets, userSheets, error: sheetsError } = useSheets();
  const {
    fetchAllUserSubmissions,
    allSubmissions,
    fetchStreakData,
    streakData,
    fetchPerformanceMetrics,
    performanceMetrics,
    fetchUserSolvedProblemsCount,
    problemsSolvedCount,
    fetchDifficultyStats,
    difficultyStats,
    fetchSkillsData,
    skillsData,
    isLoading: dataLoading,
    error: profileError,
  } = useProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      Promise.all([
        fetchUserSheets(),
        fetchAllUserSubmissions(),
        fetchStreakData(),
        fetchPerformanceMetrics(),
        fetchUserSolvedProblemsCount(),
        fetchDifficultyStats(),
        fetchSkillsData(),
      ]).catch((err) => {
        console.error('Error fetching profile data:', err);
      });
    }
  }, [
    isAuthenticated,
    authLoading,
    fetchUserSheets,
    fetchAllUserSubmissions,
    fetchStreakData,
    fetchPerformanceMetrics,
    fetchUserSolvedProblemsCount,
    fetchDifficultyStats,
    fetchSkillsData,
  ]);

  // Fallback success rate calculation
  const calculateSuccessRate = () => {
    if (!Array.isArray(allSubmissions) || allSubmissions.length === 0) return 0;
    const acceptedCount = allSubmissions.filter((sub) => sub.status === 'ACCEPTED').length;
    return Number((acceptedCount / allSubmissions.length * 100).toFixed(1));
  };

  // Placeholder for dynamic change calculations
 const calculateChange = (current, previous) => {
    const curr = Number(current) || 0;
    const prev = Number(previous) || 0;

    if (curr === 0 && prev === 0) return 0;
    if (prev === 0 && curr > 0) return 100;
    if (curr === 0 && prev > 0) return -100;

    const change = Math.round(((curr - prev) / prev) * 100);
    return change;
  };

  // Mock previous values (replace with backend data in future)
  const previousMetrics = {
    problemsSolved: 0,
    totalSubmissions: 0,
    streak: 0,
    successRate: 0,
  };

  const successRate = performanceMetrics?.successRate != null
    ? Number(performanceMetrics.successRate)
    : calculateSuccessRate();

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b210]"
        />
      </div>
    );
  }

  if (profileError || sheetsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
        <p className="text-red-400 mb-4">
          Error loading profile: {profileError?.message || sheetsError?.message || 'Unknown error'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';
  const isPro = user?.subscription === 'PRO';

  const links = [
    { label: 'Home', href: '/', icon: <Home className="h-5 w-5 shrink-0 text-gray-200" /> },
    { label: 'Practice Problems', href: '/problems', icon: <IconBook className="h-5 w-5 shrink-0 text-gray-200" /> },
    { label: 'Sheets Library', href: '/sheets/public', icon: <IconFileText className="h-5 w-5 shrink-0 text-gray-200" /> },
    { label: 'Roadmaps', href: '/roadmaps', icon: <Map className="h-5 w-5 shrink-0 text-gray-200" /> },
    { label: 'Featured Courses', href: '/courses', icon: <IconStar className="h-5 w-5 shrink-0 text-gray-200" /> },
    { label: 'Contribute', href: '/contribute', icon: <IconPlus className="h-5 w-5 shrink-0 text-gray-200" /> },
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

  const Logo = () => (
    <Link to="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <img src={LeetLabsLogoDark} alt="LeetLabs Logo" className="h-8 w-auto" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold whitespace-pre text-xl text-white arp-display">
        Leet<span className="text-yellow-500">Labs</span>
      </motion.span>
    </Link>
  );

  const LogoIcon = () => (
    <Link to="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <img src={LeetLabsLogoDark} alt="LeetLabs Logo" className="h-8 w-auto" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col md:flex-row satoshi">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="relative flex flex-col h-screen bg-transparent shadow-lg">
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2.5">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{ ...link, href: link.href, onClick: link.onClick || undefined }}
                  className="text-gray-200 hover:text-yellow-500 transition-all duration-300"
                />
              ))}
            </div>
          </div>
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
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="h-18.5 md:h-0"></div>
        <HeroSection
          user={user}
          isPro={isPro}
          isAdmin={isAdmin}
          performanceMetrics={{ ...performanceMetrics, successRate }}
          streakData={streakData}
          allSubmissions={allSubmissions}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <StatCard
    title="Problems Solved"
    value={problemsSolvedCount}
    change={calculateChange(problemsSolvedCount, previousMetrics.problemsSolved)}
    icon={<CheckCircle />}
    color="green"
  />
  <StatCard
    title="Total Submissions"
    value={allSubmissions.length}
    change={calculateChange(allSubmissions.length, previousMetrics.totalSubmissions)}
    icon={<Code />}
    color="yellow"
  />
  <StatCard
    title=""
    value={streakData?.current || 0}
    secondaryValue={streakData?.longest || 0}
    change={calculateChange(streakData?.current || 0, previousMetrics.streak)}
    icon={<Flame />}
    color="orange"
  />
  <StatCard
    title="Success Rate"
    value={successRate}
    change={calculateChange(successRate, previousMetrics.successRate)}
    icon={<Target />}
    color="green"
  />
</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <ProgressChart data={allSubmissions} />
          </div>
          <RecentActivity submissions={allSubmissions} />
           <div className="xl:col-span-2">
              <ActivityHeatmap data={allSubmissions} />
           </div>
          <SkillsRadar data={skillsData} />
        </div>
        <SubmissionsHistory submissions={allSubmissions} />
        <div className="mt-10">
          <QuickActions userSheets={userSheets} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;