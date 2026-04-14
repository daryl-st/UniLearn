import React from 'react';
import { cn } from '@/lib/utils';

type StatusPillProps = {
    status: string;
    type?: 'user' | 'course';
};

// export const StatusPill: React.FC<StatusPillProps> = ({ status, type = 'user' }) => {
export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
    const isSynchronized = status === 'Synchronized' || status === 'Published';
    const isSuspended = status === 'Suspended' || status === 'Archived';
    const isDraft = status === 'Draft';

    return (
        <div className="flex items-center gap-2">
        <span className={cn(
            "w-2 h-2 rounded-full",
            isSynchronized && "bg-secondary-accent",
            isSuspended && "bg-error",
            isDraft && "bg-primary-brand"
        )}></span>
        <span className={cn(
            "text-xs font-bold",
            isSynchronized && "text-on-surface",
            isSuspended && "text-error",
            isDraft && "text-primary-brand"
        )}>
            {status}
        </span>
        </div>
    );
};
