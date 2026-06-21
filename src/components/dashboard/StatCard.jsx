import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  color,
  icon: Icon,
  subtitle,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        scale: 1.03,
        y: -6,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        relative
        overflow-hidden
        bg-white/5
        backdrop-blur-xl
        rounded-3xl
        p-8
        border
        border-white/10
        shadow-xl
        hover:border-white/20
        transition-all
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          top-0
          right-0
          w-24
          h-24
          rounded-full
          bg-white/5
          blur-3xl
        "
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Icon
            size={30}
            className={color}
          />

          <span
            className="
              text-xs
              px-3
              py-1
              rounded-full
              bg-emerald-500/10
              text-emerald-400
              font-medium
            "
          >
            Active
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-slate-400 text-sm uppercase tracking-wide">
          {title}
        </h3>

        {/* Value */}
        <p
          className={`text-5xl font-bold mt-3 ${color}`}
        >
          {value}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-slate-500 mt-3">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}