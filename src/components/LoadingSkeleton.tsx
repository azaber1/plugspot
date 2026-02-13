import { motion } from 'framer-motion';

export const ChargerCardSkeleton = () => {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-24 mb-4"></div>
      <div className="h-6 bg-gray-700 rounded w-20 mb-4"></div>
      <div className="h-3 bg-gray-700 rounded w-16 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-20"></div>
    </div>
  );
};

export const DetailPageSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="glass-card p-6">
        <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};
