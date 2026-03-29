import { Course, UserProgress } from './types';

const COURSES_KEY = 'sigma_courses';
const PROGRESS_KEY = 'sigma_progress';

export const Storage = {
  saveCourse: (course: Course) => {
    const courses = Storage.getCourses();
    // In a real app, we can't store Blobs in localStorage. 
    // For this demo, we'll store the metadata and assume the Blobs are session-only.
    // To persist across refreshes, we'd need IndexedDB for the files.
    // We'll store the metadata and a flag that it's a "Local Session Course".
    const serializableCourse = { ...course, isLocal: true };
    localStorage.setItem(COURSES_KEY, JSON.stringify([...courses, serializableCourse]));
  },

  getCourses: (): Course[] => {
    const data = localStorage.getItem(COURSES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProgress: (courseId: string, lessonId: string, completed: boolean, lastPosition: number = 0) => {
    const progress = Storage.getProgress();
    if (!progress[courseId]) progress[courseId] = {};
    progress[courseId][lessonId] = { completed, lastPosition };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  },

  getProgress: (): UserProgress => {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  },

  getLessonProgress: (courseId: string, lessonId: string) => {
    const progress = Storage.getProgress();
    return progress[courseId]?.[lessonId] || { completed: false, lastPosition: 0 };
  }
};
