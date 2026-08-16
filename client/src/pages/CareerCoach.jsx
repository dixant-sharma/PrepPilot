import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BsRobot, BsLightningChargeFill, BsBullseye, BsCheckCircleFill, BsExclamationTriangleFill, BsPlayFill } from 'react-icons/bs';

function CareerCoach() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const result = await axios.get(`${ServerUrl}/api/user/career-insights`, {
          withCredentials: true,
        });
        setInsights(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const chartData = (insights?.careerHistory || []).map((h, i) => ({
    name: `Session ${i + 1}`,
    score: h.readinessScore || 0,
  }));

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-8">
        {/* HEADER BANNER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <BsRobot size={14} />
              AI Interview Memory & Career Coach
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              Your Personalized AI Career Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Tracks performance patterns across mock interviews and provides tailored improvement guidance.
            </p>
          </div>

          <button
            onClick={() => navigate('/interview')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
          >
            <BsPlayFill size={18} /> Start Recommended Practice Session
          </button>
        </div>

        {loading ? (
          <SkeletonLoader count={3} type="card" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: READINESS & COACH ADVICE */}
            <div className="space-y-8">
              {/* READINESS GAUGE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-8 text-center border border-white/10 relative overflow-hidden"
              >
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Overall Career Readiness Score</h3>

                <div className="w-32 h-32 mx-auto relative">
                  <CircularProgressbar
                    value={insights?.readinessScore || 70}
                    text={`${insights?.readinessScore || 70}%`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: '#10B981',
                      textColor: '#FFFFFF',
                      trailColor: 'rgba(255,255,255,0.08)',
                    })}
                  />
                </div>

                <p className="text-xs text-emerald-400 font-bold mt-4 font-['Outfit']">
                  Target Role Readiness Rating
                </p>
              </motion.div>

              {/* PERSONALIZED AI COACH ADVICE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/20 relative space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <BsLightningChargeFill size={14} />
                  <span>AI Career Coach Direct Memory Insight</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed font-medium">
                  "{insights?.coachingAdvice || 'Complete interviews to receive AI coaching feedback.'}"
                </p>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: PROGRESSION & WEAKNESS BREAKDOWN */}
            <div className="lg:col-span-2 space-y-8">
              {/* HISTORICAL TREND CHART */}
              {chartData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="glass-panel rounded-3xl p-8 border border-white/10"
                >
                  <h3 className="text-base font-bold text-white mb-6 font-['Outfit']">Historical Performance Trend</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="trendColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis domain={[0, 100]} stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#111827',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                          }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#10B981" fillOpacity={1} fill="url(#trendColor)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* WEAK AREAS & RECOMMENDED PRACTICE */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* WEAK AREAS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4"
                >
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BsExclamationTriangleFill size={14} />
                    Identified Weak Skill Areas
                  </h4>

                  {insights?.weakAreas?.length > 0 ? (
                    <div className="space-y-2">
                      {insights.weakAreas.map((item, idx) => (
                        <div key={idx} className="bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs p-3 rounded-xl font-medium">
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No significant weak areas recorded yet.</p>
                  )}
                </motion.div>

                {/* RECOMMENDED PRACTICE */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4"
                >
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BsBullseye size={14} />
                    Recommended Practice Focus
                  </h4>

                  {insights?.recommendedPractice?.length > 0 ? (
                    <div className="space-y-2">
                      {insights.recommendedPractice.map((rec, idx) => (
                        <div key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs p-3 rounded-xl font-medium flex items-center gap-2">
                          <BsCheckCircleFill className="text-emerald-400 shrink-0" size={12} />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Complete mock sessions to generate practice recommendations.</p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CareerCoach;
