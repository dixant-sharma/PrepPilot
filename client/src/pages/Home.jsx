import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BsRobot,
  BsMicFill,
  BsFileEarmarkPdfFill,
  BsBarChartLineFill,
  BsLightningChargeFill,
  BsShieldCheck,
  BsCheck2Circle,
  BsArrowRight,
  BsPlayCircleFill,
} from 'react-icons/bs';
import { HiSparkles } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleStartInterview = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate('/interview');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Badge Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-semibold mb-8 shadow-lg shadow-emerald-500/10"
          >
            <HiSparkles size={16} className="text-emerald-400" />
            <span>AI-Powered Interview Intelligence & Career Acceleration</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto font-['Outfit']"
          >
            Master Your Next Interview with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              PrepPilot AI
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
          >
            Simulate realistic role-based mock interviews with dynamic follow-up questioning, real-time speech evaluation, and actionable performance reports.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 mt-10"
          >
            <button
              onClick={handleStartInterview}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 transition-all text-sm md:text-base hover:scale-105"
            >
              <BsPlayCircleFill size={20} />
              Launch Free Interview Session
            </button>

            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate('/dashboard');
              }}
              className="glass-card hover:bg-white/10 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-2xl border border-white/15 transition-all text-sm md:text-base flex items-center gap-2"
            >
              Go to Candidate Portal
              <BsArrowRight size={16} />
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center items-center gap-10 text-gray-400 text-xs md:text-sm"
          >
            <div className="flex items-center gap-2">
              <BsShieldCheck className="text-emerald-400" size={16} />
              <span>Role-Tailored Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <BsMicFill className="text-teal-400" size={16} />
              <span>Real-Time Voice Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <BsFileEarmarkPdfFill className="text-cyan-400" size={16} />
              <span>Instant PDF Performance Scorecard</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            How <span className="text-emerald-400">PrepPilot AI</span> Prepares You
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
            A three-step AI workflow engineered to build interview confidence and elevate technical articulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: 'STEP 01',
              title: 'Role & Resume Setup',
              desc: 'Select your job role, experience tier, and upload your PDF resume for personalized question matching.',
              icon: <BsFileEarmarkPdfFill size={24} className="text-emerald-400" />,
              color: 'from-emerald-500/20 to-emerald-500/5',
            },
            {
              step: 'STEP 02',
              title: 'Interactive Studio Session',
              desc: 'Engage in a timer-backed voice & text interview with speech synthesis AI avatars and dynamic feedback.',
              icon: <BsMicFill size={24} className="text-teal-400" />,
              color: 'from-teal-500/20 to-teal-500/5',
            },
            {
              step: 'STEP 03',
              title: 'Analytics & PDF Export',
              desc: 'Receive question-by-question scoring, confidence metrics, and download an executive performance PDF.',
              icon: <BsBarChartLineFill size={24} className="text-cyan-400" />,
              color: 'from-cyan-500/20 to-cyan-500/5',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all group relative"
            >
              <div className="text-[10px] font-extrabold text-emerald-400 tracking-widest mb-4 bg-emerald-500/10 px-3 py-1 rounded-full w-fit border border-emerald-500/20">
                {item.step}
              </div>
              <div className="p-3 bg-white/5 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-['Outfit']">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES GRID SECTION */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Enterprise-Grade <span className="text-teal-400">AI Capabilities</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Everything you need to practice, diagnose weaknesses, and succeed in technical and behavioral rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'AI Answer Evaluation Engine',
              desc: 'Evaluates each response across Confidence, Communication clarity, and Technical correctness on a 10-point scale.',
              icon: <BsLightningChargeFill size={22} className="text-emerald-400" />,
            },
            {
              title: 'Resume & Job Context Parsing',
              desc: 'Extracts skills and projects from uploaded PDF resumes using PDF.js and LLM analysis to ask job-relevant questions.',
              icon: <BsFileEarmarkPdfFill size={22} className="text-teal-400" />,
            },
            {
              title: 'Voice & Speech Synthesis',
              desc: 'Features natural speech synthesis text-to-speech reading with lip-synced video avatars and speech-to-text recording.',
              icon: <BsMicFill size={22} className="text-cyan-400" />,
            },
            {
              title: 'Downloadable Executive PDF Reports',
              desc: 'Generates professional vector PDF performance summaries complete with skill breakdown tables and custom improvement tips.',
              icon: <BsBarChartLineFill size={22} className="text-emerald-400" />,
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all flex items-start gap-5"
            >
              <div className="p-3 bg-emerald-500/10 rounded-2xl shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM BANNER */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-10 md:p-14 text-center border border-white/10 relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-gray-900 to-teal-950/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
              Ready to Ace Your Next Tech Interview?
            </h2>
            <p className="text-gray-300 text-base md:text-lg mt-4 max-w-xl mx-auto">
              Join thousands of job seekers preparing with PrepPilot AI. Get 100 free credits upon sign up.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleStartInterview}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-9 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all text-base hover:scale-105"
              >
                Start Interview Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  );
}

export default Home;
