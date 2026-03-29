import { Course } from '../../types';
import { BookOpen, PlayCircle, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface UserDashboardProps {
  courses: Course[];
}

export function UserDashboard({ courses }: UserDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">My Learning</h2>
        <p className="text-gray-500 font-medium">Continue where you left off and master new skills.</p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-[40px] p-16 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <BookOpen size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">No Courses Available</h3>
            <p className="text-gray-500 max-w-md">The admin hasn't uploaded any courses yet. Check back soon or contact support.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                to={`/user/course/${course.id}`}
                className="group block bg-white rounded-[40px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="aspect-video bg-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl scale-90 group-hover:scale-100 transition-transform">
                      <PlayCircle size={32} fill="currentColor" fillOpacity={0.2} />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                      <Clock size={14} />
                      <span>{course.modules.length} Modules • {course.modules.reduce((a, m) => a + m.lessons.length, 0)} Lessons</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight">{course.title}</h3>
                  </div>
                </div>
                <div className="p-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progress</div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-blue-600 rounded-full" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">33%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
