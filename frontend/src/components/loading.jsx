import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Loading({ next }) {
  useEffect(() => {
    const t = setTimeout(next, 2500);
    return () => clearTimeout(t);
  }, [next]);

  return (
    <div className="p-6 text-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="text-6xl mb-6 text-red-600"
      >
        🧠
      </motion.div>

      <h2 className="font-semibold mb-2 text-blue-700">
        Analyzing Symptoms
      </h2>

      <p className="text-sm text-gray-600">
        Our AI is processing your medical profile…
      </p>
    </div>
  );
}
