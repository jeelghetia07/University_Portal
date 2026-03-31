import { useState } from 'react';
import { DollarSign, CreditCard, Calendar, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { feeData as fallbackFeeData } from '../../data/mockData';
import { useAdmin } from '../../context/AdminContext';
import { getAuthValue } from '../../utils/authStorage';

const Fees = () => {
  const { feeRecords, saveFeeRecord } = useAdmin();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const userEmail = getAuthValue('userEmail');
  const userRollNumber = getAuthValue('userRollNumber');

  const feeData =
    feeRecords.find(
      (record) =>
        (userEmail && record.studentEmail === userEmail) ||
        (userRollNumber && record.studentId === userRollNumber)
    ) || fallbackFeeData;

  const isPaid = feeData.pendingAmount === 0;

  const handleDemoPayment = () => {
    const nextRecord = {
      ...feeData,
      paidAmount: feeData.totalFee,
      pendingAmount: 0,
      status: 'Paid',
      paymentHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          amount: feeData.pendingAmount,
          receiptNo: `REC/${new Date().getFullYear()}/${Date.now()}`,
          method: 'Online',
          status: 'Success',
        },
        ...feeData.paymentHistory,
      ],
    };

    if (feeData.id) {
      saveFeeRecord(nextRecord);
    }

    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Fee Management</h1>
        <p className="text-green-100">View fee records managed by the administration</p>
      </div>

      <div
        className={`rounded-xl shadow-sm border-2 p-6 ${
          isPaid
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border-green-200 dark:border-green-700'
            : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 border-red-200 dark:border-red-700'
        }`}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isPaid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              {isPaid ? (
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-300" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-300" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {isPaid ? 'Fee Paid' : 'Payment Pending'}
              </h2>
              <p className={`text-sm ${isPaid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {isPaid ? 'All dues cleared for this semester' : `Due date: ${new Date(feeData.dueDate).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              isPaid
                ? 'bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                : 'bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200'
            }`}
          >
            {feeData.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Fee</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">Rs {feeData.totalFee.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Paid Amount</p>
            <p className="text-3xl font-bold text-green-600">Rs {feeData.paidAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending Amount</p>
            <p className={`text-3xl font-bold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
              Rs {feeData.pendingAmount.toLocaleString()}
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-slate-900 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Fee Breakdown</h2>
        <div className="space-y-3">
          {feeData.breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">{item.item}</span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Rs {item.amount.toLocaleString()}</span>
            </div>
          ))}

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-lg border-2 border-indigo-200 dark:border-slate-600 mt-4">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">Total Fee</span>
            <span className="text-2xl font-bold text-indigo-600">Rs {feeData.totalFee.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-slate-900 dark:border-slate-700">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Payment History</h2>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Receipt No.</th>
                <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Method</th>
                <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {feeData.paymentHistory.map((payment, index) => (
                <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900 dark:text-slate-100">
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Rs {payment.amount.toLocaleString()}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-sm">{payment.receiptNo}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300">{payment.method}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300 rounded-full text-sm font-semibold">
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm text-slate-500">Receipt available</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {feeData.paymentHistory.map((payment, index) => (
            <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">Rs {payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(payment.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300 rounded-full text-xs font-semibold">
                  {payment.status}
                </span>
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Receipt No.</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{payment.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Method</span>
                  <span className="text-slate-900 dark:text-slate-100">{payment.method}</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-center py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="font-medium text-slate-500">Receipt available</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Payment Gateway</h2>
              <p className="text-slate-600 dark:text-slate-400">This is a demo payment interface</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 dark:text-slate-400">Amount to Pay</span>
                <span className="text-2xl font-bold text-green-600">Rs {feeData.pendingAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">Credit/Debit Card</span>
                </div>
                <span className="text-slate-400">&rarr;</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">UPI Payment</span>
                </div>
                <span className="text-slate-400">&rarr;</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">Net Banking</span>
                </div>
                <span className="text-slate-400">&rarr;</span>
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDemoPayment}
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
