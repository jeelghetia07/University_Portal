import { useState } from 'react';
import { Award, TrendingUp, BookOpen, Download, ChevronDown } from 'lucide-react';
import { gradesData } from '../data/mockData';

const Grades = () => {
  const [selectedSemester, setSelectedSemester] = useState('current');

  // Get grade color
  const getGradeColor = (grade) => {
    if (grade === 'A+') return 'bg-green-100 text-green-700 border-green-300';
    if (grade === 'A') return 'bg-green-50 text-green-600 border-green-200';
    if (grade === 'B+') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (grade === 'B') return 'bg-blue-50 text-blue-600 border-blue-200';
    if (grade === 'C+') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (grade === 'C') return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  // Calculate current semester SGPA
  const calculateSGPA = (grades) => {
    let totalPoints = 0;
    let totalCredits = 0;

    const gradePoints = {
      'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
    };

    grades.forEach(course => {
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const currentSGPA = calculateSGPA(gradesData.currentSemester);
  const totalCredits = gradesData.currentSemester.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Academic Performance</h1>
        <p className="text-purple-100">View your grades and CGPA</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CGPA Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              Overall
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{gradesData.cgpa}</h3>
          <p className="text-sm text-slate-600">Cumulative GPA</p>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">Out of 10.0</p>
          </div>
        </div>

        {/* Current SGPA Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Current
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{currentSGPA}</h3>
          <p className="text-sm text-slate-600">Semester GPA</p>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">Semester 5</p>
          </div>
        </div>

        {/* Credits Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{totalCredits}</h3>
          <p className="text-sm text-slate-600">Current Credits</p>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">This semester</p>
          </div>
        </div>
      </div>

      {/* Semester Selector & Download */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-slate-700">View Semester:</label>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
              >
                <option value="current">Current Semester (5)</option>
                <option value="4">Semester 4</option>
                <option value="3">Semester 3</option>
                <option value="2">Semester 2</option>
                <option value="1">Semester 1</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all">
            <Download className="w-4 h-4" />
            <span className="font-semibold">Download Transcript</span>
          </button>
        </div>
      </div>

      {/* Current Semester Grades */}
      {selectedSemester === 'current' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Current Semester Grades</h2>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700">Course</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Code</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Internal</th>
                  <th className="text-center p-4 font-semibold text-slate-700">External</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Total</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Credits</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Grade</th>
                </tr>
              </thead>
              <tbody>
                {gradesData.currentSemester.map((course, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-slate-900">{course.course}</p>
                        <p className="text-sm text-slate-500">{course.code}</p>
                      </div>
                    </td>
                    <td className="text-center p-4 text-slate-600">{course.code}</td>
                    <td className="text-center p-4">
                      <span className="text-slate-900 font-medium">{course.internal}</span>
                      <span className="text-slate-500 text-sm"> / 40</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-slate-900 font-medium">{course.external}</span>
                      <span className="text-slate-500 text-sm"> / 80</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-slate-900 font-semibold">{course.total}</span>
                      <span className="text-slate-500 text-sm"> / 120</span>
                    </td>
                    <td className="text-center p-4 text-slate-900 font-medium">{course.credits}</td>
                    <td className="text-center p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {gradesData.currentSemester.map((course, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{course.course}</h3>
                    <p className="text-sm text-slate-600">{course.code}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(course.grade)}`}>
                    {course.grade}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-600">Internal</p>
                    <p className="font-semibold text-slate-900">{course.internal} / 40</p>
                  </div>
                  <div>
                    <p className="text-slate-600">External</p>
                    <p className="font-semibold text-slate-900">{course.external} / 80</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Total</p>
                    <p className="font-semibold text-slate-900">{course.total} / 120</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Credits</p>
                    <p className="font-semibold text-slate-900">{course.credits}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Total Credits</p>
                <p className="text-2xl font-bold text-slate-900">{totalCredits}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700 mb-1">Semester GPA</p>
                <p className="text-2xl font-bold text-green-600">{currentSGPA}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 mb-1">Cumulative GPA</p>
                <p className="text-2xl font-bold text-purple-600">{gradesData.cgpa}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Previous Semesters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Previous Semesters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gradesData.previousSemesters.map((sem) => (
            <div
              key={sem.semester}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">Semester {sem.semester}</h3>
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-slate-600">SGPA</p>
                  <p className="text-2xl font-bold text-indigo-600">{sem.sgpa}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-600">Credits</p>
                  <p className="text-sm font-semibold text-slate-900">{sem.totalCredits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CGPA Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">CGPA Progress</h2>
        
        <div className="space-y-3">
          {gradesData.previousSemesters.map((sem) => (
            <div key={sem.semester} className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700 w-24">Sem {sem.semester}</span>
              <div className="flex-1 bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                  style={{ width: `${(sem.sgpa / 10) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-purple-600 w-12">{sem.sgpa}</span>
            </div>
          ))}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-700 w-24">Sem 5</span>
            <div className="flex-1 bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                style={{ width: `${(currentSGPA / 10) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold text-purple-600 w-12">{currentSGPA}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;