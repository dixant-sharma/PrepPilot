import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { FaArrowLeft } from 'react-icons/fa';
import { BsClockHistory, BsBriefcaseFill, BsArrowRight } from 'react-icons/bs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
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

    getMyInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 rounded-2xl glass-card border border-white/10 text-gray-300 hover:text-white hover:border-emerald-500/40 transition"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                Interview Practice History
              </h1>
              <p className="text-xs text-gray-400 mt-1">Review past AI mock sessions and access detailed performance analytics</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading interview records...</div>
        ) : interviews.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-white/10 my-8">
            <BsClockHistory size={40} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-300 text-sm font-semibold">No interviews completed yet.</p>
            <p className="text-xs text-gray-500 mt-1 mb-6">Launch a new session to test your skills and build your history.</p>
            <button
              onClick={() => navigate('/interview')}
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition"
            >
              Start New Interview
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {interviews.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/report/${item._id}`)}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <BsBriefcaseFill size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition font-['Outfit']">
                      {item.role}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Experience: {item.experience} • Track: {item.mode} Mode
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Completed on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end md:self-auto">
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-400 font-['Outfit']">{item.finalScore || 0}</span>
                    <span className="text-xs text-gray-500"> / 10</span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Overall Score</p>
                  </div>

                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}
                  >
                    {item.status}
                  </span>

                  <BsArrowRight size={18} className="text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default InterviewHistory;
