import { useMemo, useState } from 'react';
import {
  Mail,
  Phone,
  Clock,
  ChevronDown,
  Send,
  MessageSquare,
} from 'lucide-react';
import { currentUser } from '../../data/mockData';
import { useAdmin } from '../../context/AdminContext';
import { getAuthValue } from '../../utils/authStorage';

const Support = () => {
  const { supportTickets, supportSettings, saveSupportTicket } = useAdmin();
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    description: '',
  });

  const userEmail = getAuthValue('userEmail') || currentUser.email;
  const userName = getAuthValue('userName') || currentUser.name;
  const userRollNumber = getAuthValue('userRollNumber') || currentUser.id;

  const tickets = useMemo(
    () => supportTickets.filter((ticket) => ticket.studentEmail === userEmail),
    [supportTickets, userEmail]
  );

  const faqs = [
    {
      id: 1,
      question: 'How do I register for courses?',
      answer:
        'Go to the Course Registration page from the sidebar. Browse available courses and register.',
    },
    {
      id: 2,
      question: 'How can I download my fee receipt?',
      answer:
        'Navigate to the Fees page and check Payment History for the generated receipt entries.',
    },
    {
      id: 3,
      question: 'Where can I check my exam schedule?',
      answer: 'Visit the Exams page to see your complete exam schedule.',
    },
  ];

  const handleInputChange = (e) => {
    setNewTicket({
      ...newTicket,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();

    if (!newTicket.subject || !newTicket.category || !newTicket.description) {
      alert('Please fill all required fields');
      return;
    }

    const ticket = {
      id: `TKT${Date.now()}`,
      subject: newTicket.subject,
      category: newTicket.category,
      status: 'Open',
      priority: 'Medium',
      date: new Date().toISOString().split('T')[0],
      description: newTicket.description,
      studentId: userRollNumber,
      studentName: userName,
      studentEmail: userEmail,
      response: '',
    };

    saveSupportTicket(ticket);
    setNewTicket({ subject: '', category: '', description: '' });
    setShowTicketForm(false);
    alert('Ticket submitted successfully!');
  };

  const getStatusColor = (status) => {
    if (status === 'Open') return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300';
    if (status === 'In Progress') return 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300';
    if (status === 'Resolved') return 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-teal-100">Student requests are managed by the admin support desk</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex items-center justify-center mb-4">
            <Mail className="text-blue-600 dark:text-blue-300" />
          </div>
          <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Email Support</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{supportSettings.email}</p>
          <button onClick={() => setShowEmailModal(true)} className="text-blue-600 text-sm font-medium">
            Send Email &rarr;
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 rounded-lg flex items-center justify-center mb-4">
            <Phone className="text-green-600 dark:text-green-300" />
          </div>
          <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Phone Support</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{supportSettings.phone}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/30 rounded-lg flex items-center justify-center mb-4">
            <Clock className="text-purple-600 dark:text-purple-300" />
          </div>
          <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Office Hours</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{supportSettings.officeHours}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Raise a Support Ticket</h2>
          {!showTicketForm && (
            <button onClick={() => setShowTicketForm(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg">
              + New Ticket
            </button>
          )}
        </div>

        {showTicketForm && (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={newTicket.subject}
              onChange={handleInputChange}
              className="w-full border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              required
            />

            <select
              name="category"
              value={newTicket.category}
              onChange={handleInputChange}
              className="w-full border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              required
            >
              <option value="">Select Category</option>
              <option value="Academic">Academic</option>
              <option value="Technical">Technical</option>
              <option value="Fees">Fees</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              name="description"
              rows="4"
              placeholder="Describe your issue..."
              value={newTicket.description}
              onChange={handleInputChange}
              className="w-full border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              required
            />

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowTicketForm(false)} className="border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300">
                Cancel
              </button>
              <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Send size={16} />
                Submit
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">My Tickets ({tickets.length})</h2>

        {tickets.length === 0 && (
          <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800 text-center text-slate-500 dark:text-slate-400">
            No support tickets raised yet.
          </div>
        )}

        {tickets.map((ticket) => (
          <div key={ticket.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3">
            <div className="flex gap-3 mb-2 items-center">
              <span className="font-mono text-sm text-slate-600 dark:text-slate-400">{ticket.id}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{ticket.subject}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{ticket.description}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {ticket.category} • {ticket.date}
            </p>
            {ticket.response && (
              <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Admin response</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{ticket.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQs</h2>

        {faqs.map((faq) => (
          <div key={faq.id} className="border border-slate-200 dark:border-slate-700 rounded-lg mb-2">
            <button
              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              className="w-full flex justify-between p-4 text-left"
            >
              <span className="text-slate-900 dark:text-slate-100">{faq.question}</span>
              <ChevronDown className={`transition ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
            </button>
            {expandedFaq === faq.id && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Email Support</h3>

            <input
              type="text"
              placeholder="Subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              className="w-full border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg mb-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />

            <textarea
              rows="4"
              placeholder="Your message..."
              value={emailData.message}
              onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
              className="w-full border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg mb-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEmailModal(false)} className="border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!emailData.subject || !emailData.message) {
                    alert('Please fill subject and message');
                    return;
                  }

                  saveSupportTicket({
                    id: `MAIL${Date.now()}`,
                    subject: emailData.subject,
                    category: 'Email Support',
                    status: 'Open',
                    priority: 'Medium',
                    date: new Date().toISOString().split('T')[0],
                    description: emailData.message,
                    studentId: userRollNumber,
                    studentName: userName,
                    studentEmail: userEmail,
                    response: '',
                    channel: 'email',
                  });

                  setEmailData({ subject: '', message: '' });
                  setShowEmailModal(false);
                  alert('Email request sent to admin support successfully!');
                }}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
