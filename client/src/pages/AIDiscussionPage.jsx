// client/src/pages/AIDiscussionPage.jsx
import { Rocket} from 'lucide-react';
import { ShimmerButton } from '../components/magicui/shimmer-button';
import { HoverEffect} from '../components/ui/card-hover-effect'; // Adjust path
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
// Placeholder image (replace with actual LeetBot screenshot)
import leetbotScreenshot from '../assets/pages/leetbot-screenshot.jpg';

export default function AIDiscussionPage() {

    const upcomingFeatures = [
    {
      title: 'Personalized Roadmaps',
      description: 'AI-crafted coding roadmaps tailored to your goals and skill level.',
      link: '/roadmaps',
    },
    {
      title: 'Adaptive Learning Paths',
      description: 'Dynamic learning paths that evolve with your progress.',
      link: '/signup',
    },
    {
      title: 'Advanced AI Integrations',
      description: 'Next-gen AI tools to boost your coding and learning efficiency.',
      link: '/signup',
    },
  ];


  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col font-satoshi">
      <Navbar />
      {/* Beta Strip */}
      <div className="relative left-0 right-0 w-full mt-19 bg-gradient-to-r from-[#fec60b] to-[#ec9913] py-2 text-center shadow-md">
        <div className="absolute inset-0 bg-[#fec60b]/20 animate-pulse" />
        <div className="relative z-10 flex items-center justify-center gap-4 flex-wrap px-4">
          <p className="text-lg md:text-md font-medium satoshi text-[#000000]">
            <Rocket className="size-6 inline text-[#000000] mr-2" /> LeetLabs is in <span className="font-bold">Beta</span>! Join now for lifetime access to new problems, roadmaps, and premium features.
          </p>
        </div>
      </div>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center py-20 px-4 overflow-hidden bg-gradient-to-br from-[#111827] to-[#3b82f6]/40 satoshi">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,178,16,0.1),transparent_50%)] opacity-50" />
        <div className="relative z-10 max-w-6xl mx-auto text-center ">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-5xl md:text-6xl font-arpdisplay font-extrabold text-[#ffffff] mb-6 arp-display"
          >
            Revolutionize Coding with AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-xl md:text-xl text-[#d1d5db] max-w-3xl mx-auto mb-10"
          >
            Chat with <span className="font-bold">LeetBot</span> in real-time, now live in your workspace. Soon, unlock personalized AI roadmaps and adaptive learning paths.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <ShimmerButton
              className="bg-[#f5b210] text-[#ffffff] hover:bg-[#f5b210]/80 text-md px-7 py-3 rounded-full font-satoshi font-medium shadow-[0_8px_24px_rgba(245,178,16,0.3)] transition-transform hover:scale-105"
              onClick={() => (window.location.href = '/problems')}
            >
              Try LeetBot Now
            </ShimmerButton>
            <ShimmerButton
              className="bg-transparent border-2 border-[#f5b210] text-[#f5b210] hover:bg-[#f5b210]/10 text-md px-7 py-3 rounded-full font-bold transition-transform hover:scale-105"
              onClick={() => document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' })}
            >
              Join Waitlist
            </ShimmerButton>
          </motion.div>
        </div>
      </section>
      {/* LeetBot Section */}
      <section className="py-16 px-4 bg-[#ffffff]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1"
          >
            <h2 className="text-4xl md:text-5xl font-arpdisplay font-bold text-[#111827] mb-6">
              Meet LeetBot: Your Coding Companion
            </h2>
            <p className="text-lg text-[#4b5563] satoshi mb-6">
              Engage in real-time coding discussions with <span className="font-bold">LeetBot</span>, now live in the LeetLabs workspace. Get instant feedback, debug code, and master concepts with 24/7 AI support.
            </p>
            <ShimmerButton
              className="bg-[#f5b210] text-[#ffffff] hover:bg-[#f5b210]/80 text-lg px-8 py-3 rounded-full font-satoshi font-medium shadow-[0_8px_24px_rgba(59,130,246,0.3)] transition-transform hover:scale-105"
              onClick={() => (window.location.href = '/problems')}
            >
              Explore LeetBot
            </ShimmerButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1"
          >
            <img
              src={leetbotScreenshot}
              alt="LeetBot in action"
              className="w-full rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
            />
          </motion.div>
        </div>
      </section>
      {/* Upcoming Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#ffffff] to-[#3b82f6]/5 satoshi">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-4xl md:text-4xl arp-display font-bold text-[#111827] mb-4"
          >
            AI-Powered Features Coming Soon
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-lg text-[#4b5563] satoshi mb-12 max-w-3xl mx-auto"
          >
            Discover the next generation of AI tools designed to elevate your coding journey.
          </motion.p>
          <HoverEffect
            items={upcomingFeatures}
            className="py-0"
          />
          
        </div>
      </section>

     
      <Footer />
    </div>
  );
}