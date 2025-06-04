import React from 'react';
import { Users, Rocket } from 'lucide-react';
import { IconUserStar } from '@tabler/icons-react';
import { cn, apiFetch } from '../lib/utils';
import { PricingColumn } from '../components/ui/pricing-column.jsx';
import { Section } from '../components/ui/section.jsx';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { toast } from 'sonner';
import { useAuth } from '../lib/auth';

const pricingPlans = [
  {
    name: 'Freemium',
    description: 'Perfect for beginners starting their coding journey',
    price: 0,
    priceNote: 'No Payment. Free Lifetime access.',
    cta: { variant: 'glow', label: 'Get Started', action: 'signup' },
    features: [
      'Access to 100+ coding problems',
      'Community sheets and challenges',
      'Basic Platform roadmaps',
      'Limited 1 month of AI discussion access',
      'Basic Progress tracking and analytics',
    ],
    variant: 'default',
    className: 'hidden lg:flex',
  },
  {
    name: 'Pro',
    icon: <IconUserStar className="size-5" />,
    description: 'For serious coders and job seekers aiming to excel',
    price: 1999,
    priceNote: 'One-time payment. Lifetime access.',
    cta: { variant: 'glow-brand', label: 'Unlock Pro', action: 'subscribe' },
    features: [
      'Access to 500+ coding problems',
      'Premium Sheets and Challenges',
      'Personalized learning paths with AI',
      'Priority support',
      'Limited 6 months of AI discussion access',
      'Advanced Progress tracking and analytics',
    ],
    variant: 'glow-brand',
  },
  {
    name: 'Premium',
    icon: <Users className="size-4" />,
    description: 'For the elite coders and tech enthusiasts',
    price: 4999,
    priceNote: 'One-time payment. Lifetime access.',
    cta: { variant: 'glow', label: 'Go Premium', action: 'subscribe' },
    features: [
      'Unlimited access to all coding problems',
      'Premium Sheets and Challenges',
      'Personalized learning paths with AI',
      '1:1 mentorship sessions',
      'Unlimited AI discussion access',
      'Advanced Progress tracking and analytics',
    ],
    variant: 'glow',
  },
];

export default function PricingPage() {
  const { isAuthenticated } = useAuth();

  const handleCtaClick = async (action, planName, price) => {
    if (action === 'signup') {
      window.location.href = '/signup';
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to subscribe');
      window.location.href = '/login';
      return;
    }

    try {
      const amount = price * 100; // Convert to paise
      const response = await apiFetch('/payments/order', 'POST', { planName, amount });

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: response.keyId,
          amount: response.amount,
          currency: 'INR',
          order_id: response.orderId,
          name: 'LeetLabs',
          description: `${planName} Plan`,
          handler: async (paymentResponse) => {
            try {
              const verifyResponse = await apiFetch('/payments/order', 'POST', {
                planName,
                amount,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              });
              toast.success(verifyResponse.message);
              window.location.href = '/profile';
            } catch (error) {
              toast.error('Payment failed: ' + (error.data?.message || 'Verification failed'));
            }
          },
          theme: { color: '#f5b210' },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', () => toast.error('Payment cancelled or failed'));
        rzp.open();
      };
    } catch (error) {
      toast.error('Error: ' + (error.data?.message || 'Unable to process payment'));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <Section className="py-12 mx-0 mt-6">
        <div className="relative left-0 right-0 w-full bg-gradient-to-r from-[#fec60b] to-[#ec9913] py-2 text-center shadow-md">
          <div className="absolute inset-0 bg-[#fec60b] animate-pulse" />
          <div className="relative z-10 flex items-center justify-center gap-4 flex-wrap px-4">
            <p className="text-lg md:text-md font-medium satoshi">
              <Rocket className="size-6 inline" /> LeetLabs is in <span className="font-bold">Beta</span>! Join now for lifetime access to new problems, roadmaps, and premium features.
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 mt-10">
          <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
            <h2 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight text-[#000000] arp-display">
              Unlock Your Coding Potential
            </h2>
            <p className="text-md text-gray-500 max-w-[600px] font-medium sm:text-xl satoshi">
              Choose a plan that fits your goals. Get lifetime access to LeetLabs resources with no recurring fees.
            </p>
          </div>
          <div className="max-w-container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 satoshi">
            {pricingPlans.map((plan) => (
              <PricingColumn
                key={plan.name}
                name={plan.name}
                icon={plan.icon}
                description={plan.description}
                price={plan.price}
                priceNote={plan.priceNote}
                cta={plan.cta}
                features={plan.features}
                variant={plan.variant}
                className={cn(plan.className, 'border-[#f5b210] outline-[#f5b210]')}
                onCtaClick={() => handleCtaClick(plan.cta.action, plan.name, plan.price)}
              />
            ))}
          </div>
        </div>
      </Section>
      <Footer />
    </div>
  );
}