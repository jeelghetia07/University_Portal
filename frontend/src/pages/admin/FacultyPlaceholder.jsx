import { Info } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const FacultyPlaceholder = () => (
  <div className="space-y-6">
    <AdminPageHeader
      title="Faculty Portal"
      description="Faculty-specific portal will be implemented after the admin prototype is stabilized."
    />
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
        <Info className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Faculty portal is next</h2>
        <p className="text-slate-600 dark:text-slate-400">The login routing is ready for faculty, but the actual faculty pages are intentionally deferred until after the admin workflow is in place.</p>
      </div>
    </div>
  </div>
);

export default FacultyPlaceholder;
