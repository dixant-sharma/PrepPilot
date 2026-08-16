import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BsRobot, BsCoin, BsLightningChargeFill } from 'react-icons/bs';
import { HiOutlineLogout, HiOutlineViewGrid, HiOutlineClock, HiOutlineCreditCard } from 'react-icons/hi';
import { FaUserAstronaut } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModal from './AuthModal';

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + '/api/auth/logout', { withCredentials: true });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-[#0B0F17] flex justify-center px-4 pt-6 pb-2 sticky top-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-6xl glass-panel rounded-2xl px-6 py-3.5 flex justify-between items-center relative shadow-2xl border border-white/10"
      >
        {/* LOGO BRAND */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <BsRobot size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1.5 font-['Outfit']">
              PrepPilot <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">AI</span>
            </h1>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => navigate('/')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>
          {userData && (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/dashboard') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/career-coach')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/career-coach') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                AI Coach
              </button>
            </>
          )}
          <button
            onClick={() => navigate('/pricing')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/pricing') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Pricing
          </button>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-4 relative">
          {/* CREDITS COUNTER */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-emerald-300 hover:border-emerald-400/60 transition-all glow-emerald"
            >
              <BsCoin size={16} className="text-emerald-400" />
              <span>{userData?.credits ?? 0}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">CR</span>
            </button>

            {showCreditPopup && (
              <div className="absolute right-0 mt-3 w-72 glass-panel shadow-2xl border border-white/10 rounded-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold text-sm">
                  <BsLightningChargeFill size={16} />
                  <span>Interview Credit Balance</span>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  You currently have <strong className="text-white">{userData?.credits || 0} credits</strong>. Mock interviews cost 50 credits per session.
                </p>
                <button
                  onClick={() => {
                    setShowCreditPopup(false);
                    navigate('/pricing');
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium py-2 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Buy Credit Package
                </button>
              </div>
            )}
          </div>

          {/* USER PROFILE / AUTH BUTTON */}
          <div className="relative">
            {userData ? (
              <button
                onClick={() => {
                  setShowUserPopup(!showUserPopup);
                  setShowCreditPopup(false);
                }}
                className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md hover:scale-105 transition-all border border-white/20"
              >
                {userData?.name ? userData.name.slice(0, 1).toUpperCase() : 'U'}
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/15 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
              >
                <FaUserAstronaut size={14} className="text-emerald-400" />
                Sign In
              </button>
            )}

            {showUserPopup && (
              <div className="absolute right-0 mt-3 w-56 glass-panel shadow-2xl border border-white/10 rounded-2xl p-4 z-50">
                <div className="pb-3 border-b border-white/10 mb-2">
                  <p className="text-sm font-bold text-white truncate">{userData?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowUserPopup(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-left text-sm py-2 px-3 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white flex items-center gap-2.5 transition-all"
                >
                  <HiOutlineViewGrid size={18} className="text-emerald-400" />
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    setShowUserPopup(false);
                    navigate('/history');
                  }}
                  className="w-full text-left text-sm py-2 px-3 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white flex items-center gap-2.5 transition-all"
                >
                  <HiOutlineClock size={18} className="text-teal-400" />
                  Interview History
                </button>

                <button
                  onClick={() => {
                    setShowUserPopup(false);
                    navigate('/pricing');
                  }}
                  className="w-full text-left text-sm py-2 px-3 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white flex items-center gap-2.5 transition-all"
                >
                  <HiOutlineCreditCard size={18} className="text-cyan-400" />
                  Buy Credits
                </button>

                <div className="pt-2 border-t border-white/10 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm py-2 px-3 hover:bg-red-500/10 rounded-lg text-red-400 flex items-center gap-2.5 transition-all font-medium"
                  >
                    <HiOutlineLogout size={18} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Navbar;
