import React from 'react';
import { BrainCircuit, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIInsightCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 grid grid-cols-3 gap-6">
      <div className="col-span-2 glass-card p-8 rounded-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="font-headline font-bold text-xl text-primary tracking-tight">AI Access Anomaly Detection</h3>
          <p className="text-on-surface-variant text-sm mt-2 max-w-md">
            3 nodes exhibiting irregular authentication patterns across geographical regions. Immediate review recommended.
          </p>
          <button
            className="mt-6 bg-primary text-on-primary px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:brightness-110 transition-all active:scale-95"
            onClick={() => navigate('/admin/users')}
          >
            Initiate Validation
          </button>
        </div>
        <div className="absolute top-0 right-0 p-6">
          <BrainCircuit className="text-primary/10 w-20 h-20 group-hover:text-primary/20 transition-colors" />
        </div>
      </div>
      
      <div className="bg-surface-low p-8 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center text-center">
        <ShieldCheck className="text-secondary mb-3 w-10 h-10" />
        <h4 className="text-base font-bold text-on-surface">System Integrity</h4>
        <p className="text-xs text-on-surface-variant mt-2">All instructor certificates validated until 2049 Protocol Sync.</p>
      </div>
    </div>
  );
};
