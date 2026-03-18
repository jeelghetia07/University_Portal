const AUTH_KEYS = [
  'authToken',
  'authPersistence',
  'userEmail',
  'userRole',
  'userName',
  'userDepartment',
  'userProfilePic',
  'userRollNumber',
];

const clearLegacyLocalAuth = () => {
  const hasLegacyAuthToken = localStorage.getItem('authToken');
  const hasPersistenceMarker = localStorage.getItem('authPersistence');

  if (hasLegacyAuthToken && !hasPersistenceMarker) {
    AUTH_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
  }
};

export const getAuthValue = (key) => {
  clearLegacyLocalAuth();
  const sessionValue = sessionStorage.getItem(key);
  if (sessionValue !== null) return sessionValue;
  return localStorage.getItem(key);
};

export const clearAuthSession = () => {
  AUTH_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};

export const persistAuthSession = (sessionData, rememberMe = false) => {
  clearAuthSession();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('authPersistence', rememberMe ? 'local' : 'session');

  Object.entries(sessionData).forEach(([key, value]) => {
    storage.setItem(key, value);
  });
};

export const isAuthenticated = () => Boolean(getAuthValue('authToken'));
