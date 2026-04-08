export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorImage: string;
  thumbnail: string;
  progress: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  lessonsCount: number;
  modules?: Module[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  isLocked?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz';
  duration: string;
  isCompleted?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'system' | 'instructor' | 'sandbox';
}
