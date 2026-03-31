import { useMemo, useState } from 'react';
import { Headphones, MessageSquare, Mail, Phone, Clock } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminSupport = () => {
  const { supportTickets, supportSettings, saveSupportTicket, saveSupportSettings } = useAdmin();
  const [editingTicket, setEditingTicket] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('Open');
  const [settingsForm, setSettingsForm] = useState(supportSettings);

  const summary = useMemo(
    () => ({
      open: supportTickets.filter((ticket) => ticket.status === 'Open').length,
      inProgress: supportTickets.filter((ticket) => ticket.status === 'In Progress').length,
      resolved: supportTickets.filter((ticket) => ticket.status === 'Resolved').length,
    }),
    [supportTickets]
  );

  const openResponseModal = (ticket) => {
    setEditingTicket(ticket);
    setResponse(ticket.response || '');
    setStatus(ticket.status || 'Open');
  };

  const closeResponseModal = () => {
    setEditingTicket(null);
    setResponse('');
    setStatus('Open');
  };

  const handleSaveTicket = () => {
    if (!editingTicket) return;

    saveSupportTicket({
      ...editingTicket,
      response,
      status,
    });

    closeResponseModal();
  };

  const handleSaveSettings = (event) => {
    event.preventDefault();
    saveSupportSettings(settingsForm);
    alert('Support settings updated successfully.');
  };

  const getStatusTone = (ticketStatus) => {
    if (ticketStatus === 'Open') return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300';
    if (ticketStatus === 'In Progress') return 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300';
    if (ticketStatus === 'Resolved') return 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Support"
        description="Manage support contact details and respond to tickets raised from the student portal."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Open tickets</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{summary.open}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">In progress</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{summary.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Resolved</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{summary.resolved}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-3 mb-5">
            <MessageSquare className="w-5 h-5 text-cyan-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Support Tickets</h2>
          </div>

          <table className="w-full min-w-[880px]">
            <thead>
              <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 pr-4">Ticket</th>
                <th className="py-3 pr-4">Student</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-slate-100 dark:border-slate-800 align-top">
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{ticket.subject}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{ticket.description}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{ticket.studentName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{ticket.studentEmail}</p>
                  </td>
                  <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{ticket.category}</td>
                  <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{ticket.date}</td>
                  <td className="py-4 pr-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusTone(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <button onClick={() => openResponseModal(ticket)} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300">
                      Respond
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Headphones className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Support Settings</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Office Hours</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={settingsForm.officeHours} onChange={(e) => setSettingsForm({ ...settingsForm, officeHours: e.target.value })} className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">
              Save Settings
            </button>
          </form>
        </div>
      </div>

      {editingTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Respond to Ticket</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{editingTicket.subject}</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Student issue</p>
                <p className="text-slate-800 dark:text-slate-200">{editingTicket.description}</p>
              </div>

              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows="5" placeholder="Write your admin response..." className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />

              <div className="flex gap-3">
                <button onClick={closeResponseModal} type="button" className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button onClick={handleSaveTicket} type="button" className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">Save Response</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
