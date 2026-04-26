import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, 
  Upload, 
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
  { id: '1', name: 'Search_Algorithms_Lecture_v3.ppt', type: 'PPT', size: '12.4 MB', date: 'APR 12, 2026', icon: Video, color: 'text-primary' },
  { id: '2', name: 'Module_04_Assessment_Final.pdf', type: 'PDF', size: '4.5 MB', date: 'APR 14, 2026', icon: FileText, color: 'text-secondary', active: true },
  { id: '3', name: 'Database_Normalization_Notes.doc', type: 'DOC', size: '2.1 MB', date: 'APR 15, 2026', icon: Package, color: 'text-primary' },
  { id: '4', name: 'Course_Outline_AI_v1.png', type: 'IMAGE', size: '1.2 MB', date: 'APR 18, 2026', icon: ImageIcon, color: 'text-error' },
  { id: '5', name: 'AI_Quiz_Bank_v2.pdf', type: 'PDF', size: '3.8 MB', date: 'APR 19, 2026', icon: FileText, color: 'text-secondary' },
  { id: '6', name: 'Data_Modeling_Examples.pptx', type: 'PPT', size: '9.7 MB', date: 'APR 20, 2026', icon: Video, color: 'text-primary' },
  { id: '7', name: 'Capstone_Guide.docx', type: 'DOC', size: '2.7 MB', date: 'APR 20, 2026', icon: Package, color: 'text-primary' },
  { id: '8', name: 'Week_10_Review_Sheet.pdf', type: 'PDF', size: '1.6 MB', date: 'APR 21, 2026', icon: FileText, color: 'text-secondary' },
  { id: '9', name: 'Lecture_Board_Snapshot.png', type: 'IMAGE', size: '2.2 MB', date: 'APR 22, 2026', icon: ImageIcon, color: 'text-error' },
  { id: '10', name: 'Assessment_Rubric_v4.pdf', type: 'PDF', size: '1.1 MB', date: 'APR 22, 2026', icon: FileText, color: 'text-secondary' },
  { id: '11', name: 'Systems_Architecture.ppt', type: 'PPT', size: '11.2 MB', date: 'APR 23, 2026', icon: Video, color: 'text-primary' },
  { id: '12', name: 'Cloud_Services_CheatSheet.doc', type: 'DOC', size: '1.9 MB', date: 'APR 24, 2026', icon: Package, color: 'text-primary' },
];

export const ContentLibrary: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('No file selected');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(assets.length / itemsPerPage);
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageEnd = pageStart + itemsPerPage;
  const paginatedAssets = assets.slice(pageStart, pageEnd);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold tracking-tight">Content Upload</h1>
          <p className="text-outline max-w-xl mt-2">Upload course materials for student access. Supported document formats include PDF, PPT, and DOC.</p>
          <p className="text-[10px] font-mono text-outline mt-2 uppercase tracking-widest">{selectedFileName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="bg-surface-high text-on-surface px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-surface-highest active:scale-95 transition-all"
            onClick={handleSelectFile}
          >
            <FolderPlus size={20} />
            <span>Select File</span>
          </button>
          <button
            className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10"
            onClick={handleSelectFile}
          >
            <Upload size={20} />
            <span>Upload Resource</span>
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
                    <th className="px-6 py-4 font-medium">Resource</th>
                    <th className="px-4 py-4 font-medium">File Type</th>
                    <th className="px-4 py-4 font-medium text-right">Size</th>
                    <th className="px-6 py-4 font-medium text-right">Uploaded Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {paginatedAssets.map((asset) => (
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
            <p className="text-[11px] font-mono text-outline">
              SHOWING {pageStart + 1}-{Math.min(pageEnd, assets.length)} OF {assets.length} RESOURCES
            </p>
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 rounded bg-surface-high text-outline hover:text-on-surface disabled:opacity-30"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[11px] font-mono text-primary px-3">PAGE {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}</span>
              <button
                className="p-1.5 rounded bg-surface-high text-outline hover:text-on-surface disabled:opacity-30"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-3 space-y-6">
          <div className="bg-surface-high rounded-xl p-6 border border-outline-variant/5 glass-panel">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">Recent Upload</span>
              <button className="text-outline hover:text-on-surface"><MoreVertical size={16} /></button>
            </div>
            <div className="aspect-video w-full rounded-lg bg-surface-low overflow-hidden mb-6 relative group">
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={48} className="text-white" />
              </div>
              <img src="https://picsum.photos/seed/preview/400/225" alt="" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-headline font-bold text-lg leading-tight">Module_04_Assessment_Final.pdf</h3>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded-sm bg-secondary/15 text-secondary border border-secondary/25">PDF</span>
                  <span className="text-outline">4.5 MB</span>
                  <span className="text-outline/60">•</span>
                  <span className="text-outline">APR 14, 2026</span>
                </div>
              </div>

              <div className="rounded-lg bg-surface-low/70 border border-outline-variant/10 p-3 grid grid-cols-2 gap-3">
                <div className="space-y-1 min-w-0">
                  <p className="text-[10px] font-mono text-outline uppercase tracking-wider">Instructor</p>
                  <p className="text-xs font-medium truncate">Dr. Aris Thorne</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-mono text-outline uppercase tracking-wider">Status</p>
                  <p className="text-xs font-medium text-secondary">Uploaded</p>
                </div>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <button
                  className="w-full bg-on-surface text-surface py-2 rounded font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
                  onClick={() => navigate('/instructor/courses')}
                >
                  View Resource
                </button>
                <button
                  className="w-full bg-surface-highest text-on-surface py-2 rounded font-bold text-sm hover:bg-surface-variant active:scale-95 transition-all"
                  onClick={() => navigate('/instructor/courses')}
                >
                  Update Resource
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-primary tracking-widest uppercase">Upload Queue</span>
              <span className="text-xs font-mono">78%</span>
            </div>
            <div className="h-2 w-full bg-surface-highest rounded-full overflow-hidden mb-6">
              <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-outline">Processed</span>
                <span className="font-mono">18 files</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-outline">Pending</span>
                <span className="font-mono">5 files</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-90 transition-all group"
        onClick={handleSelectFile}
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleFileChange}
      />
    </motion.div>
  );
};
