// Mock data for the entire application

// Utility function to get department from roll number
export const getDepartmentFromRollNumber = (rollNumber) => {
  if (!rollNumber || rollNumber.length < 5) return 'Computer Science';
  
  const deptCode = rollNumber.substring(3, 5).toUpperCase();
  const deptMap = {
    'CP': 'Computer Science',
    'IT': 'Information Technology',
    'EC': 'Electronics & Communication',
    'CV': 'Civil Engineering',
    'ME': 'Mechanical Engineering',
    'EE': 'Electrical Engineering'
  };
  
  return deptMap[deptCode] || 'Computer Science';
};

export const currentUser = {
  id: "STU2024001",
  name: "Rahul Sharma",
  email: "rahul.sharma@university.edu",
  phone: "+91 98765 43210",
  department: "Computer Science",
  semester: 5,
  enrollmentYear: 2022,
  cgpa: 8.5,
  attendance: 85,
  profilePic: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=4F46E5&color=fff&size=200"
};

export const announcements = [
  {
    id: 1,
    title: "Mid-Term Exam Schedule Released",
    description: "Mid-term examinations will begin from March 15, 2025. Check your exam portal for detailed schedule.",
    date: "2025-01-15",
    category: "Academic",
    priority: "high"
  },
  {
    id: 2,
    title: "Tech Fest 2025 Registration Open",
    description: "Annual tech fest registration is now open. Register before January 30th to participate.",
    date: "2025-01-14",
    category: "Events",
    priority: "medium"
  },
  {
    id: 3,
    title: "Library Timing Extended",
    description: "Library will remain open till 10 PM during exam period starting from March 1st.",
    date: "2025-01-12",
    category: "General",
    priority: "low"
  },
  {
    id: 4,
    title: "Career Fair Next Week",
    description: "Top companies visiting campus for placements. Prepare your resumes!",
    date: "2025-01-10",
    category: "Events",
    priority: "high"
  }
];

export const availableCourses = [
  {
    id: 1,
    courseName: "Data Structures and Algorithms",
    courseCode: "CS301",
    credits: 4,
    department: "Computer Science",
    faculty: "Dr. Anjali Mehta",
    semester: 5,
    capacity: 60,
    enrolled: 45,
    schedule: "Mon, Wed, Fri - 9:00 AM to 10:00 AM",
    room: "CS-Block, Room 204",
    description: "Advanced data structures including trees, graphs, and hash tables. Algorithm design and analysis.",
    prerequisites: "Programming Fundamentals, Discrete Mathematics"
  },
  {
    id: 2,
    courseName: "Database Management Systems",
    courseCode: "CS302",
    credits: 4,
    department: "Computer Science",
    faculty: "Prof. Rajesh Kumar",
    semester: 5,
    capacity: 60,
    enrolled: 52,
    schedule: "Tue, Thu - 11:00 AM to 12:30 PM",
    room: "CS-Block, Room 301",
    description: "Relational databases, SQL, normalization, transaction management, and database design.",
    prerequisites: "None"
  },
  {
    id: 3,
    courseName: "Operating Systems",
    courseCode: "CS303",
    credits: 3,
    department: "Computer Science",
    faculty: "Dr. Priya Patel",
    semester: 5,
    capacity: 50,
    enrolled: 38,
    schedule: "Mon, Wed - 2:00 PM to 3:30 PM",
    room: "CS-Block, Room 105",
    description: "Process management, memory management, file systems, and OS internals.",
    prerequisites: "Computer Architecture"
  },
  {
    id: 4,
    courseName: "Computer Networks",
    courseCode: "CS304",
    credits: 3,
    department: "Computer Science",
    faculty: "Prof. Amit Verma",
    semester: 5,
    capacity: 55,
    enrolled: 41,
    schedule: "Tue, Thu - 9:00 AM to 10:30 AM",
    room: "CS-Block, Room 202",
    description: "Network protocols, TCP/IP, routing, switching, and network security fundamentals.",
    prerequisites: "None"
  },
  {
    id: 5,
    courseName: "Software Engineering",
    courseCode: "CS305",
    credits: 3,
    department: "Computer Science",
    faculty: "Dr. Sneha Joshi",
    semester: 5,
    capacity: 50,
    enrolled: 47,
    schedule: "Wed, Fri - 11:00 AM to 12:30 PM",
    room: "CS-Block, Room 303",
    description: "Software development lifecycle, design patterns, testing, and project management.",
    prerequisites: "Object Oriented Programming"
  },
  {
    id: 6,
    courseName: "Web Technologies",
    courseCode: "CS306",
    credits: 3,
    department: "Computer Science",
    faculty: "Prof. Vikram Singh",
    semester: 5,
    capacity: 45,
    enrolled: 32,
    schedule: "Mon, Fri - 3:30 PM to 5:00 PM",
    room: "Lab-2",
    description: "HTML, CSS, JavaScript, React, Node.js, and full-stack web development.",
    prerequisites: "Programming Fundamentals"
  }
];

