const AdminPageHeader = ({ title, description, action }) => (
  <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-6 text-white shadow-lg">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-slate-300">{description}</p>
      </div>
      {action}
    </div>
  </div>
);

export default AdminPageHeader;
