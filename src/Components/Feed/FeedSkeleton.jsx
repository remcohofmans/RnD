import React from 'react';
import { Sparkle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-rose-900 mb-4 mt-10 tracking-tight">
            Ontdek je Match
          </h1>
          <p className="text-xl text-rose-700 max-w-2xl mx-auto flex items-center justify-between">
            <Sparkle />
            Spin het wiel en laat het toeval je naar de ware verbinding leiden
            <Sparkle />
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Wheel Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-rose-700 rounded-2xl shadow-xl p-8 flex flex-col items-center"
          >
            <div className="relative w-full max-w-md mb-8">
              <div className="w-64 h-64 bg-rose-300 rounded-full animate-pulse"></div>
              <motion.button
                className="absolute inset-0 w-32 h-32 m-auto rounded-full 
                  bg-gradient-to-br from-rose-500 to-rose-700 
                  shadow-[0_12px_0_#9f1239] border-4 border-rose-300 
                  text-white font-bold z-10 
                  flex items-center justify-center 
                  pulse-animation
                  active:translate-y-[6px] active:shadow-[0_6px_0_#9f1239]
                  hover:brightness-110 
                  transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-2xl tracking-wider"
                disabled
              >
                SPIN
              </motion.button>
            </div>
          </motion.div>

          {/* User Card Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-rose-700 rounded-2xl p-8 flex flex-col items-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                className="text-center text-rose-100 p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full max-w-xs mx-auto">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-24 w-24 bg-rose-300 rounded-full"></div>
                    <div className="w-3/4 bg-rose-300 h-6 mt-6 rounded"></div>
                    <div className="w-1/2 bg-rose-300 h-6 mt-2 rounded"></div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeedSkeleton;
