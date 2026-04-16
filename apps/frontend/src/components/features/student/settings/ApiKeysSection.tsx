import { Copy, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { ApiKeyItem } from "@/types/student/settings";

type ApiKeysSectionProps = {
  keys: ApiKeyItem[];
};

export function ApiKeysSection({ keys }: ApiKeysSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-surface-low rounded-sm p-8 border border-outline-variant/10"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
        <div>
          <h4 className="font-headline text-xl text-white font-bold mb-2">API & Integration Keys</h4>
          <p className="text-on-surface-variant text-sm max-w-lg leading-relaxed">
            Manage your secure access tokens for third-party integration and the UniLearn Developer SDK. Keep these keys secret.
          </p>
        </div>
        <button className="bg-primary text-on-primary font-bold px-5 py-2.5 rounded-sm text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/10 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          CREATE NEW KEY
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-150">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-outline-variant/10 mb-4">
            <span className="col-span-5 font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Key Label</span>
            <span className="col-span-4 font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Secret Token</span>
            <span className="col-span-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Created</span>
            <span className="col-span-1"></span>
          </div>

          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.label}
                className="grid grid-cols-12 items-center px-5 py-5 bg-surface-high/20 rounded-sm hover:bg-surface-high/40 transition-all group border border-outline-variant/5 hover:border-outline-variant/20"
              >
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="font-mono text-xs text-white font-medium tracking-tight">{key.label}</span>
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <span className="font-mono text-xs text-on-surface-variant/70">{key.token}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-white p-1 hover:bg-primary/10 rounded-sm">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="col-span-2 font-mono text-xs text-on-surface-variant/50">{key.created}</div>
                <div className="col-span-1 text-right">
                  <button className="text-on-surface-variant/40 hover:text-red-400 transition-colors p-1 hover:bg-red-400/10 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
