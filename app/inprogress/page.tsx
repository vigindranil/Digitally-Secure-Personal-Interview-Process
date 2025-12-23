"use client"
import React from 'react';
import { Wrench, ArrowLeft } from 'lucide-react';

export default function WorkInProgress() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/30 flex items-center justify-center p-4 font-sans">
            <div className="max-w-lg w-full">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                    <div className="p-12 text-center">
                        {/* Icon section */}
                        <div className="inline-flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-600 p-5 rounded-xl shadow-md shadow-cyan-900/20 mb-6">
                            <Wrench className="h-12 w-12 text-white" />
                        </div>

                        {/* Main heading */}
                        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                            Work in Progress
                        </h1>

                        {/* Description */}
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            This page is currently under development and will be available soon.
                        </p>

                        {/* Action button */}
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 px-6 h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-md shadow-cyan-200/50 hover:shadow-cyan-200 active:scale-[0.98]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}