export const enrolledCourses = [
  {
    id: 1,
    courseName: "Data Structures and Algorithms",
    courseCode: "CS301",
    credits: 4,
    faculty: "Dr. Anjali Mehta",
    schedule: "Mon, Wed, Fri - 9:00 AM",
    room: "CS-204",
    attendance: 88,
    grade: "A",
    enrollmentDate: "2024-08-01",
    status: "Active"
  },
  {
    id: 2,
    courseName: "Database Management Systems",
    courseCode: "CS302",
    credits: 4,
    faculty: "Prof. Rajesh Kumar",
    schedule: "Tue, Thu - 11:00 AM",
    room: "CS-301",
    attendance: 92,
    grade: "A+",
    enrollmentDate: "2024-08-01",
    status: "Active"
  },
  {
    id: 3,
    courseName: "Operating Systems",
    courseCode: "CS303",
    credits: 3,
    faculty: "Dr. Priya Patel",
    schedule: "Mon, Wed - 2:00 PM",
    room: "CS-105",
    attendance: 80,
    grade: "B+",
    enrollmentDate: "2024-08-01",
    status: "Active"
  },
  {
    id: 4,
    courseName: "Computer Networks",
    courseCode: "CS304",
    credits: 3,
    faculty: "Prof. Amit Verma",
    schedule: "Tue, Thu - 9:00 AM",
    room: "CS-202",
    attendance: 85,
    grade: "A",
    enrollmentDate: "2024-08-01",
    status: "Active"
  },
  {
    id: 5,
    courseName: "Software Engineering",
    courseCode: "CS305",
    credits: 3,
    faculty: "Dr. Sneha Joshi",
    schedule: "Wed, Fri - 11:00 AM",
    room: "CS-303",
    attendance: 90,
    grade: "A+",
    enrollmentDate: "2024-08-01",
    status: "Active"
  }
];

export const timetable = [
  {
    day: "Monday",
    classes: [
      { time: "9:00 AM - 10:00 AM", course: "Data Structures", code: "CS301", room: "CS-204", faculty: "Dr. Anjali Mehta" },
      { time: "2:00 PM - 3:30 PM", course: "Operating Systems", code: "CS303", room: "CS-105", faculty: "Dr. Priya Patel" }
    ]
  },
  {
    day: "Tuesday",
    classes: [
      { time: "9:00 AM - 10:30 AM", course: "Computer Networks", code: "CS304", room: "CS-202", faculty: "Prof. Amit Verma" },
      { time: "11:00 AM - 12:30 PM", course: "DBMS", code: "CS302", room: "CS-301", faculty: "Prof. Rajesh Kumar" }
    ]
  },
  {
    day: "Wednesday",
    classes: [
      { time: "9:00 AM - 10:00 AM", course: "Data Structures", code: "CS301", room: "CS-204", faculty: "Dr. Anjali Mehta" },
      { time: "11:00 AM - 12:30 PM", course: "Software Engineering", code: "CS305", room: "CS-303", faculty: "Dr. Sneha Joshi" },
      { time: "2:00 PM - 3:30 PM", course: "Operating Systems", code: "CS303", room: "CS-105", faculty: "Dr. Priya Patel" }
    ]
  },
  {
    day: "Thursday",
    classes: [
      { time: "9:00 AM - 10:30 AM", course: "Computer Networks", code: "CS304", room: "CS-202", faculty: "Prof. Amit Verma" },
      { time: "11:00 AM - 12:30 PM", course: "DBMS", code: "CS302", room: "CS-301", faculty: "Prof. Rajesh Kumar" }
    ]
  },
  {
    day: "Friday",
    classes: [
      { time: "9:00 AM - 10:00 AM", course: "Data Structures", code: "CS301", room: "CS-204", faculty: "Dr. Anjali Mehta" },
      { time: "11:00 AM - 12:30 PM", course: "Software Engineering", code: "CS305", room: "CS-303", faculty: "Dr. Sneha Joshi" }
    ]
  }
];

