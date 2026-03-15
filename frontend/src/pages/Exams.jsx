import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Exams = () => {
  const { examSchedule } = useAdmin();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  // Calculate countdown to next exam
  useEffect(() => {
    if (!examSchedule.length) {
      setCountdown({ days: 0, hours: 0, minutes: 0 });
      return undefined;
    }

    const nextExam = examSchedule[0];
    const [year, month, day] = nextExam.date.split('-').map(Number);
    const [timePart, meridiem] = nextExam.time.split(' - ')[0].split(' ');
    const [rawHours, rawMinutes] = timePart.split(':').map(Number);
    let hours = rawHours;

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    const examDateTime = new Date(year, month - 1, day, hours, rawMinutes);

    const updateCountdown = () => {
      const now = new Date();
      const difference = examDateTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setCountdown({ days, hours, minutes });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);

    return () => clearInterval(timer);
  }, [examSchedule]);

  const handleDownloadAdmitCard = () => {
    // Backend API call will go here
    alert('Downloading admit card...');
  };

  const handleDownloadSchedule = () => {
    // Backend API call will go here
    alert('Downloading exam schedule...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Examination Portal</h1>
        <p className="text-red-100">View exam schedule and download admit card</p>
      </div>

      {/* Countdown Card */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 border-2 border-red-200 dark:border-slate-700 rounded-xl p-6">
        {examSchedule.length > 0 ? (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Next Exam</h2>
              <p className="text-slate-700 dark:text-slate-200">{examSchedule[0].course}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {new Date(examSchedule[0].date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="text-center bg-white dark:bg-slate-800 rounded-lg p-4 min-w-[80px] shadow-sm">
              <p className="text-3xl font-bold text-red-600">{countdown.days}</p>
              <p className="text-xs text-slate-600">Days</p>
            </div>
            <div className="text-center bg-white dark:bg-slate-800 rounded-lg p-4 min-w-[80px] shadow-sm">
              <p className="text-3xl font-bold text-red-600">{countdown.hours}</p>
              <p className="text-xs text-slate-600">Hours</p>
            </div>
            <div className="text-center bg-white dark:bg-slate-800 rounded-lg p-4 min-w-[80px] shadow-sm">
              <p className="text-3xl font-bold text-red-600">{countdown.minutes}</p>
              <p className="text-xs text-slate-600">Minutes</p>
            </div>
          </div>
        </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">No exams scheduled yet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Admin can publish the examination schedule from the admin portal.</p>
          </div>
        )}
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleDownloadAdmitCard}
          className="flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Download className="w-5 h-5" />
          <span>Download Admit Card</span>
        </button>
        <button
          onClick={handleDownloadSchedule}
          className="flex items-center justify-center space-x-3 py-4 border-2 border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Download Full Schedule</span>
        </button>
      </div>

      {/* Exam Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Examination Schedule</h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-700">Course</th>
                <th className="text-left p-4 font-semibold text-slate-700">Code</th>
                <th className="text-left p-4 font-semibold text-slate-700">Date</th>
                <th className="text-left p-4 font-semibold text-slate-700">Time</th>
                <th className="text-left p-4 font-semibold text-slate-700">Room</th>
              </tr>
            </thead>
            <tbody>
              {examSchedule.map((exam, index) => (
                <tr key={exam.id || index} className="border-b border-slate-100">
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{exam.course}</p>
                  </td>
                  <td className="p-4 text-slate-600">{exam.code}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">
                        {new Date(exam.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">{exam.time}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">{exam.room}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {examSchedule.map((exam, index) => (
            <div key={exam.id || index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{exam.course}</h3>
                  <p className="text-sm text-slate-600">{exam.code}</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                  {index === 0 ? 'Next' : 'Upcoming'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(exam.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{exam.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{exam.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Exam Rules & Instructions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900">What to Bring</h3>
                <ul className="text-sm text-slate-600 mt-1 space-y-1">
                  <li>• Admit card (mandatory)</li>
                  <li>• Valid ID card</li>
                  <li>• Blue/Black pen</li>
                  <li>• Scientific calculator (if allowed)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900">Timing</h3>
                <ul className="text-sm text-slate-600 mt-1 space-y-1">
                  <li>• Arrive 30 minutes before exam</li>
                  <li>• Entry closes 15 minutes after start</li>
                  <li>• Cannot leave hall before 1 hour</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900">Not Allowed</h3>
                <ul className="text-sm text-slate-600 mt-1 space-y-1">
                  <li>• Mobile phones or smart devices</li>
                  <li>• Books, notes, or study material</li>
                  <li>• Talking or malpractice</li>
                  <li>• Leaving exam hall without permission</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900">Important Notes</h3>
                <ul className="text-sm text-slate-600 mt-1 space-y-1">
                  <li>• Write roll number on answer sheet</li>
                  <li>• Use only provided answer sheets</li>
                  <li>• Submit answer sheet before leaving</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;
