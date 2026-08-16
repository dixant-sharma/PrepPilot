import React, { useState } from 'react';
import { BsRobot } from 'react-icons/bs';
import { IoSparkles } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Auth({ isModel = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleAuth = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const name = User.displayName;
      const email = User.email;
      const idToken = await User.getIdToken();

      const result = await axios.post(
        ServerUrl + '/api/auth/google',
        { name, email, token: idToken },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));

      if (!isModel) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google Auth Error:', error);
      let msg = 'Google authentication failed. Please try again.';
      if (error.code === 'auth/invalid-api-key') {
        msg = 'Invalid Firebase API Key. Please verify VITE_FIREBASE_APIKEY in .env.';
      } else if (error.code === 'auth/unauthorized-domain') {
        msg = 'This domain is not authorized for Google Sign-In in Firebase Console.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in popup was closed before completing.';
      } else if (error.message) {
        msg = error.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full ${
        isModel
          ? 'py-2'
          : 'min-h-screen bg-[#0B0F17] flex items-center justify-center px-6 py-20 selection:bg-emerald-500 selection:text-white'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`w-full ${
          isModel ? 'max-w-md p-8 rounded-3xl' : 'max-w-lg p-10 md:p-12 rounded-[32px]'
        } glass-panel border border-white/10 shadow-2xl relative overflow-hidden bg-gray-900/80`}
      >
        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
              <BsRobot size={20} />
            </div>
            <h2 className="font-extrabold text-white text-xl tracking-tight font-['Outfit']">
              PrepPilot <span className="text-emerald-400">AI</span>
            </h2>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-center text-white leading-snug mb-4 font-['Outfit']">
            Accelerate with{' '}
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-flex items-center gap-2 text-xl font-semibold mt-2">
              <IoSparkles size={16} />
              PrepPilot AI Engine
            </span>
          </h1>

          <p className="text-gray-400 text-center text-sm md:text-base leading-relaxed mb-6">
            Sign in to launch AI-simulated mock interviews, track skill progression, and unlock comprehensive performance analytics.
          </p>

          {errorMessage && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
              {errorMessage}
            </div>
          )}

          <motion.button
            onClick={handleGoogleAuth}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-3.5 py-3.5 px-6 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 font-bold rounded-2xl shadow-xl transition-all text-sm md:text-base cursor-pointer"
          >
            <FcGoogle size={22} />
            {loading ? 'Authenticating...' : 'Continue with Google'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;
