import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/30 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-white rounded-full shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        </div>
        <p className="text-slate-600 font-medium">Loading Panel Management...</p>
      </div>
    </div>
  );
}