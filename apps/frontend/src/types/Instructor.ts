export type View = 'dashboard' | 'courses' | 'analytics' | 'content' | 'settings';

export interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  status?: string;
  type: 'success' | 'info' | 'warning' | 'neutral';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  enrolled: number;
  status: 'published' | 'draft' | 'archived';
  category: string;
  lastSync: string;
  image: string;
}

export interface FileAsset {
  id: string;
  name: string;
  type: 'video' | 'pdf' | 'scorm' | 'image';
  size: string;
  date: string;
  usedIn: string[];
}
