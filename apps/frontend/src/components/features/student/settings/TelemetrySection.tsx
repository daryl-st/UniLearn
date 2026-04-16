import { motion } from "motion/react";
import type { TelemetryItem } from "@/types/student/settings";

type TelemetrySectionProps = {
  telemetry: TelemetryItem[];
};

export function TelemetrySection({ telemetry }: TelemetrySectionProps) {
  return (
    <div className="mt-16">
      <h4 className="font-mono text-[10px] text-secondary tracking-[0.4em] mb-6 uppercase font-bold">Usage Telemetry</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {telemetry.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-sm border border-outline-variant/10 bg-surface-high/30 hover:border-primary/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-on-surface-variant text-[10px] font-mono font-bold tracking-[0.2em]">{stat.label}</p>
              <stat.icon
                className={`w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors ${stat.pulse ? "animate-pulse text-secondary" : ""}`}
              />
            </div>
            <p className="font-headline text-4xl font-bold text-white mb-3 tracking-tighter">{stat.value}</p>
            {stat.progress !== undefined ? (
              <div className="h-1 bg-surface-high rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-primary"
                />
              </div>
            ) : (
              <p
                className={`text-[10px] font-mono font-black tracking-widest ${
                  stat.subtext === "OPTIMIZED" ? "text-secondary" : "text-on-surface-variant/40"
                }`}
              >
                {stat.subtext}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
