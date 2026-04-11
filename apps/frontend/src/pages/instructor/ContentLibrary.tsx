import React from 'react';
import { motion } from 'motion/react';
import { 
  FolderPlus, 
  Upload, 
  Search, 
  Video, 
  FileText, 
  Package, 
  Image as ImageIcon,
  MoreVertical,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const assets = [
  { id: '1', name: 'Intro_to_Quantum_Computing_v2.mp4', type: 'VIDEO', size: '1.2 GB', date: 'OCT 12, 2023', icon: Video, color: 'text-primary' },
  { id: '2', name: 'Module_04_Assessment_Final.pdf', type: 'PDF', size: '4.5 MB', date: 'OCT 14, 2023', icon: FileText, color: 'text-secondary', active: true },
  { id: '3', name: 'Interactive_Lab_Simulation_v4.zip', type: 'SCORM', size: '88.2 MB', date: 'OCT 15, 2023', icon: Package, color: 'text-primary' },
  { id: '4', name: 'Schema_Architecture_v1.png', type: 'IMAGE', size: '12.1 MB', date: 'OCT 18, 2023', icon: ImageIcon, color: 'text-error' },
];

export const ContentLibrary: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold tracking-tight">Content Library</h1>
          <p className="text-outline max-w-xl mt-2">Central repository for pedagogical assets. Use the tonal explorer to manage SCORM packages, media, and documentation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface-high text-on-surface px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-surface-highest active:scale-95 transition-all">
            <FolderPlus size={20} />
            <span>New Folder</span>
          </button>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10">
            <Upload size={20} />
            <span>Upload Asset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-9 space-y-4">
          <div className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-high/50 text-outline text-[11px] font-mono uppercase tracking-[0.2em]">
                    <th className="px-6 py-4 font-medium">Filename</th>
                    <th className="px-4 py-4 font-medium">Type</th>
                    <th className="px-4 py-4 font-medium text-right">Size</th>
                    <th className="px-6 py-4 font-medium text-right">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {assets.map((asset) => (
                    <tr key={asset.id} className={cn(
                      "hover:bg-surface-high/40 transition-colors group cursor-pointer",
                      asset.active && "bg-surface-high/20 border-l-2 border-primary"
                    )}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg bg-surface-high flex items-center justify-center", asset.color)}>
                            <asset.icon size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-medium group-hover:text-primary transition-colors">{asset.name}</div>
                            <div className="text-[10px] font-mono text-outline">ID: 0x{asset.id}F2...91</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded bg-surface-highest text-[10px] font-mono text-outline">{asset.type}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-xs font-mono text-outline">{asset.size}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-mono text-outline">{asset.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <p className="text-[11px] font-mono text-outline">SHOWING 24 OF 1,042 OBJECTS</p>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded bg-surface-high text-outline hover:text-on-surface disabled:opacity-30" disabled>
                <ChevronLeft size={16} />
              </button>
              <span className="text-[11px] font-mono text-primary px-3">PAGE 01 / 44</span>
              <button className="p-1.5 rounded bg-surface-high text-outline hover:text-on-surface">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-3 space-y-6">
          <div className="bg-surface-high rounded-xl p-6 border border-outline-variant/5 glass-panel">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">File Preview</span>
              <button className="text-outline hover:text-on-surface"><MoreVertical size={16} /></button>
            </div>
            <div className="aspect-video w-full rounded-lg bg-surface-low overflow-hidden mb-6 relative group">
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={48} className="text-white" />
              </div>
              <img src="https://picsum.photos/seed/preview/400/225" alt="" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-4">
              <h3 className="font-headline font-bold text-lg leading-tight">Module_04_Assessment_Final.pdf</h3>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                <div>
                  <p className="text-[10px] font-mono text-outline uppercase tracking-wider">Owner</p>
                  <p className="text-xs font-medium">Dr. Aris Thorne</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-outline uppercase tracking-wider">Status</p>
                  <p className="text-xs font-medium text-secondary">Verified</p>
                </div>
              </div>
              <div className="pt-6 flex flex-col gap-2">
                <button className="w-full bg-on-surface text-surface py-2 rounded font-bold text-sm hover:opacity-90 active:scale-95 transition-all">Download Asset</button>
                <button className="w-full bg-surface-highest text-on-surface py-2 rounded font-bold text-sm hover:bg-surface-variant active:scale-95 transition-all">Link to Course</button>
              </div>
            </div>
          </div>

          <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-primary tracking-widest uppercase">Storage Integrity</span>
              <span className="text-xs font-mono">78%</span>
            </div>
            <div className="h-2 w-full bg-surface-highest rounded-full overflow-hidden mb-6">
              <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-outline">Allocated</span>
                <span className="font-mono">1.0 TB</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-outline">Consumed</span>
                <span className="font-mono">784.2 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-90 transition-all group">
        <Plus size={32} className="group-hover:rotate-90 transition-transform" />
      </button>
    </motion.div>
  );
};
