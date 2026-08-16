import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '₹0',
      credits: 100,
      description: 'Ideal for testing PrepPilot AI mock interview capabilities.',
      features: [
        '100 AI Interview Credits',
        '2 Full Mock Interviews',
        'Voice Speech Synthesis',
        'Standard Performance Report',
      ],
      default: true,
    },
    {
      id: 'basic',
      name: 'Starter Pack',
      price: '₹100',
      credits: 150,
      description: 'Great for focused preparation before active job interviews.',
      features: [
        '150 AI Interview Credits',
        '3 Full Mock Interviews',
        'Detailed AI Evaluation',
        'PDF Performance Export',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      price: '₹500',
      credits: 650,
      description: 'Best value package for comprehensive career acceleration.',
      features: [
        '650 AI Interview Credits',
        '13 Full Mock Interviews',
        'Priority OpenRouter Processing',
        'Comprehensive Analytics Hub',
      ],
      badge: 'Best Value',
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setLoadingPlan(null);
        return;
      }

      const result = await axios.post(
        `${ServerUrl}/api/payment/order`,
        { planId: plan.id },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: 'INR',
        name: 'PrepPilot AI',
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          try {
            const verifypay = await axios.post(
              `${ServerUrl}/api/payment/verify`,
              response,
              { withCredentials: true }
            );
            dispatch(setUserData(verifypay.data.user));

            alert('Payment Successful 🎉 Credits Added!');
            navigate('/dashboard');
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            alert(verifyErr.response?.data?.message || 'Payment verification failed');
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
          },
        },
        theme: {
          color: '#10b981',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoadingPlan(null);
    } catch (error) {
      console.error('Error starting payment:', error);
      alert(error.response?.data?.message || 'Failed to start payment');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 rounded-2xl glass-card border border-white/10 text-gray-300 hover:text-white hover:border-emerald-500/40 transition"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
                PrepPilot AI Credits & Pricing
              </h1>
              <p className="text-xs text-gray-400 mt-1">Select an interview credit package to unlock AI mock sessions</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                whileHover={!plan.default ? { y: -6 } : {}}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`glass-panel rounded-3xl p-8 transition-all duration-300 border relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10 bg-gray-900/90'
                    : 'border-white/10 hover:border-white/20'
                } ${plan.default ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {plan.badge && (
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                {plan.default && (
                  <div className="absolute top-6 right-6 bg-white/10 text-gray-400 text-[10px] font-semibold px-3 py-1 rounded-full border border-white/10">
                    Default
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white font-['Outfit']">{plan.name}</h3>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-emerald-400 font-['Outfit']">{plan.price}</span>
                    <span className="text-xs text-gray-400">/ {plan.credits} Credits</span>
                  </div>

                  <p className="text-gray-400 mt-3 text-xs leading-relaxed">{plan.description}</p>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FaCheckCircle className="text-emerald-400 text-xs shrink-0" />
                        <span className="text-gray-300 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {!plan.default && (
                  <button
                    disabled={loadingPlan === plan.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSelectedPlan(plan.id);
                      } else {
                        handlePayment(plan);
                      }
                    }}
                    className={`w-full mt-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/20'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {loadingPlan === plan.id ? 'Processing Order...' : isSelected ? 'Proceed to Razorpay Checkout' : 'Select Package'}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Pricing;
