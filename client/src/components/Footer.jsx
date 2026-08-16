import React from 'react';
import { BsRobot } from 'react-icons/bs';

function Footer() {
  return (
    <footer className="bg-[#0B0F17] flex justify-center px-4 pb-12 pt-12 border-t border-white/5">
      <div className="w-full max-w-6xl glass-panel rounded-3xl p-8 text-center border border-white/10 relative overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
              <BsRobot size={20} />
            </div>
            <h2 className="font-extrabold text-white text-xl tracking-tight font-['Outfit']">
              PrepPilot <span className="text-emerald-400">AI</span>
            </h2>
          </div>

          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed mb-6">
            An AI-powered interview preparation platform that simulates real interviews,
            analyzes candidate performance, and provides personalized improvement insights.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 border-t border-white/5 pt-6 w-full max-w-2xl mx-auto">
            <span>© {new Date().getFullYear()} PrepPilot AI. All rights reserved.</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Contact Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
