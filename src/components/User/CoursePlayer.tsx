import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, PlayCircle, FileText, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Course, Lesson, Module } from '../../types';
import { Storage } from '../../lib/storage';
import { cn } from '../../lib/utils';

interface CoursePlayerProps {
  courses: Course[];
}

export function CoursePlayer({ courses }: CoursePlayerProps) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [progress, setProgress] = useState<any>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const found = courses.find(c => c.id === courseId);
    if (found) {
      setCourse(found);
      if (found.modules.length > 0 && found.modules[0].lessons.length > 0) {
        setActiveLesson(found.modules[0].lessons[0]);
        setExpandedModules([found.modules[0].id]);
      }
      setProgress(Storage.getProgress()[found.id] || {});
    }
  }, [courseId, courses]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !activeLesson || !course) return;
    
    const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    
    // If > 50% watched, mark as completed
    if (percentage > 50 && !progress[activeLesson.id]?.completed) {
      Storage.saveProgress(course.id, activeLesson.id, true, videoRef.current.currentTime);
      setProgress(Storage.getProgress()[course.id]);
    }
  };

  if (!course || !activeLesson) return null;

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col font-sans">
      {/* Player Header */}
      <header className="h-16 bg-gray-900 text-white flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/user')}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-sm font-bold tracking-tight">{course.title}</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{activeLesson.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Learning Mode
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Content Player */}
        <div className="flex-1 bg-black flex flex-col relative">
          <div className="flex-1 flex items-center justify-center p-8">
            {activeLesson.type === 'video' ? (
              <video 
                ref={videoRef}
                key={activeLesson.id}
                src={activeLesson.url}
                controls
                onTimeUpdate={handleTimeUpdate}
                className="max-h-full max-w-full rounded-2xl shadow-2xl shadow-blue-500/10"
              />
            ) : activeLesson.type === 'pdf' ? (
              <iframe 
                src={activeLesson.url} 
                className="w-full h-full rounded-2xl bg-white"
                title={activeLesson.title}
              />
            ) : (
              <div className="text-white text-center space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-white/20">
                  <FileText size={40} />
                </div>
                <h3 className="text-xl font-bold">Unsupported File Type</h3>
                <p className="text-white/40 text-sm">This file type is not supported in the player yet.</p>
                <a 
                  href={activeLesson.url} 
                  download={activeLesson.fileName}
                  className="inline-block px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
          
          {/* Lesson Info Bar */}
          <div className="h-20 bg-gray-900/50 backdrop-blur-md border-t border-white/5 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                {activeLesson.type === 'video' ? <PlayCircle size={20} /> : <FileText size={20} />}
              </div>
              <div>
                <h2 className="text-white font-bold">{activeLesson.title}</h2>
                <div className="flex items-center gap-3 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                  <span>Lesson {activeLesson.order}</span>
                  <span>•</span>
                  <span>{activeLesson.type.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {progress[activeLesson.id]?.completed && (
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                  <CheckCircle2 size={14} />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Syllabus Sidebar */}
        <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Course Content</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Syllabus</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {course.modules.length} Modules
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.modules.map((module) => (
              <div key={module.id} className="border-b border-gray-100">
                <button 
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-100/50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Module {module.order}</div>
                    <h4 className="font-bold text-gray-900 leading-tight">{module.title}</h4>
                  </div>
                  {expandedModules.includes(module.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {expandedModules.includes(module.id) && (
                  <div className="bg-white">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={cn(
                          "w-full px-6 py-4 flex items-center gap-4 hover:bg-blue-50 transition-all border-l-4",
                          activeLesson.id === lesson.id ? "border-blue-600 bg-blue-50/50" : "border-transparent"
                        )}
                      >
                        <div className="flex-shrink-0">
                          {progress[lesson.id]?.completed ? (
                            <CheckCircle2 size={18} className="text-green-500 fill-green-500/10" />
                          ) : (
                            <Circle size={18} className="text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-bold text-gray-800 leading-tight group-hover:text-blue-600">
                            {lesson.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {lesson.type}
                            </span>
                          </div>
                        </div>
                        {lesson.type === 'video' && (
                          <div className="text-gray-300">
                            <PlayCircle size={16} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
