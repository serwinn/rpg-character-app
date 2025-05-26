import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizeMap = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex justify-center items-center p-4">
      <motion.div
        className={`${sizeMap[size]} rounded-full border-t-amber-800 border-r-amber-600 border-b-amber-400 border-l-amber-200`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LoadingSpinner;