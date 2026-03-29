import React, { useState, useRef } from 'react';
import { Upload, FolderPlus, FileVideo, FileText, CheckCircle2, Plus, Trash2, Palette, Settings } from 'lucide-react';
import { Course, ThemeConfig } from '../../types';
import { parseCourseFolder } from '../../lib/courseParser';
import { cn } from '../../lib/utils';

interface AdminDashboardProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
}

export function AdminDashboard({ courses, onAddCourse }: AdminDashboardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [globalTheme, setGlobalTheme] = useState<ThemeConfig>({
    primaryColor: '#2563eb',
    accentColor: '#f59e0b',
    darkMode: false,
    fontFamily: 'Inter'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    setTimeout(() => {
      const course = parseCourseFolder(files);
      if (course) {
        onAddCourse({ ...course, theme: globalTheme });
      }
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Course Management</h2>
          <p className="text-gray-500 font-medium">Upload and manage your meta-driven course library.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowThemeSettings(!showThemeSettings)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
          >
            <Palette size={20} className="text-blue-600" />
            <span>Global Theme</span>
          </button>

          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              // @ts-ignore
              webkitdirectory=""
              directory=""
              onChange={handleFolderUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={cn(
                "flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95",
                isUploading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FolderPlus size={20} />
                  <span>Upload Folder</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showThemeSettings && (
        <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-6">
            <Settings size={20} className="text-blue-600" />
            <h3 className="text-lg font-bold">Meta Configuration (theme.json)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Color</label>
              <input 
                type="color" 
                value={globalTheme.primaryColor}
                onChange={(e) => setGlobalTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-full h-12 rounded-xl border border-gray-100 cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accent Color</label>
              <input 
                type="color" 
                value={globalTheme.accentColor}
                onChange={(e) => setGlobalTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                className="w-full h-12 rounded-xl border border-gray-100 cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Font Family</label>
              <select 
                value={globalTheme.fontFamily}
                onChange={(e) => setGlobalTheme(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full h-12 rounded-xl border border-gray-200 px-4 font-bold text-sm"
              >
                <option value="Inter">Inter (Modern)</option>
                <option value="Georgia">Georgia (Editorial)</option>
                <option value="JetBrains Mono">Mono (Tech)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => setShowThemeSettings(false)}
                className="w-full h-12 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
              >
                Save Meta Config
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-gray-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center space-y-4 bg-white/50">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <Upload size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">No Courses Yet</h3>
              <p className="text-sm text-gray-500 max-w-xs">Upload a structured course folder to see it appear here and on the student side.</p>
            </div>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: course.theme.primaryColor }}
                >
                  <BookOpen size={24} />
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100">
                  Active
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Modules</div>
                  <div className="text-lg font-black text-gray-900">{course.modules.length}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Lessons</div>
                  <div className="text-lg font-black text-gray-900">
                    {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: course.theme.primaryColor }} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{course.theme.fontFamily}</span>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BookOpen({ size, className }: { size: number, className?: string }) {
  return <Upload size={size} className={className} />;
}
