export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center">
          <span className="text-rose-600 font-bold">403</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-600">You dont have permission to access this page.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/dashboard" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">Go to Dashboard</a>
          <a href="/" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Sign In</a>
        </div>
      </div>
    </div>
  )
}