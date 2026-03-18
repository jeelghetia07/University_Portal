import { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  Send
} from 'lucide-react';
import { supportTickets as initialTickets } from '../../data/mockData';

const Support = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    description: ''
  });

  const faqs = [
    {
      id: 1,
      question: 'How do I register for courses?',
      answer:
        'Go to the Course Registration page from the sidebar. Browse available courses and register.',
      category: 'Academic'
    },
    {
      id: 2,
      question: 'How can I download my fee receipt?',
      answer:
        'Navigate to the Fees page and download the receipt from Payment History.',
      category: 'Fees'
    },
    {
      id: 3,
      question: 'Where can I check my exam schedule?',
      answer:
        'Visit the Exams page to see your complete exam schedule.',
      category: 'Exams'
    }
  ];

  const handleInputChange = (e) => {
    setNewTicket({
      ...newTicket,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();

    if (!newTicket.subject || !newTicket.category || !newTicket.description) {
      alert('Please fill all required fields');
      return;
    }

    const ticket = {
      id: `TKT${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      category: newTicket.category,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      description: newTicket.description
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', category: '', description: '' });
    setShowTicketForm(false);
    alert('Ticket submitted successfully!');
  };

  const getStatusColor = (status) => {
    if (status === 'Open') return 'bg-blue-100 text-blue-700';
    if (status === 'Resolved') return 'bg-green-100 text-green-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-teal-100">
          We're here to help you with any issues
        </p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Email Support */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Mail className="text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Email Support</h3>
          <p className="text-sm text-slate-600 mb-3">
            support@university.edu
          </p>
          <button
            onClick={() => setShowEmailModal(true)}
            className="text-blue-600 text-sm font-medium"
          >
            Send Email →
          </button>
        </div>

        {/* Phone Support */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Phone className="text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">Phone Support</h3>
          <p className="text-sm text-slate-600">+91 1800 XXX XXXX</p>
        </div>

        {/* Office Hours */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Clock className="text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2">Office Hours</h3>
          <p className="text-sm text-slate-600">Mon - Fri: 9 AM - 5 PM</p>
        </div>
      </div>

      {/* Raise Ticket */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Raise a Support Ticket</h2>
          {!showTicketForm && (
            <button
              onClick={() => setShowTicketForm(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg"
            >
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
              className="w-full border px-4 py-2 rounded-lg"
              required
            />

            <select
              name="category"
              value={newTicket.category}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-lg"
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
              className="w-full border px-4 py-2 rounded-lg"
              required
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowTicketForm(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Send size={16} />
                Submit
              </button>
            </div>
          </form>
        )}
      </div>

      {/* My Tickets */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">
          My Tickets ({tickets.length})
        </h2>

        {tickets.map(ticket => (
          <div key={ticket.id} className="border rounded-lg p-4 mb-3">
            <div className="flex gap-3 mb-2">
              <span className="font-mono text-sm">{ticket.id}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <h3 className="font-semibold">{ticket.subject}</h3>
            <p className="text-sm text-slate-600">{ticket.description}</p>
            <p className="text-xs text-slate-500 mt-1">
              {ticket.category} • {ticket.date}
            </p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">FAQs</h2>

        {faqs.map(faq => (
          <div key={faq.id} className="border rounded-lg mb-2">
            <button
              onClick={() =>
                setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
              }
              className="w-full flex justify-between p-4"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`transition ${
                  expandedFaq === faq.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedFaq === faq.id && (
              <div className="p-4 bg-slate-50 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Email Support</h3>

            <input
              type="text"
              placeholder="Subject"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData({ ...emailData, subject: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg mb-3"
            />

            <textarea
              rows="4"
              placeholder="Your message..."
              value={emailData.message}
              onChange={(e) =>
                setEmailData({ ...emailData, message: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Email sent to admin successfully!');
                  setEmailData({ subject: '', message: '' });
                  setShowEmailModal(false);
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

