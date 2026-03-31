import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  announcements as baseAnnouncements,
  assignmentsData,
  availableCourses,
  courseMaterials,
  currentUser,
  examSchedule as baseExamSchedule,
  facultyData,
  feeData as baseFeeData,
  gradesData,
  supportTickets as baseSupportTickets,
  timetable,
} from '../data/mockData';

const ADMIN_STORAGE_KEY = 'adminPrototypeState';
const AdminContext = createContext(null);

const getBatchFromUser = (user) => {
  if (user.role !== 'student' || !user.id) return null;
  const admissionYear = user.id.slice(0, 2);
  return /^\d{2}$/.test(admissionYear) ? `20${admissionYear}` : null;
};

const buildInitialState = () => {
  const users = [
    {
      id: 'ADM001',
      name: 'Aarav Shah',
      email: 'admin@university.edu',
      password: '123456',
      recoveryEmail: 'admin.recovery@example.com',
      accountSetupComplete: true,
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
      password: '123456',
      recoveryEmail: 'student.recovery@example.com',
      accountSetupComplete: true,
      role: 'student',
      department: currentUser.department,
      batch: `${currentUser.enrollmentYear}`,
      semester: currentUser.semester,
      section: 'A',
      status: 'active',
    },
    ...facultyData.map((faculty, index) => ({
      id: `FAC${String(index + 1).padStart(3, '0')}`,
      name: faculty.name,
      email: faculty.email,
      password: '123456',
      recoveryEmail: `faculty${index + 1}@example.com`,
      accountSetupComplete: true,
      role: 'faculty',
      department: faculty.department,
      batch: '-',
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
      totalSeats: 100,
      filledSeats: 94,
    },
    {
      id: 'SEC002',
      department: 'Computer Science',
      batch: '2023',
      semester: 5,
      sectionName: 'A',
      totalSeats: 100,
      filledSeats: 100,
    },
    {
      id: 'SEC003',
      department: 'Computer Science',
      batch: '2023',
      semester: 5,
      sectionName: 'B',
      totalSeats: 100,
      filledSeats: 82,
    },
    {
      id: 'SEC004',
      department: 'Information Technology',
      batch: '2024',
      semester: 5,
      sectionName: 'A',
      totalSeats: 90,
      filledSeats: 76,
    },
    {
      id: 'SEC005',
      department: 'Electronics & Communication',
      batch: '2024',
      semester: 5,
      sectionName: 'A',
      totalSeats: 120,
      filledSeats: 108,
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

  const feeRecords = [
    {
      id: 'FEE001',
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      department: currentUser.department,
      semester: currentUser.semester,
      totalFee: baseFeeData.totalFee,
      paidAmount: baseFeeData.paidAmount,
      pendingAmount: baseFeeData.pendingAmount,
      dueDate: baseFeeData.dueDate,
      status: baseFeeData.status,
      paymentHistory: baseFeeData.paymentHistory,
      breakdown: baseFeeData.breakdown,
    },
  ];

  const supportTickets = baseSupportTickets.map((ticket) => ({
    ...ticket,
    studentId: currentUser.id,
    studentName: currentUser.name,
    studentEmail: currentUser.email,
  }));

  const supportSettings = {
    email: 'support@university.edu',
    phone: '+91 1800 XXX XXXX',
    officeHours: 'Mon - Fri: 9 AM - 5 PM',
  };

  return {
    users,
    courses,
    sections,
    facultyAssignments,
    timetableEntries,
    announcements,
    examSchedule,
    feeRecords,
    supportTickets,
    supportSettings,
  };
};

const getStoredState = () => {
  const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
  const initialState = buildInitialState();
  if (!stored) return initialState;

  try {
    const parsed = JSON.parse(stored);
    const normalizedUsers = (parsed.users || initialState.users).map((user) => {
      const matchingInitialUser = initialState.users.find((item) => item.id === user.id);
      return {
        ...matchingInitialUser,
        ...user,
        password: user.password ?? matchingInitialUser?.password ?? '',
        recoveryEmail: user.recoveryEmail ?? matchingInitialUser?.recoveryEmail ?? '',
        accountSetupComplete:
          user.accountSetupComplete ?? matchingInitialUser?.accountSetupComplete ?? false,
      };
    });
    const normalizedCourses = (parsed.courses || initialState.courses).map((course) => {
      const matchingInitialCourse = initialState.courses.find((item) => item.id === course.id);
      return {
        ...matchingInitialCourse,
        ...course,
        courseType: course.courseType || matchingInitialCourse?.courseType || 'core',
        seats: Number(course.seats ?? matchingInitialCourse?.seats ?? 0),
      };
    });
    const normalizedSections = (parsed.sections || initialState.sections).map((section) => {
      const matchingInitialSection = initialState.sections.find((item) => item.id === section.id);
      const shouldFixSem4CseBatch =
        section.id === 'SEC001' &&
        section.department === 'Computer Science' &&
        Number(section.semester) === 4;
      const shouldFixSem5CseBatch =
        (section.id === 'SEC002' || section.id === 'SEC003') &&
        section.department === 'Computer Science' &&
        Number(section.semester) === 5;

      return {
        ...matchingInitialSection,
        ...section,
        batch: shouldFixSem4CseBatch
          ? '2024'
          : shouldFixSem5CseBatch
            ? '2023'
            : section.batch ?? matchingInitialSection?.batch ?? '',
        totalSeats: Number(section.totalSeats ?? matchingInitialSection?.totalSeats ?? 0),
        filledSeats: Number(section.filledSeats ?? matchingInitialSection?.filledSeats ?? 0),
      };
    });
    return {
      ...initialState,
      ...parsed,
      users: normalizedUsers,
      courses: normalizedCourses,
      sections: normalizedSections,
      feeRecords: parsed.feeRecords || initialState.feeRecords,
      supportTickets: parsed.supportTickets || initialState.supportTickets,
      supportSettings: parsed.supportSettings || initialState.supportSettings,
    };
  } catch {
    return initialState;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, setState] = useState(getStoredState);

  useEffect(() => {
    const syncFromStorage = () => {
      setState(getStoredState());
    };

    const handleStorage = (event) => {
      if (event.key === ADMIN_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', syncFromStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', syncFromStorage);
    };
  }, []);

  const persist = (nextState) => {
    setState(nextState);
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(nextState));
  };

  const upsertById = (collection, record) =>
    collection.some((item) => item.id === record.id)
      ? collection.map((item) => (item.id === record.id ? record : item))
      : [record, ...collection];

  const saveUser = (user) => {
    const existingUser = state.users.find((item) => item.id === user.id);
    const nextState = {
      ...state,
      users: upsertById(state.users, {
        ...existingUser,
        ...user,
        password: user.password ?? existingUser?.password ?? '',
        recoveryEmail: user.recoveryEmail ?? existingUser?.recoveryEmail ?? '',
        accountSetupComplete:
          user.accountSetupComplete ?? existingUser?.accountSetupComplete ?? false,
        batch:
          user.role === 'student'
            ? user.batch || getBatchFromUser(user) || ''
            : '-',
      }),
    };
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

  const findUserByEmail = (email) =>
    state.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  const activateUserAccount = ({
    email,
    password,
    recoveryEmail,
    name,
    id,
    department,
    semester,
  }) => {
    const existingUser = findUserByEmail(email);

    if (!existingUser) {
      return {
        success: false,
        message: 'No university account was found for this email. Ask admin to create it first.',
      };
    }

    if (existingUser.accountSetupComplete) {
      return {
        success: false,
        message: 'This account is already activated. Please login instead.',
      };
    }

    if (existingUser.role === 'student') {
      if (id && existingUser.id && existingUser.id.toUpperCase() !== id.toUpperCase()) {
        return {
          success: false,
          message: 'Roll number does not match the admin-created student record.',
        };
      }

      if (
        department &&
        existingUser.department &&
        existingUser.department !== department
      ) {
        return {
          success: false,
          message: 'Department does not match the admin-created student record.',
        };
      }

      if (
        semester &&
        existingUser.semester &&
        String(existingUser.semester) !== String(semester)
      ) {
        return {
          success: false,
          message: 'Semester does not match the admin-created student record.',
        };
      }
    }

    const nextState = {
      ...state,
      users: state.users.map((user) =>
        user.email.toLowerCase() === email.toLowerCase()
          ? {
              ...user,
              name: name || user.name,
              password,
              recoveryEmail,
              accountSetupComplete: true,
            }
          : user
      ),
    };

    persist(nextState);
    return {
      success: true,
      user:
        nextState.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ||
        existingUser,
    };
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

  const deleteCourse = (courseId) => {
    const nextState = {
      ...state,
      courses: state.courses.filter((course) => course.id !== courseId),
      facultyAssignments: state.facultyAssignments.filter(
        (assignment) => assignment.courseId !== courseId
      ),
      timetableEntries: state.timetableEntries.filter((entry) => entry.courseId !== courseId),
    };
    persist(nextState);
  };

  const saveSection = (section) => {
    const nextState = {
      ...state,
      sections: upsertById(state.sections, {
        ...section,
        totalSeats: Number(section.totalSeats || 0),
        filledSeats: Number(section.filledSeats || 0),
      }),
    };
    persist(nextState);
  };

  const deleteSection = (sectionId) => {
    const nextState = {
      ...state,
      sections: state.sections.filter((section) => section.id !== sectionId),
      facultyAssignments: state.facultyAssignments.filter(
        (assignment) => assignment.sectionId !== sectionId
      ),
      timetableEntries: state.timetableEntries.filter((entry) => entry.sectionId !== sectionId),
    };
    persist(nextState);
  };

  const promoteBatch = (department, batch) => {
    const batchSections = state.sections.filter(
      (section) => section.department === department && section.batch === batch
    );

    if (!batchSections.length) {
      return { success: false, message: 'No sections found for this batch.' };
    }

    const currentSemester = Math.max(...batchSections.map((section) => Number(section.semester || 0)));
    if (currentSemester >= 8) {
      return { success: false, message: 'This batch is already in the final semester.' };
    }

    const promotedSectionIds = batchSections.map((section) => section.id);
    const nextState = {
      ...state,
      sections: state.sections.map((section) =>
        section.department === department && section.batch === batch
          ? { ...section, semester: Number(section.semester) + 1 }
          : section
      ),
      users: state.users.map((user) => {
        const userBatch = user.batch || getBatchFromUser(user);
        return user.role === 'student' &&
          user.department === department &&
          userBatch === batch &&
          Number(user.semester) === currentSemester
          ? { ...user, batch, semester: String(Number(user.semester) + 1) }
          : user;
      }),
      facultyAssignments: state.facultyAssignments.filter(
        (assignment) => !promotedSectionIds.includes(assignment.sectionId)
      ),
      timetableEntries: state.timetableEntries.filter(
        (entry) => !promotedSectionIds.includes(entry.sectionId)
      ),
    };

    persist(nextState);
    return {
      success: true,
      message: `${department} Batch ${batch} promoted from Semester ${currentSemester} to Semester ${currentSemester + 1}. Faculty allocations and timetable were cleared for reconfiguration.`,
    };
  };

  const promoteBranch = (department) => {
    const branchSections = state.sections.filter((section) => section.department === department);
    const batches = [...new Set(branchSections.map((section) => section.batch))];

    if (!batches.length) {
      return { success: false, message: 'No batches found for this branch.' };
    }

    const failures = [];
    batches.forEach((batch) => {
      const batchSectionsForSemester = state.sections.filter(
        (section) => section.department === department && section.batch === batch
      );
      const currentSemester = Math.max(
        ...batchSectionsForSemester.map((section) => Number(section.semester || 0))
      );
      if (currentSemester >= 8) {
        failures.push(batch);
      }
    });

    if (failures.length === batches.length) {
      return { success: false, message: 'All batches in this branch are already in the final semester.' };
    }

    let workingState = state;
    batches.forEach((batch) => {
      const batchSectionsForSemester = workingState.sections.filter(
        (section) => section.department === department && section.batch === batch
      );
      const currentSemester = Math.max(
        ...batchSectionsForSemester.map((section) => Number(section.semester || 0))
      );
      if (currentSemester >= 8) return;

      const promotedSectionIds = batchSectionsForSemester.map((section) => section.id);
      workingState = {
        ...workingState,
        sections: workingState.sections.map((section) =>
          section.department === department && section.batch === batch
            ? { ...section, semester: Number(section.semester) + 1 }
            : section
        ),
        users: workingState.users.map((user) => {
          const userBatch = user.batch || getBatchFromUser(user);
          return user.role === 'student' &&
            user.department === department &&
            userBatch === batch &&
            Number(user.semester) === currentSemester
            ? { ...user, batch, semester: String(Number(user.semester) + 1) }
            : user;
        }),
        facultyAssignments: workingState.facultyAssignments.filter(
          (assignment) => !promotedSectionIds.includes(assignment.sectionId)
        ),
        timetableEntries: workingState.timetableEntries.filter(
          (entry) => !promotedSectionIds.includes(entry.sectionId)
        ),
      };
    });

    persist(workingState);
    return {
      success: true,
      message:
        failures.length > 0
          ? `${department} branch promoted where possible. Final-semester batches were skipped: ${failures.join(', ')}.`
          : `${department} branch promoted to the next semester. Faculty allocations and timetable were cleared for reconfiguration.`,
    };
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

  const saveFeeRecord = (feeRecord) => {
    const nextState = {
      ...state,
      feeRecords: upsertById(state.feeRecords, {
        ...feeRecord,
        totalFee: Number(feeRecord.totalFee || 0),
        paidAmount: Number(feeRecord.paidAmount || 0),
        pendingAmount: Number(feeRecord.pendingAmount || 0),
      }),
    };
    persist(nextState);
  };

  const saveSupportTicket = (ticket) => {
    const nextState = {
      ...state,
      supportTickets: upsertById(state.supportTickets, ticket),
    };
    persist(nextState);
  };

  const saveSupportSettings = (settings) => {
    const nextState = {
      ...state,
      supportSettings: settings,
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
      findUserByEmail,
      activateUserAccount,
      toggleUserStatus,
      deleteUser,
      saveCourse,
      deleteCourse,
      saveSection,
      deleteSection,
      promoteBatch,
      promoteBranch,
      saveFacultyAssignment,
      deleteFacultyAssignment,
      saveTimetableEntry,
      deleteTimetableEntry,
      saveAnnouncement,
      toggleAnnouncementPin,
      toggleAnnouncementArchive,
      saveExam,
      deleteExam,
      saveFeeRecord,
      saveSupportTicket,
      saveSupportSettings,
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
