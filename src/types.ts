export type FileType = 'video' | 'pdf' | 'image' | 'other';

export interface Lesson {
  id: string;
  title: string;
  fileName: string;
  type: FileType;
  order: number;
  url: string; // Blob URL or external URL
  duration?: number;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules: Module[];
  theme: ThemeConfig;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
  fontFamily: string;
}

export interface UserProgress {
  [courseId: string]: {
    [lessonId: string]: {
      completed: boolean;
      lastPosition: number;
    };
  };
}
