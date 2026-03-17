import { createContext, useContext, useMemo, useState } from 'react';
import {
  announcements as baseAnnouncements,
  assignmentsData,
  availableCourses,
  courseMaterials,
  currentUser,
  examSchedule as baseExamSchedule,
  facultyData,
  gradesData,
  timetable,
} from '../data/mockData';

const ADMIN_STORAGE_KEY = 'adminPrototypeState';
const AdminContext = createContext(null);

const buildInitialState = () => {
  const users = [
    {
      id: 'ADM001',
      name: 'Aarav Shah',
      email: 'admin@university.edu',
      role: 'admin',
      department: 'Administration',
      semester: '-',
      section: '-',
      status: 'active',
    },
    {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: 'student',
      department: currentUser.department,
      semester: currentUser.semester,
      section: 'A',
      status: 'active',
    },
    ...facultyData.map((faculty, index) => ({
      id: `FAC${String(index + 1).padStart(3, '0')}`,
      name: faculty.name,
      email: faculty.email,
      role: 'faculty',
      department: faculty.department,
      semester: '-',
      section: '-',
      status: 'active',
    })),
  ];

  const courses = availableCourses.map((course) => ({
    ...course,
    seats: course.capacity,
    courseType: course.courseType || 'core',
  }));

  const sections = [
    {
      id: 'SEC001',
      department: 'Computer Science',
      batch: '2024',
      semester: 4,
      sectionName: 'A',
    },
    {
      id: 'SEC002',
      department: 'Computer Science',
      batch: '2024',
      semester: 5,
      sectionName: 'A',
    },
    {
      id: 'SEC003',
      department: 'Computer Science',
      batch: '2024',
      semester: 5,
      sectionName: 'B',
    },
  ];

  const facultyAssignments = [
    { id: 'ALLOC001', facultyId: 'FAC001', courseId: 1, sectionId: 'SEC002' },
    { id: 'ALLOC002', facultyId: 'FAC002', courseId: 2, sectionId: 'SEC002' },
    { id: 'ALLOC003', facultyId: 'FAC003', courseId: 3, sectionId: 'SEC002' },
    { id: 'ALLOC004', facultyId: 'FAC004', courseId: 4, sectionId: 'SEC002' },
    { id: 'ALLOC005', facultyId: 'FAC005', courseId: 5, sectionId: 'SEC002' },
  ];

  const timetableEntries = timetable.flatMap((day, index) =>
    day.classes.map((entry, classIndex) => ({
      id: `TT${index}${classIndex}`,
      sectionId: 'SEC002',
      courseId: courses.find((course) => course.courseCode === entry.code)?.id || 1,
      facultyId:
        users.find((user) => user.role === 'faculty' && user.name === entry.faculty)?.id || 'FAC001',
      day: day.day,
      time: entry.time,
      room: entry.room,
    }))
  );

  const announcements = baseAnnouncements.map((announcement, index) => ({
    ...announcement,
    pinned: index === 0,
    archived: false,
    visibility: 'all',
    createdBy: 'ADM001',
  }));

  const examSchedule = baseExamSchedule.map((exam, index) => ({
    id: `EXAM${index + 1}`,
    ...exam,
  }));

  return {
    users,
    courses,
    sections,
    facultyAssignments,
    timetableEntries,
    announcements,
    examSchedule,
  };
};

