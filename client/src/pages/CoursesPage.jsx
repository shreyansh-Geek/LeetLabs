// client/src/pages/ComingSoonPage.jsx
import React , { useState } from 'react';
import { Rocket, Mail } from 'lucide-react';
import { ShimmerButton } from '../components/magicui/shimmer-button';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

export default function ComingSoonPage() {

    const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);

  const handleNotifySubmission = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailStatus('success');
      setEmail('');
      setTimeout(() => setEmailStatus(null), 3000);
    } else {
      setEmailStatus('error');
      setTimeout(() => setEmailStatus(null), 3000);
    }
  };
  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col satoshi">
      <Navbar />
      {/* Beta Strip */}
      <div className="relative left-0 right-0 w-full mt-19 bg-gradient-to-r from-[#fec60b] to-[#ec9913] py-2 text-center shadow-md">
        <div className="absolute inset-0 bg-[#fec60b]/20 animate-pulse" />
        <div className="relative z-10 flex items-center justify-center gap-4 flex-wrap px-4">
          <p className="text-lg md:text-md font-medium satoshi text-black">
            <Rocket className="size-6 inline text-black mr-2" /> LeetLabs is in <span className="font-bold">Beta</span>! Join now for lifetime access to new problems, roadmaps, and premium features.
          </p>
        </div>
      </div>
      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center py-20 px-4 overflow-hidden bg-gradient-to-br from-[#111827] to-[#3b82f6]/50 satoshi ">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,178,16,0.1),transparent_50%)] opacity-50" />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl arp-display font-extrabold text-[#ffffff] mb-6 animate-fade-up">
            Courses Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-[#d1d5db] max-w-3xl mx-auto mb-10 animate-fade-up delay-200">
            Unlock your coding potential with expert-led courses on DSA, System Design, and more. Be the first to know.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-up delay-400">
            <ShimmerButton
              className="bg-[#f5b210] text-[#ffffff] hover:bg-[#f5b210]/80 text-lg px-8 py-3 rounded-full  font-medium shadow-[0_8px_24px_rgba(59,130,246,0.3)] transition-transform hover:scale-105"
              onClick={() => (window.location.href = '/signup')}
            >
              Join Waitlist
            </ShimmerButton>
            <ShimmerButton
              className="bg-transparent border-2 border-[#f5b210] text-[#f5b210] hover:bg-[#f5b210]/10 text-lg px-8 py-3 rounded-full font-satoshi font-medium transition-transform hover:scale-105"
              onClick={() => (window.location.href = '/')}
            >
              Learn More
            </ShimmerButton>
          </div>
          {/* Waitlist Form */}
          <div className="mt-12 max-w-md mx-auto animate-fade-up delay-600">
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleNotifySubmission}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-[#ffffff]/10 text-[#ffffff] placeholder-[#d1d5db] border border-[#ffffff]/20 focus:outline-none focus:ring-2 focus:ring-[#f5b210] font-satoshi"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#f5b210] text-[#111827] font-satoshi font-medium hover:bg-[#f5b210]/80 transition-transform hover:scale-105"
              >
                <Mail className="size-5 inline mr-2" /> Notify Me
              </button>
              {emailStatus === 'success' && (
                  <p className="text-sm text-green-400 satoshi ">
                    Subscribed successfully!
                  </p>
                )}
                {emailStatus === 'error' && (
                  <p className="text-sm text-red-400 satoshi">
                    Please enter a valid email.
                  </p>
                )}
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}