import { useState } from "react";
import { Bell, Search, Filter, Pin, X, Calendar } from "lucide-react";
import { announcements } from "../data/mockData";

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pinnedIds] = useState([1]); // Admin-controlled pinned announcements

  const categories = ["All", "Academic", "Events", "General"];

  // Filter announcements
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || announcement.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Separate pinned and unpinned
  const pinnedAnnouncements = filteredAnnouncements.filter((a) =>
    pinnedIds.includes(a.id),
  );
  const unpinnedAnnouncements = filteredAnnouncements.filter(
    (a) => !pinnedIds.includes(a.id),
  );

  const getPriorityColor = (priority) => {
    if (priority === "high") return "bg-red-100 text-red-700 border-red-300";
    if (priority === "medium")
      return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-green-100 text-green-700 border-green-300";
  };

  const getPriorityDot = (priority) => {
    if (priority === "high") return "bg-red-500";
    if (priority === "medium") return "bg-orange-500";
    return "bg-green-500";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Academic":
        return "🎓";
      case "Events":
        return "🎉";
      case "General":
        return "📢";
      default:
        return "📌";
    }
  };

  const openDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Announcements</h1>
        <p className="text-blue-100">
          Stay updated with university news and notices
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Pin className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Pinned Announcements
            </h2>
          </div>
          <div className="space-y-3">
            {pinnedAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="border-2 border-indigo-200 dark:border-slate-600 bg-indigo-50 dark:bg-slate-800 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => openDetails(announcement)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 ${getPriorityDot(announcement.priority)}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">
                          {getCategoryIcon(announcement.category)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold border ${getPriorityColor(announcement.priority)}`}
                        >
                          {announcement.priority.toUpperCase()}
                        </span>
                        <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded-full font-medium">
                          {announcement.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {announcement.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(announcement.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Announcements */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          All Announcements ({unpinnedAnnouncements.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unpinnedAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => openDetails(announcement)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 ${getPriorityDot(announcement.priority)}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl">
                        {getCategoryIcon(announcement.category)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold border ${getPriorityColor(announcement.priority)}`}
                      >
                        {announcement.priority.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {announcement.description}
                    </p>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {announcement.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(announcement.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {unpinnedAnnouncements.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Bell className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg">No announcements found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">
                    {getCategoryIcon(selectedAnnouncement.category)}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      {selectedAnnouncement.title}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {selectedAnnouncement.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(selectedAnnouncement.priority)}`}
                >
                  {selectedAnnouncement.priority.toUpperCase()} Priority
                </span>
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(selectedAnnouncement.date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-900 leading-relaxed">
                  {selectedAnnouncement.description}
                </p>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
