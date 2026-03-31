import { useMemo, useState } from 'react';
import { DollarSign, Pencil } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptyRecord = {
  id: '',
  studentId: '',
  studentName: '',
  studentEmail: '',
  department: 'Computer Science',
  semester: 1,
  totalFee: 0,
  paidAmount: 0,
  pendingAmount: 0,
  dueDate: '',
  status: 'Pending',
  breakdown: [],
  paymentHistory: [],
};

const AdminFees = () => {
  const { feeRecords, saveFeeRecord } = useAdmin();
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState(emptyRecord);
  const [showModal, setShowModal] = useState(false);

  const summary = useMemo(() => {
    return feeRecords.reduce(
      (acc, record) => {
        acc.total += record.totalFee;
        acc.paid += record.paidAmount;
        acc.pending += record.pendingAmount;
        return acc;
      },
      { total: 0, paid: 0, pending: 0 }
    );
  }, [feeRecords]);

  const openModal = (record) => {
    setEditingRecord(record);
    setFormData(record);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingRecord(null);
    setFormData(emptyRecord);
    setShowModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveFeeRecord({
      ...formData,
      totalFee: Number(formData.totalFee),
      paidAmount: Number(formData.paidAmount),
      pendingAmount: Math.max(Number(formData.totalFee) - Number(formData.paidAmount), 0),
      semester: Number(formData.semester),
      status: Number(formData.totalFee) - Number(formData.paidAmount) === 0 ? 'Paid' : 'Pending',
    });
    closeModal();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Fees"
        description="Manage student fee records that are reflected in the student fee portal."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total billed</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">Rs {summary.total.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total collected</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">Rs {summary.paid.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total pending</p>
          <p className="text-3xl font-bold text-red-600 mt-2">Rs {summary.pending.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <th className="py-3 pr-4">Student</th>
              <th className="py-3 pr-4">Department</th>
              <th className="py-3 pr-4">Semester</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Paid</th>
              <th className="py-3 pr-4">Pending</th>
              <th className="py-3 pr-4">Due Date</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {feeRecords.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{record.studentName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{record.studentEmail}</p>
                </td>
                <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{record.department}</td>
                <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{record.semester}</td>
                <td className="py-4 pr-4 text-slate-900 dark:text-slate-100 font-semibold">Rs {record.totalFee.toLocaleString()}</td>
                <td className="py-4 pr-4 text-emerald-600 font-semibold">Rs {record.paidAmount.toLocaleString()}</td>
                <td className="py-4 pr-4 text-red-600 font-semibold">Rs {record.pendingAmount.toLocaleString()}</td>
                <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{record.dueDate}</td>
                <td className="py-4 pr-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${record.pendingAmount === 0 ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'}`}>
                    {record.pendingAmount === 0 ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <button onClick={() => openModal(record)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Fee Record</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Update values shown in the student fee portal.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={formData.studentName} disabled className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100" />
                <input value={formData.studentEmail} disabled className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100" />
                <input type="number" min="0" value={formData.totalFee} onChange={(e) => setFormData({ ...formData, totalFee: e.target.value })} placeholder="Total fee" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input type="number" min="0" value={formData.paidAmount} onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })} placeholder="Paid amount" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input type="number" min="1" max="8" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Pending amount will be recalculated automatically.</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-2">
                  Pending: Rs {Math.max(Number(formData.totalFee || 0) - Number(formData.paidAmount || 0), 0).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFees;
