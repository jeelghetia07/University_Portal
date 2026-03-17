import { currentUser, facultyData } from './mockData';

export const mockAuthUsers = [
  {
    id: 'ADM001',
    name: 'Aarav Shah',
    email: 'admin@university.edu',
    password: '123456',
    role: 'admin',
    department: 'Administration',
    profilePic: 'https://ui-avatars.com/api/?name=Aarav+Shah&background=f59e0b&color=fff&size=200',
  },
  {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    password: '123456',
    role: 'student',
    department: currentUser.department,
    profilePic: currentUser.profilePic,
  },
  {
    id: 'FAC001',
    name: facultyData[0].name,
    email: facultyData[0].email,
    password: '123456',
    role: 'faculty',
    department: facultyData[0].department,
    profilePic: facultyData[0].image,
  },
];

export const findMockAuthUser = (email) =>
  mockAuthUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const getDefaultRouteForRole = (role) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'faculty') return '/faculty/overview';
  return '/dashboard';
};
