'client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl p-3 max-w-[200px] border"
          >
            <button
              className="absolute top-1 right-1 text-gray-300 hover:text-gray-500"
              onClick={() => setShowTooltip(false)}
            >
              ✕
            </button>
            <p className="text-xs text-gray-700 font-medium">Butuh bantuan?</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Chat langsung via WhatsApp untuk respon cepat!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.a
        href="https://wa.me/6281234567890?text=Halo%20Berkat%20Mandiri%20Pendingin%2C%20saya%20ingin%20bertanya."
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
        </span>
      </motion.a>
    </div>
  );
}
