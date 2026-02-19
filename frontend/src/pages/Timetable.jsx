import { useState } from "react";
import { Calendar, Clock, MapPin, User, Download, Filter } from "lucide-react";
import { timetable } from "../data/mockData";

const Timetable = () => {
  const [selectedDay, setSelectedDay] = useState("All");
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'day'

  // Get current day
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Time slots for the week view
  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
  ];

  // Get class for a specific day and time slot
  const getClassForSlot = (day, timeSlot) => {
  const daySchedule = timetable.find((d) => d.day === day);
  if (!daySchedule) return null;

  // Extract start time from slot (e.g., "9:00 AM" from "9:00 AM - 10:00 AM")
  const slotStartTime = timeSlot.split(" - ")[0];

  // Find class that starts at this time
  return daySchedule.classes.find((c) => c.time.startsWith(slotStartTime));
};

  // Color mapping for courses
  const courseColors = {
    "Data Structures": "bg-indigo-100 border-indigo-300 text-indigo-900",
    DBMS: "bg-purple-100 border-purple-300 text-purple-900",
    "Operating Systems": "bg-pink-100 border-pink-300 text-pink-900",
    "Computer Networks": "bg-blue-100 border-blue-300 text-blue-900",
    "Software Engineering": "bg-green-100 border-green-300 text-green-900",
  };

  const getColorClass = (courseName) => {
    return (
      courseColors[courseName] || "bg-slate-100 border-slate-300 text-slate-900"
    );
  };

  // Filter timetable by selected day
  const filteredTimetable =
    selectedDay === "All"
      ? timetable
      : timetable.filter((day) => day.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">My Timetable</h1>
        <p className="text-blue-100">View your weekly class schedule</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "week"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "day"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Day View
            </button>
          </div>

          {/* Day Filter (for day view) */}
          {viewMode === "day" && (
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="All">All Days</option>
                {timetable.map((day) => (
                  <option key={day.day} value={day.day}>
                    {day.day}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Download Button */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all">
            <Download className="w-4 h-4" />
            <span className="font-semibold">Download</span>
          </button>
        </div>
      </div>

      {/* Week View */}
      {viewMode === "week" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-700 w-32">
                  Time
                </th>
                {timetable.map((day) => (
                  <th
                    key={day.day}
                    className={`text-center p-4 font-semibold ${
                      day.day === currentDay
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700"
                    }`}
                  >
                    {day.day}
                    {day.day === currentDay && (
                      <div className="text-xs text-indigo-500 font-normal mt-1">
                        Today
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, index) => (
                <tr
                  key={slot}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 text-sm text-slate-600 font-medium">
                    {slot.split(" - ")[0]}
                  </td>
                  {timetable.map((day) => {
                    const classItem = getClassForSlot(day.day, slot);
                    return (
                      <td key={day.day} className="p-2">
                        {classItem ? (
                          <div
                            className={`rounded-lg p-3 border-2 ${getColorClass(classItem.course)} hover:shadow-md transition-all cursor-pointer`}
                          >
                            <p className="font-semibold text-sm mb-1">
                              {classItem.course}
                            </p>
                            <p className="text-xs opacity-75 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {classItem.room}
                            </p>
                            <p className="text-xs opacity-75 flex items-center mt-1">
                              <User className="w-3 h-3 mr-1" />
                              {classItem.faculty}
                            </p>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-300">
                            -
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Day View */}
      {viewMode === "day" && (
        <div className="space-y-4">
          {filteredTimetable.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      day.day === currentDay ? "bg-indigo-100" : "bg-slate-100"
                    }`}
                  >
                    <Calendar
                      className={`w-6 h-6 ${
                        day.day === currentDay
                          ? "text-indigo-600"
                          : "text-slate-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {day.day}
                    </h2>
                    {day.day === currentDay && (
                      <span className="text-sm text-indigo-600 font-medium">
                        Today
                      </span>
                    )}
                  </div>
                </div>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {day.classes.length} Classes
                </span>
              </div>

              {day.classes.length > 0 ? (
                <div className="space-y-3">
                  {day.classes.map((classItem, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 border-2 ${getColorClass(classItem.course)} hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">
                            {classItem.course}
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 mr-2 opacity-60" />
                              <span>{classItem.time}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <User className="w-4 h-4 mr-2 opacity-60" />
                              <span>{classItem.faculty}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 mr-2 opacity-60" />
                              <span>{classItem.room}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-50 px-3 py-1 rounded-lg text-sm font-semibold">
                          {classItem.code}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No classes scheduled for this day</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Color Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(courseColors).map(([course, colorClass]) => (
            <div key={course} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded ${colorClass} border-2`}></div>
              <span className="text-sm text-slate-700">{course}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