export const attendanceData = [
  { course: "Data Structures", code: "CS301", attended: 44, total: 50, percentage: 88 },
  { course: "DBMS", code: "CS302", attended: 46, total: 50, percentage: 92 },
  { course: "Operating Systems", code: "CS303", attended: 40, total: 50, percentage: 80 },
  { course: "Computer Networks", code: "CS304", attended: 42, total: 50, percentage: 85 },
  { course: "Software Engineering", code: "CS305", attended: 45, total: 50, percentage: 90 }
];

export const gradesData = {
  currentSemester: [
    { course: "Data Structures", code: "CS301", internal: 38, external: 75, total: 113, grade: "A", credits: 4 },
    { course: "DBMS", code: "CS302", internal: 40, external: 80, total: 120, grade: "A+", credits: 4 },
    { course: "Operating Systems", code: "CS303", internal: 32, external: 68, total: 100, grade: "B+", credits: 3 },
    { course: "Computer Networks", code: "CS304", internal: 36, external: 72, total: 108, grade: "A", credits: 3 },
    { course: "Software Engineering", code: "CS305", internal: 39, external: 78, total: 117, grade: "A+", credits: 3 }
  ],
  previousSemesters: [
    { semester: 1, sgpa: 8.2, totalCredits: 20 },
    { semester: 2, sgpa: 8.5, totalCredits: 22 },
    { semester: 3, sgpa: 8.8, totalCredits: 21 },
    { semester: 4, sgpa: 8.6, totalCredits: 23 }
  ],
  cgpa: 8.5
};

export const feeData = {
  totalFee: 85000,
  paidAmount: 85000,
  pendingAmount: 0,
  dueDate: "2024-08-15",
  status: "Paid",
  paymentHistory: [
    { date: "2024-08-10", amount: 85000, receiptNo: "REC/2024/001", method: "Online", status: "Success" },
    { date: "2024-02-05", amount: 80000, receiptNo: "REC/2024/002", method: "Online", status: "Success" },
    { date: "2023-08-12", amount: 75000, receiptNo: "REC/2023/001", method: "Cash", status: "Success" }
  ],
  breakdown: [
    { item: "Tuition Fee", amount: 60000 },
    { item: "Lab Fee", amount: 10000 },
    { item: "Library Fee", amount: 5000 },
    { item: "Sports Fee", amount: 3000 },
    { item: "Development Fee", amount: 7000 }
  ]
};

export const facultyData = [
  {
    id: 1,
    name: "Dr. Anjali Mehta",
    department: "Computer Science",
    email: "anjali.mehta@university.edu",
    phone: "+91 98765 11111",
    office: "CS-Block, Room 405",
    officeHours: "Mon, Wed - 10:00 AM to 12:00 PM",
    subjects: ["Data Structures", "Algorithms"],
    image: "https://ui-avatars.com/api/?name=Anjali+Mehta&background=EC4899&color=fff"
  },
  {
    id: 2,
    name: "Prof. Rajesh Kumar",
    department: "Computer Science",
    email: "rajesh.kumar@university.edu",
    phone: "+91 98765 22222",
    office: "CS-Block, Room 402",
    officeHours: "Tue, Thu - 2:00 PM to 4:00 PM",
    subjects: ["DBMS", "SQL"],
    image: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=10B981&color=fff"
  },
  {
    id: 3,
    name: "Dr. Priya Patel",
    department: "Computer Science",
    email: "priya.patel@university.edu",
    phone: "+91 98765 33333",
    office: "CS-Block, Room 408",
    officeHours: "Mon, Fri - 11:00 AM to 1:00 PM",
    subjects: ["Operating Systems", "System Programming"],
    image: "https://ui-avatars.com/api/?name=Priya+Patel&background=F59E0B&color=fff"
  },
  {
    id: 4,
    name: "Prof. Amit Verma",
    department: "Computer Science",
    email: "amit.verma@university.edu",
    phone: "+91 98765 44444",
    office: "CS-Block, Room 410",
    officeHours: "Wed, Fri - 3:00 PM to 5:00 PM",
    subjects: ["Computer Networks", "Network Security"],
    image: "https://ui-avatars.com/api/?name=Amit+Verma&background=8B5CF6&color=fff"
  },
  {
    id: 5,
    name: "Dr. Sneha Joshi",
    department: "Computer Science",
    email: "sneha.joshi@university.edu",
    phone: "+91 98765 55555",
    office: "CS-Block, Room 403",
    officeHours: "Tue, Thu - 10:00 AM to 12:00 PM",
    subjects: ["Software Engineering", "Project Management"],
    image: "https://ui-avatars.com/api/?name=Sneha+Joshi&background=EF4444&color=fff"
  }
];

