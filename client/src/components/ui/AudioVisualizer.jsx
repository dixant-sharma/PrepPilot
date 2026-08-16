import React from 'react';
import { motion } from 'framer-motion';

function AudioVisualizer({ isPlaying = false, barCount = 12 }) {
  const bars = Array.from({ length: barCount });

  return (
    <div className="flex items-center justify-center gap-1.5 h-10 px-4 py-2 bg-emerald-950/40 rounded-full border border-emerald-500/20">
      {bars.map((_, index) => (
        <motion.div
          key={index}
          className="w-1.5 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full"
          animate={
            isPlaying
              ? {
                  height: [
                    `${Math.floor(Math.random() * 8 + 6)}px`,
                    `${Math.floor(Math.random() * 24 + 10)}px`,
                    `${Math.floor(Math.random() * 8 + 4)}px`,
                  ],
                }
              : { height: '6px' }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.4 + (index % 3) * 0.15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

export default AudioVisualizer;
