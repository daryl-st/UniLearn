export type NavItem = {
  id: string;
  label: string;
  icon: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Instructor' | 'Student';
  status: 'Synchronized' | 'Suspended';
  lastAccess: string;
  avatar?: string;
};

export type Course = {
  id: string;
  title: string;
  category: string;
  owner: string;
  ownerInitials: string;
  enrolled: number;
  status: 'Published' | 'Draft' | 'Archived';
  lastSync: string;
  image: string;
};

export type Stat = {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  status?: string;
  color?: 'primary' | 'secondary' | 'error' | 'neutral';
};
