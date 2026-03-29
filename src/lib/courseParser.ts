import { Course, Lesson, Module, FileType } from './types';

export function parseCourseFolder(files: FileList): Course | null {
  if (files.length === 0) return null;

  // The first part of the relative path is usually the root folder name
  const firstFile = files[0];
  const pathParts = firstFile.webkitRelativePath.split('/');
  const courseTitle = pathParts[0] || 'Untitled Course';

  const modulesMap: { [key: string]: Module } = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const parts = file.webkitRelativePath.split('/');
    
    // parts[0] = Course Name
    // parts[1] = Module Name (e.g., "Day - 21 ArrayList")
    // parts[2] = File Name (e.g., "01. Introduction.mp4")
    
    if (parts.length < 3) continue;

    const moduleName = parts[1];
    const fileName = parts[2];

    if (!modulesMap[moduleName]) {
      const moduleOrder = parseInt(moduleName.match(/\d+/)?.[0] || '0');
      modulesMap[moduleName] = {
        id: crypto.randomUUID(),
        title: moduleName.replace(/^\d+[\.\-\s]*/, ''), // Remove leading numbers
        order: moduleOrder,
        lessons: []
      };
    }

    const fileType = getFileType(fileName);
    const lessonOrder = parseInt(fileName.match(/\d+/)?.[0] || '0');
    
    modulesMap[moduleName].lessons.push({
      id: crypto.randomUUID(),
      title: fileName.replace(/^\d+[\.\-\s]*/, '').replace(/\.[^/.]+$/, ""), // Remove leading numbers and extension
      fileName: fileName,
      type: fileType,
      order: lessonOrder,
      url: URL.createObjectURL(file), // Create a local URL for the file
    });
  }

  const modules = Object.values(modulesMap).sort((a, b) => a.order - b.order);
  modules.forEach(m => m.lessons.sort((a, b) => a.order - b.order));

  return {
    id: crypto.randomUUID(),
    title: courseTitle,
    description: `Automatically ingested course from ${courseTitle} folder structure.`,
    modules: modules,
    theme: {
      primaryColor: '#2563eb',
      accentColor: '#f59e0b',
      darkMode: false,
      fontFamily: 'Inter'
    }
  };
}

function getFileType(fileName: string): FileType {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['mp4', 'mkv', 'webm', 'mov'].includes(ext || '')) return 'video';
  if (['pdf'].includes(ext || '')) return 'pdf';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) return 'image';
  return 'other';
}
