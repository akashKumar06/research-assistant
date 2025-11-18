import { motion } from "framer-motion";

export default function GreetingScreen({ heading, subHeading }) {
  return (
    <div className="w-4/5 m-auto flex flex-col justify-center items-center pb-32 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl font-bold text-zinc-900 dark:text-white mb-3"
      >
        {heading}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-zinc-600 dark:text-zinc-400 max-w-xl"
      >
        {subHeading}
      </motion.p>
    </div>
  );
}
