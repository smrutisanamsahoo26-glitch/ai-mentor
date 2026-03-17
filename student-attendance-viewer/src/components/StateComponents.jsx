export const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center text-lg animate-fade-in">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-700 dark:text-slate-300">Loading students...</p>
    </div>
  </div>
);

export const ErrorState = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center text-red-600 animate-fade-in">
    <div className="card p-6">
      <p className="font-semibold">Error Loading Data</p>
      <p className="text-sm mt-2">{error}</p>
    </div>
  </div>
);

export const EmptyState = () => (
  <div className="min-h-screen flex items-center justify-center animate-fade-in">
    <div className="card p-6 text-center">
      <p className="font-semibold">No students available</p>
    </div>
  </div>
);
