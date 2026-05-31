"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/app-context";

export function ToastBar() {
  const { toastMsg } = useApp();
  return (
    <AnimatePresence>
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-turquoise/30 bg-navy px-6 py-3 text-sm font-medium text-white shadow-glass-lg"
        >
          {toastMsg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
