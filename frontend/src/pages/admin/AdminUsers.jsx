import { useMemo, useState } from 'react';
import { Plus, Pencil, Power, Users } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptyUser = {
  id: '',
  name: '',
  email: '',
  role: 'student',
  department: 'Computer Science',
  semester: '4',
  section: 'A',
  status: 'active',
};

const AdminUsers = () => {
  const { users, saveUser, toggleUserStatus } = useAdmin();
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(emptyUser);
  const [showModal, setShowModal] = useState(false);

  const departments = ['all', ...new Set(users.map((user) => user.department))];

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const roleMatch = selectedRole === 'all' || user.role === selectedRole;
        const departmentMatch = selectedDepartment === 'all' || user.department === selectedDepartment;
        return roleMatch && departmentMatch;
      }),
    [users, selectedRole, selectedDepartment]
  );

  const openModal = (user = null) => {
    setEditingUser(user);
    setFormData(user || { ...emptyUser, id: `${Date.now()}` });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData(emptyUser);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveUser({
      ...formData,
      semester: formData.role === 'student' ? formData.semester : '-',
      section: formData.role === 'student' ? formData.section : '-',
    });
    closeModal();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Management"
        description="Manage student and faculty records for the prototype admin portal."
        action={
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        }
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
            <option value="all">All roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
            {departments.map((department) => (
              <option key={department} value={department}>{department === 'all' ? 'All departments' : department}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Department</th>
                <th className="py-3 pr-4">Semester</th>
                <th className="py-3 pr-4">Section</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                  </td>
                  <td className="py-4 pr-4 capitalize text-slate-700 dark:text-slate-300">{user.role}</td>
                  <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{user.department}</td>
                  <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{user.semester}</td>
                  <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{user.section}</td>
                  <td className="py-4 pr-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(user)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                      <button onClick={() => toggleUserStatus(user.id)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <Power className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{editingUser ? 'Edit User' : 'Add User'}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Mock CRUD for prototype admin controls.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
                <input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Department" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} placeholder="Semester" disabled={formData.role !== 'student'} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 text-slate-900 dark:text-slate-100" />
                <input value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} placeholder="Section" disabled={formData.role !== 'student'} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 text-slate-900 dark:text-slate-100" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
