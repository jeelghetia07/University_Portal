import { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Edit2, Save, X, Lock, Camera } from 'lucide-react';
import { currentUser, gradesData } from '../data/mockData';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(currentUser.profilePic);
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '+91 98765 43210',
    department: currentUser.department,
    semester: currentUser.semester,
    enrollmentYear: currentUser.enrollmentYear,
    studentID: currentUser.id,
    cgpa: currentUser.cgpa,
    address: '123 Main Street, Ahmedabad, Gujarat, India'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Calculate actual CGPA from grades data
  const calculateCGPA = () => {
    // Get SGPA from previous semesters
    const previousSemesters = gradesData.previousSemesters || [];
    
    // Calculate current semester SGPA
    const currentSemCourses = gradesData.currentSemester || [];
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    currentSemCourses.forEach(course => {
      const gradePoint = getGradePoint(course.grade);
      totalGradePoints += gradePoint * course.credits;
      totalCredits += course.credits;
    });
    
    const currentSGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    
    // Calculate CGPA: (sum of all SGPAs) / (total semesters)
    const allSGPAs = [...previousSemesters.map(sem => sem.sgpa), currentSGPA];
    const cgpa = allSGPAs.reduce((sum, sgpa) => sum + sgpa, 0) / allSGPAs.length;
    
    return cgpa.toFixed(2);
  };

  // Helper function to convert grade to grade point
  const getGradePoint = (grade) => {
    const gradeMap = {
      'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
    };
    return gradeMap[grade] || 0;
  };

  // Handle profile picture upload
  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        
        // In a real app, you would upload to server here:
        // uploadProfilePicture(file);
        
        console.log('Profile picture selected:', file.name);
        alert('Profile picture updated! (In production, this would be uploaded to the server)');
      };
      reader.readAsDataURL(file);
    }
  };

  // In real implementation, this function would upload to backend
  const uploadProfilePicture = async (file) => {
    // Example API call:
    /*
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('studentID', profileData.studentID);
    
    try {
      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setProfilePicture(data.imageUrl); // URL from server
        alert('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload profile picture');
    }
    */
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // In real app: API call to update profile
    /*
    const updateData = {
      phone: profileData.phone,
      address: profileData.address
      // Note: name and email are NOT included (frozen fields)
    };
    
    fetch('/api/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(updateData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Profile updated successfully!');
        setIsEditing(false);
      }
    });
    */
    
    console.log('Saving profile:', {
      phone: profileData.phone,
      address: profileData.address
    });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset to original values
    setProfileData({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || '+91 98765 43210',
      department: currentUser.department,
      semester: currentUser.semester,
      enrollmentYear: currentUser.enrollmentYear,
      studentID: currentUser.id,
      cgpa: currentUser.cgpa,
      address: '123 Main Street, Ahmedabad, Gujarat, India'
    });
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    // In real app: API call to change password
    /*
    fetch('/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Password changed successfully!');
        setShowPasswordModal(false);
      }
    });
    */
    
    console.log('Changing password...');
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Get calculated CGPA
  const actualCGPA = calculateCGPA();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-indigo-100">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Profile Picture */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
            <div className="flex items-end space-x-4">
              <div className="relative">
                <img
                  src={profilePicture}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <button
                  onClick={handleProfilePictureClick}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-all shadow-lg"
                  title="Upload profile picture"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-slate-900">{profileData.name}</h2>
                <p className="text-slate-600">{profileData.studentID}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4 md:mt-0">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
              
              {/* Full Name - FROZEN */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-xs text-slate-500">(Cannot be changed)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email - FROZEN */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address <span className="text-xs text-slate-500">(Cannot be changed)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone - EDITABLE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                      isEditing
                        ? 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    } outline-none transition-all`}
                  />
                </div>
              </div>

              {/* Address - EDITABLE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                      isEditing
                        ? 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    } outline-none transition-all`}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Academic Information</h3>
              
              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Student ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.studentID}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.department}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none"
                  />
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Semester
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={`Semester ${profileData.semester}`}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none"
                  />
                </div>
              </div>

              {/* Enrollment Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enrollment Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.enrollmentYear}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none"
                  />
                </div>
              </div>

              {/* CGPA - Calculated from grades */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current CGPA <span className="text-xs text-slate-500">(Auto-calculated)</span>
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={`${actualCGPA} / 10`}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Calculated as: (Sum of all semester SGPAs) / (Total semesters)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;