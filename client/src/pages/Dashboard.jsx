import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  BsPlayFill,
  BsClockHistory,
  BsCheckCircleFill,
  BsBarChartLineFill,
  BsCoin,
  BsArrowRight,
  BsBriefcaseFill,
} from 'react-icons/bs';
import { ServerUrl } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const result = await axios.get(`${ServerUrl}/api/interview/get-interview`, {
          withCredentials: true,
        });
        setInterviews(result.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Compute metrics
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const avgScore =
    completedInterviews.length > 0
      ? (
          completedInterviews.reduce((acc, curr) => acc + (curr.finalScore || 0), 0) /
          completedInterviews.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        {/* WELCOME HERO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl p-8 mb-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-gray-900/60"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <BsBarChartLineFill size={12} />
                Candidate Control Center
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{userData?.name || 'Candidate'}</span>! 👋
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
                Ready to practice your next role? Track your interview stats, review past AI evaluations, and launch a new mock session.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => navigate('/career-coach')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 border border-white/10 transition"
              >
                View AI Career Coach
              </motion.button>

              <motion.button
                onClick={() => navigate('/interview')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 transition-all text-nowrap"
              >
                <BsPlayFill size={22} />
                Start New Interview
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* METRICS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Interviews</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <BsBriefcaseFill size={18} />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-['Outfit']">{totalInterviews}</div>
            <p className="text-xs text-gray-400 mt-2">{completedInterviews.length} completed sessions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average AI Score</span>
              <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
                <BsBarChartLineFill size={18} />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-['Outfit']">{avgScore} <span className="text-xs text-gray-500 font-normal">/ 10</span></div>
            <p className="text-xs text-gray-400 mt-2">Based on overall communication & correctness</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Credits Available</span>
              <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
                <BsCoin size={18} />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-['Outfit']">{userData?.credits ?? 0} <span className="text-xs text-emerald-400 font-mono font-normal">CR</span></div>
            <button
              onClick={() => navigate('/pricing')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium mt-2 flex items-center gap-1"
            >
              Get More Credits <BsArrowRight size={12} />
            </button>
          </motion.div>
        </div>

        {/* RECENT INTERVIEWS SECTION */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit']">Recent Mock Interviews</h2>
              <p className="text-xs text-gray-400 mt-1">Review performance evaluations and download detailed PDF reports</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20 transition"
            >
              View Full History <BsArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading interview records...</div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
              <BsClockHistory size={36} className="mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400 text-sm font-medium">No interview sessions found yet.</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">Start your first AI mock interview to test your technical skills.</p>
              <button
                onClick={() => navigate('/interview')}
                className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                Launch Mock Interview
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {interviews.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/report/${item._id}`)}
                  className="glass-card p-5 rounded-2xl hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                      <BsBriefcaseFill size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-emerald-400 transition">{item.role}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.experience} • {item.mode} Mode • {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end md:self-auto">
                    <div className="text-right">
                      <span className="text-lg font-bold text-emerald-400">{item.finalScore || 0}</span>
                      <span className="text-xs text-gray-500"> / 10</span>
                      <p className="text-[10px] text-gray-400">Score</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
