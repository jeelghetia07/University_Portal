import { getAuthValue } from '../../utils/authStorage';

export const getFacultyContext = (users, courses, sections, facultyAssignments, timetableEntries) => {
  const facultyEmail = getAuthValue('userEmail');
  const facultyId = getAuthValue('userRollNumber') || users.find((user) => user.email === facultyEmail)?.id;
  const facultyUser = users.find((user) => user.id === facultyId) || users.find((user) => user.email === facultyEmail);

  const assignedAllocations = facultyAssignments.filter((assignment) => assignment.facultyId === facultyUser?.id);
  const assignedCourseViews = assignedAllocations.map((assignment) => {
    const course = courses.find((item) => item.id === assignment.courseId);
    const section = sections.find((item) => item.id === assignment.sectionId);
    return {
      allocationId: assignment.id,
      course,
      section,
    };
  }).filter((item) => item.course && item.section);

  const assignedCourseCodes = [...new Set(assignedCourseViews.map((item) => item.course.courseCode))];
  const assignedSectionIds = [...new Set(assignedCourseViews.map((item) => item.section.id))];
  const facultyTimetable = timetableEntries.filter((entry) => entry.facultyId === facultyUser?.id);

  return {
    facultyEmail,
    facultyId: facultyUser?.id || '',
    facultyUser,
    assignedAllocations,
    assignedCourseViews,
    assignedCourseCodes,
    assignedSectionIds,
    facultyTimetable,
  };
};
