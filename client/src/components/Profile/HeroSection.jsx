import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Trophy, Flame, Target, Zap, Crown, Shield } from 'lucide-react';
import Avatar from 'boring-avatars';
import { ShimmerButton } from '@/components/magicui/shimmer-button'; 

const HeroSection = ({ user, isPro, isAdmin, performanceMetrics, streakData }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative mb-8 bg-gradient-to-r from-yellow-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl p-8 border border-neutral-700/50 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-purple-500/5 backdrop-blur-3xl"></div>
    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
      <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
        <Avatar
          size={120}
          name={user?.name || 'Guest'}
          variant="beam"
          colors={['#f5b210', '#166534', '#ef4444', '#3b82f6', '#ffffff']}
          className="border-4 border-yellow-500 rounded-full shadow-2xl"
        />
      </motion.div>
      <div className="flex-1 text-center lg:text-left">
        <div className="flex items-center gap-3 justify-center lg:justify-start mb-2">
          <h1 className="text-4xl font-bold text-white arp-display">{user?.name || 'Guest'}</h1>
          {isPro && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
              <Crown className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-bold">PRO</span>
            </div>
          )}
          {isAdmin && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Shield className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-bold">ADMIN</span>
            </div>
          )}
        </div>
        <p className="text-gray-300 mb-4 flex items-center justify-center lg:justify-start gap-2">
          <Mail className="h-5 w-5 text-yellow-500" />
          {user?.email || 'email@example.com'}
        </p>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 rounded-xl">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-white">Rank #{performanceMetrics.ranking || 0}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 rounded-xl">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-white">{streakData.current || 0} day streak</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 rounded-xl">
            <Target className="h-5 w-5 text-green-500" />
            <span className="text-white">{performanceMetrics.successRate || 0}% success rate</span>
          </div>
        </div>
        {!isPro && (
          <Link to="/pricing">
            <ShimmerButton
              shimmerColor="#f5b210"
              borderRadius="12px"
              shimmerSize="0.15em"
              background="linear-gradient(45deg, #000000, #1a1a1a)"
              className="h-12 px-8 text-base font-semibold text-white flex items-center gap-2"
            >
              <Zap className="h-5 w-5" />
              Upgrade to Pro
            </ShimmerButton>
          </Link>
        )}
      </div>
    </div>
  </motion.div>
);

export default HeroSection;