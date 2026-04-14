import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down';
    status?: string;
    color?: 'primary' | 'secondary' | 'destructive' | 'neutral';
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, trend, status, color = 'neutral' }) => {
    const colorClasses = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        destructive: 'text-destructive',
        neutral: 'text-on-surface-variant'
    };

    return (
        <div className="bg-surface-low p-6 rounded-2xl flex flex-col justify-between h-32 border border-border shadow-sm transition-transform hover:-translate-y-0.5">
        <span className={cn("text-[11px] font-bold uppercase tracking-wider", colorClasses[color])}>
            {label}
        </span>
        <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-on-surface">{value}</span>
            {change && (
            <span className={cn(
                "text-xs font-bold",
                trend === 'up' ? "text-secondary" : "text-destructive"
            )}>
                {trend === 'up' ? '+' : '-'}{change}
            </span>
            )}
            {status && (
            <span className="text-[10px] text-on-surface-variant font-mono">{status}</span>
            )}
            {label === 'Data Uptime' && (
            <CheckCircle2 className="text-secondary w-5 h-5" />
            )}
            {label === 'Pending Sync' && (
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
            )}
        </div>
        </div>
    );
};