const getStoredState = () => {
  const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
  const initialState = buildInitialState();
  if (!stored) return initialState;

  try {
    const parsed = JSON.parse(stored);
    const normalizedCourses = (parsed.courses || initialState.courses).map((course) => {
      const matchingInitialCourse = initialState.courses.find((item) => item.id === course.id);
      return {
        ...matchingInitialCourse,
        ...course,
        courseType: course.courseType || matchingInitialCourse?.courseType || 'core',
        seats: Number(course.seats ?? matchingInitialCourse?.seats ?? 0),
      };
    });
    return {
      ...initialState,
      ...parsed,
      courses: normalizedCourses,
    };
  } catch {
    return initialState;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, setState] = useState(getStoredState);

  const persist = (nextState) => {
    setState(nextState);
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(nextState));
  };

  const upsertById = (collection, record) =>
    collection.some((item) => item.id === record.id)
      ? collection.map((item) => (item.id === record.id ? record : item))
      : [record, ...collection];

  const saveUser = (user) => {
    const nextState = { ...state, users: upsertById(state.users, user) };
    persist(nextState);
  };

  const toggleUserStatus = (userId) => {
    const nextState = {
      ...state,
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ),
    };
    persist(nextState);
  };

  const deleteUser = (userId) => {
    const nextState = {
      ...state,
      users: state.users.filter((user) => user.id !== userId),
    };
    persist(nextState);
  };

  const saveCourse = (course) => {
    const nextState = {
      ...state,
      courses: upsertById(state.courses, {
        ...course,
        courseType: course.courseType || 'core',
      }),
    };
    persist(nextState);
  };

  const saveSection = (section) => {
    const nextState = { ...state, sections: upsertById(state.sections, section) };
    persist(nextState);
  };

  const saveFacultyAssignment = (assignment) => {
    const duplicate = state.facultyAssignments.find(
      (item) =>
        item.id !== assignment.id &&
        item.facultyId === assignment.facultyId &&
        item.courseId === assignment.courseId &&
        item.sectionId === assignment.sectionId
    );

    if (duplicate) {
      return { success: false, message: 'This faculty allocation already exists.' };
    }

    const nextState = {
      ...state,
      facultyAssignments: upsertById(state.facultyAssignments, assignment),
    };
    persist(nextState);
    return { success: true };
  };

  const deleteFacultyAssignment = (assignmentId) => {
    const nextState = {
      ...state,
      facultyAssignments: state.facultyAssignments.filter((item) => item.id !== assignmentId),
    };
    persist(nextState);
  };

  const saveTimetableEntry = (entry) => {
    const nextState = {
      ...state,
      timetableEntries: upsertById(state.timetableEntries, entry),
    };
    persist(nextState);
  };

  const deleteTimetableEntry = (entryId) => {
    const nextState = {
      ...state,
      timetableEntries: state.timetableEntries.filter((item) => item.id !== entryId),
    };
    persist(nextState);
  };

  const saveAnnouncement = (announcement) => {
    const nextState = {
      ...state,
      announcements: upsertById(state.announcements, announcement),
    };
    persist(nextState);
  };

  const toggleAnnouncementPin = (announcementId) => {
    const nextState = {
      ...state,
      announcements: state.announcements.map((announcement) =>
        announcement.id === announcementId
          ? { ...announcement, pinned: !announcement.pinned }
          : announcement
      ),
    };
    persist(nextState);
  };

  const toggleAnnouncementArchive = (announcementId) => {
    const nextState = {
      ...state,
      announcements: state.announcements.map((announcement) =>
        announcement.id === announcementId
          ? { ...announcement, archived: !announcement.archived }
          : announcement
      ),
    };
    persist(nextState);
  };

  const saveExam = (exam) => {
    const nextState = {
      ...state,
      examSchedule: upsertById(state.examSchedule, exam),
    };
    persist(nextState);
  };

  const deleteExam = (examId) => {
    const nextState = {
      ...state,
      examSchedule: state.examSchedule.filter((exam) => exam.id !== examId),
    };
    persist(nextState);
  };

  const value = useMemo(
    () => ({
      ...state,
      assignmentStats: assignmentsData,
      materialStats: courseMaterials,
      gradeStats: gradesData,
      saveUser,
      toggleUserStatus,
      deleteUser,
      saveCourse,
      saveSection,
      saveFacultyAssignment,
      deleteFacultyAssignment,
      saveTimetableEntry,
      deleteTimetableEntry,
      saveAnnouncement,
      toggleAnnouncementPin,
      toggleAnnouncementArchive,
      saveExam,
      deleteExam,
    }),
    [state]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