export const libraryBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    isbn: "978-0262033848",
    available: true,
    type: "E-Book"
  },
  {
    id: 2,
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "Computer Science",
    isbn: "978-0078022159",
    available: true,
    type: "E-Book"
  },
  {
    id: 3,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    category: "Computer Science",
    isbn: "978-1118063330",
    available: true,
    type: "PDF"
  },
  {
    id: 4,
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    category: "Computer Science",
    isbn: "978-0132126953",
    available: true,
    type: "E-Book"
  },
  {
    id: 5,
    title: "Software Engineering",
    author: "Ian Sommerville",
    category: "Computer Science",
    isbn: "978-0133943030",
    available: false,
    type: "Physical"
  }
];

export const examSchedule = [
  { course: "Data Structures", code: "CS301", date: "2025-03-15", time: "9:00 AM - 12:00 PM", room: "Exam Hall A" },
  { course: "DBMS", code: "CS302", date: "2025-03-18", time: "2:00 PM - 5:00 PM", room: "Exam Hall B" },
  { course: "Operating Systems", code: "CS303", date: "2025-03-20", time: "9:00 AM - 12:00 PM", room: "Exam Hall A" },
  { course: "Computer Networks", code: "CS304", date: "2025-03-22", time: "2:00 PM - 5:00 PM", room: "Exam Hall C" },
  { course: "Software Engineering", code: "CS305", date: "2025-03-25", time: "9:00 AM - 12:00 PM", room: "Exam Hall B" }
];

export const events = [
  {
    id: 1,
    title: "Tech Fest 2025",
    date: "2025-02-15",
    time: "10:00 AM onwards",
    venue: "Main Auditorium",
    description: "Annual technical festival with coding competitions, hackathons, and tech talks.",
    category: "Technical",
    registrationOpen: true
  },
  {
    id: 2,
    title: "Cultural Night",
    date: "2025-02-20",
    time: "6:00 PM",
    venue: "Open Air Theatre",
    description: "Showcase your talents in music, dance, and drama.",
    category: "Cultural",
    registrationOpen: true
  },
  {
    id: 3,
    title: "Career Fair 2025",
    date: "2025-01-25",
    time: "9:00 AM - 5:00 PM",
    venue: "Convention Center",
    description: "Meet recruiters from top companies. Bring your resume!",
    category: "Career",
    registrationOpen: false
  },
  {
    id: 4,
    title: "Sports Day",
    date: "2025-03-05",
    time: "8:00 AM",
    venue: "Sports Complex",
    description: "Inter-departmental sports competition.",
    category: "Sports",
    registrationOpen: true
  }
];

export const supportTickets = [
  {
    id: "TKT001",
    subject: "Unable to access course materials",
    category: "Technical",
    status: "Open",
    priority: "High",
    date: "2025-01-15",
    description: "Cannot download lecture notes from CS301 course page."
  },
  {
    id: "TKT002",
    subject: "Fee receipt not generated",
    category: "Administrative",
    status: "Resolved",
    priority: "Medium",
    date: "2025-01-10",
    description: "Paid fees but receipt not showing in portal.",
    response: "Receipt has been generated and sent to your email."
  }
];