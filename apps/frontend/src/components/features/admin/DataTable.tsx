import React from 'react';
import { MoreVertical, Edit2, Trash2, Ban, RefreshCw } from 'lucide-react';
import { StatusPill } from '@/components/features/admin/StatusPill';
import type { User, Course } from '@/types/admin';

type DataTableProps = {
    type: 'users' | 'courses';
    data: (User | Course)[];
};

export const DataTable: React.FC<DataTableProps> = ({ type, data }) => {
    return (
        <div className="bg-surface-low rounded-2xl overflow-hidden border border-border shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-surface text-[11px] font-bold text-on-surface-variant uppercase tracking-wider h-12">
                <th className="px-6">{type === 'users' ? 'Identity node' : 'Course Identity'}</th>
                <th className="px-4">{type === 'users' ? 'Protocol Role' : 'Primary Owner'}</th>
                <th className="px-4">{type === 'users' ? 'Entity Status' : 'Enrolled'}</th>
                <th className="px-4">{type === 'users' ? 'Last Access' : 'Status'}</th>
                <th className="px-4 text-right pr-6">{type === 'users' ? 'Commands' : 'Actions'}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {data.map((item) => (
                <tr key={item.id} className="h-16 hover:bg-primary/10 transition-colors group">
                    <td className="px-6">
                    <div className="flex items-center gap-3">
                        {type === 'users' ? (
                        <>
                            <img 
                            className="w-9 h-9 rounded-full object-cover border border-border" 
                            src={(item as User).avatar || `https://picsum.photos/seed/${item.id}/100/100`} 
                            alt={(item as User).name}
                            referrerPolicy="no-referrer"
                            />
                            <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface leading-tight">{(item as User).name}</span>
                            <span className="text-xs text-on-surface-variant">{(item as User).email}</span>
                            </div>
                        </>
                        ) : (
                        <>
                            <div className="w-10 h-10 rounded-lg bg-surface overflow-hidden border border-border">
                            <img 
                                className="w-full h-full object-cover" 
                                src={(item as Course).image} 
                                alt={(item as Course).title}
                                referrerPolicy="no-referrer"
                            />
                            </div>
                            <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface leading-tight">{(item as Course).title}</span>
                            <span className="text-xs text-on-surface-variant">{(item as Course).category}</span>
                            </div>
                        </>
                        )}
                    </div>
                    </td>
                    <td className="px-4">
                    {type === 'users' ? (
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {(item as User).role}
                        </span>
                    ) : (
                        <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-bold">
                            {(item as Course).ownerInitials}
                        </div>
                        <span className="text-sm font-medium">{(item as Course).owner}</span>
                        </div>
                    )}
                    </td>
                    <td className="px-4">
                    {type === 'users' ? (
                        <StatusPill status={(item as User).status} />
                    ) : (
                        <span className="text-sm font-medium text-on-surface-variant">{(item as Course).enrolled.toLocaleString()}</span>
                    )}
                    </td>
                    <td className="px-4">
                    {type === 'users' ? (
                        <span className="text-xs text-on-surface-variant">{(item as User).lastAccess}</span>
                    ) : (
                        <StatusPill status={(item as Course).status} type="course" />
                    )}
                    </td>
                    <td className="px-4 text-right pr-6">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {type === 'users' ? (
                        <>
                            {(item as User).status === 'Suspended' ? (
                            <button className="p-1.5 text-on-surface-variant hover:text-secondary transition-colors" title="Reactivate"><RefreshCw className="w-4 h-4" /></button>
                            ) : (
                            <button className="p-1.5 text-on-surface-variant hover:text-destructive transition-colors" title="Suspend"><Ban className="w-4 h-4" /></button>
                            )}
                            <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-1.5 text-on-surface-variant hover:text-destructive transition-colors" title="Remove"><Trash2 className="w-4 h-4" /></button>
                        </>
                        ) : (
                        <>
                            <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </>
                        )}
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="px-6 py-4 bg-surface-high/5 flex items-center justify-between border-t border-border">
            <div className="text-xs text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">1-{data.length}</span> of <span className="font-bold text-on-surface">482</span> records
            </div>
            <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-surface-low border border-border text-xs font-bold hover:bg-surface transition-colors disabled:opacity-30">
                Prev
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-low border border-border text-xs font-bold hover:bg-surface transition-colors">
                Next
            </button>
            </div>
        </div>
        </div>
    );
};
