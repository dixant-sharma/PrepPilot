import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import Auth from '../pages/Auth';

function AuthModal({ onClose }) {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white text-xl z-20 p-2 rounded-full hover:bg-white/10 transition"
        >
          <FaTimes size={18} />
        </button>
        <Auth isModel={true} />
      </div>
    </div>
  );
}

export default AuthModal;
