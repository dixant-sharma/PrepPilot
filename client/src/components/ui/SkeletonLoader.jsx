import React from 'react';

function SkeletonLoader({ count = 3, type = 'card' }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`glass-panel border border-white/5 rounded-2xl bg-white/5 p-6 ${
            type === 'card' ? 'h-32' : type === 'chart' ? 'h-64' : 'h-20'
          }`}
        >
          <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
          <div className="h-3 bg-white/5 rounded w-2/3 mb-2" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
