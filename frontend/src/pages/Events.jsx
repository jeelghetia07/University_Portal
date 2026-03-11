import { useState } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Users, X, CheckCircle, User, Mail, Hash, Phone } from 'lucide-react';
import { events, currentUser } from '../data/mockData';

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  
  const [registrationData, setRegistrationData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    rollNumber: currentUser.id,
    phone: '+91 98765 43210',
    teamSize: '1'
  });

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Career'];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(event => event.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      Technical: 'bg-blue-100 text-blue-700 border-blue-300',
      Cultural: 'bg-pink-100 text-pink-700 border-pink-300',
      Sports: 'bg-green-100 text-green-700 border-green-300',
      Career: 'bg-purple-100 text-purple-700 border-purple-300'
    };
    return colors[category] || 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Technical': return '💻';
      case 'Cultural': return '🎭';
      case 'Sports': return '⚽';
      case 'Career': return '💼';
      default: return '✨';
    }
  };

  const handleInputChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  const openRegistrationModal = (event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();

    // Backend API call will go here
    console.log('Registering for event:', selectedEvent.title, registrationData);

    // Add to registered events
    setRegisteredEvents([...registeredEvents, {
      ...selectedEvent,
      registrationId: `REG${Date.now()}`,
      registrationDate: new Date().toISOString()
    }]);

    setShowRegistrationModal(false);
    setShowSuccessModal(true);

    // Auto close success modal
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  const handleCancelRegistration = (eventId) => {
    // Backend API call will go here
    setRegisteredEvents(registeredEvents.filter(e => e.id !== eventId));
    alert('Registration cancelled successfully!');
  };

  const isRegistered = (eventId) => {
    return registeredEvents.some(e => e.id === eventId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Campus Events</h1>
        <p className="text-purple-100">Discover and register for upcoming events</p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* My Registered Events */}
      {registeredEvents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">My Registered Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registeredEvents.map(event => (
              <div key={event.id} className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                      <h3 className="font-semibold text-slate-900">{event.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{event.venue}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>

                <div className="bg-white rounded-lg p-3 mb-3">
                  <p className="text-xs text-slate-600">Registration ID</p>
                  <p className="font-mono text-sm font-semibold text-slate-900">{event.registrationId}</p>
                </div>

                <button
                  onClick={() => handleCancelRegistration(event.id)}
                  className="w-full py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all"
                >
                  Cancel Registration
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Upcoming Events ({filteredEvents.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const registered = isRegistered(event.id);

            return (
              <div
                key={event.id}
                className={`border-2 rounded-xl p-5 hover:shadow-lg transition-all ${
                  registered ? 'border-green-300 bg-green-50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl">{getCategoryIcon(event.category)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  {registered && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3">{event.title}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    event.registrationOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {event.registrationOpen ? 'Registration Open' : 'Registration Closed'}
                  </span>
                </div>

                <button
                  onClick={() => openRegistrationModal(event)}
                  disabled={!event.registrationOpen || registered}
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    registered
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : event.registrationOpen
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {registered ? 'Already Registered' : event.registrationOpen ? 'Register Now' : 'Registration Closed'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Event Registration</h2>
                  <p className="text-purple-100">{selectedEvent.title}</p>
                </div>
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="p-6 space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-purple-700">
                  Please confirm your details to complete the registration
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  You can edit phone number and team size. Other details are locked.
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={registrationData.name}
                    readOnly
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={registrationData.email}
                    readOnly
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="rollNumber"
                    value={registrationData.rollNumber}
                    readOnly
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={registrationData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Team Size
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    name="teamSize"
                    value={registrationData.teamSize}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white"
                  >
                    <option value="1">Individual (1)</option>
                    <option value="2">Team of 2</option>
                    <option value="3">Team of 3</option>
                    <option value="4">Team of 4</option>
                    <option value="5">Team of 5+</option>
                  </select>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Event Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Event:</span>
                    <span className="font-medium text-slate-900">{selectedEvent.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium text-slate-900">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Venue:</span>
                    <span className="font-medium text-slate-900">{selectedEvent.venue}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Registration Successful! 🎉</h2>
            <p className="text-slate-600 mb-6">
              You have been successfully registered for
            </p>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-lg text-purple-900">{selectedEvent.title}</h3>
              <p className="text-sm text-purple-700 mt-1">{selectedEvent.venue}</p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
