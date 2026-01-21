import { useState } from 'react';
import { DollarSign, Download, CreditCard, Calendar, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { feeData } from '../data/mockData';

const Fees = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isPaid = feeData.pendingAmount === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Fee Management</h1>
        <p className="text-green-100">View and manage your fee payments</p>
      </div>

      {/* Fee Status Card */}
      <div className={`rounded-xl shadow-sm border-2 p-6 ${
        isPaid 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
      }`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isPaid ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isPaid ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isPaid ? 'Fee Paid' : 'Payment Pending'}
              </h2>
              <p className={`text-sm ${isPaid ? 'text-green-700' : 'text-red-700'}`}>
                {isPaid ? 'All dues cleared for this semester' : `Due date: ${new Date(feeData.dueDate).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            isPaid ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
          }`}>
            {feeData.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">Total Fee</p>
            <p className="text-3xl font-bold text-slate-900">₹{feeData.totalFee.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">Paid Amount</p>
            <p className="text-3xl font-bold text-green-600">₹{feeData.paidAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">Pending Amount</p>
            <p className={`text-3xl font-bold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
              ₹{feeData.pendingAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {!isPaid && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full mt-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            Pay Now
          </button>
        )}
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Fee Breakdown</h2>
        
        <div className="space-y-3">
          {feeData.breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium text-slate-900">{item.item}</span>
              </div>
              <span className="text-lg font-bold text-slate-900">₹{item.amount.toLocaleString()}</span>
            </div>
          ))}
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 mt-4">
            <span className="font-bold text-slate-900 text-lg">Total Fee</span>
            <span className="text-2xl font-bold text-indigo-600">₹{feeData.totalFee.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all">
            <Download className="w-4 h-4" />
            <span className="font-semibold text-sm">Download All</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-700">Date</th>
                <th className="text-left p-4 font-semibold text-slate-700">Amount</th>
                <th className="text-left p-4 font-semibold text-slate-700">Receipt No.</th>
                <th className="text-left p-4 font-semibold text-slate-700">Method</th>
                <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                <th className="text-right p-4 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {feeData.paymentHistory.map((payment, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-900">₹{payment.amount.toLocaleString()}</td>
                  <td className="p-4 text-slate-600 font-mono text-sm">{payment.receiptNo}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{payment.method}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="flex items-center space-x-1 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all ml-auto">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {feeData.paymentHistory.map((payment, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-lg text-slate-900">₹{payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(payment.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {payment.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Receipt No.</span>
                  <span className="font-mono text-slate-900">{payment.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Method</span>
                  <span className="text-slate-900">{payment.method}</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center space-x-2 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all">
                <Download className="w-4 h-4" />
                <span className="font-medium">Download Receipt</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Gateway</h2>
              <p className="text-slate-600">This is a demo payment interface</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Amount to Pay</span>
                <span className="text-2xl font-bold text-green-600">₹{feeData.pendingAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Credit/Debit Card</span>
                </div>
                <span className="text-slate-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">UPI Payment</span>
                </div>
                <span className="text-slate-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Net Banking</span>
                </div>
                <span className="text-slate-400">→</span>
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Payment processing... (Demo mode)');
                  setShowPaymentModal(false);
                }}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;