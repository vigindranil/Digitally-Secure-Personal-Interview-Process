"use client"
import React, { useState, useEffect } from 'react';
import { X, Save, Briefcase, Award, MapPin, Loader2 } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';
import { getDesignationList, getVenueList, saveInterviewPanel } from '../app/add-panel/api';
type Designation = { id: string; label: string }

interface EditPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  panel: {
    id: string;
    panelName: string;
    roomNumber: string;
    postId: string | number;
    examId?: string;
    postLabel: string;
    designationId: string;
    designationLabel: string;
    venueId: string;
  };
  onSuccess: () => void;
  examId?: string;
  interviewerId?: string;
}

export default function EditPanelModal({
  isOpen,
  onClose,
  panel,
  onSuccess,
  examId,
  interviewerId = "0",
}: EditPanelModalProps) {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [selectedPost, setSelectedPost] = useState(panel.postId);
  const [selectedDesignation, setSelectedDesignation] = useState(panel.designationId);
  const [roomNumber, setRoomNumber] = useState(panel.roomNumber);
  const [panelName, setPanelName] = useState(panel.panelName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [venueLabel, setVenueLabel] = useState('');

  useEffect(() => {
    if (isOpen) {

      setSelectedPost(panel.postId);
      setSelectedDesignation(panel.designationId);
      setRoomNumber(panel.roomNumber);
    }
  }, [isOpen, panel]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setIsLoadingData(true);
      try {
        const [venuesRes, desigsRes] = await Promise.all([
          getVenueList(),
          getDesignationList(Number(panel.postId)),
        ]);
        const vopts = Array.isArray(venuesRes) ? venuesRes.map((v: any) => ({ id: String(v.venue_id), label: `${v.venue_name} | ${v.venue_address}` })) : [];
        const v = vopts.find(v => v.id === panel.venueId);
        setVenueLabel(v?.label || '');
        const dopts = Array.isArray(desigsRes) ? desigsRes.map((d: any) => ({ id: String(d.designation_id), label: String(d.designation_name) })) : [];
        setDesignations(dopts);
      } finally {
        setIsLoadingData(false);
      }
    })();
  }, [isOpen, panel.postId, panel.venueId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !selectedDesignation || !roomNumber || !panelName) return;

    setIsLoading(true);
    try {
      await saveInterviewPanel({
        panelId: Number(panel.id),
        postId: Number(selectedPost),
        designationId: Number(selectedDesignation),
        panelName,
        roomNumber,
        venueId: Number(panel.venueId),
        examId: Number(examId),
        entryUserId: Number(interviewerId),
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating panel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <Save className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Edit Panel</h2>
              <p className="text-xs text-slate-500 mt-0.5">Update panel details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isLoadingData ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              <p className="text-sm">Loading options...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Panel Name
                  </label>
                  <input
                    type="text"
                    value={panelName}
                    onChange={(e) => setPanelName(e.target.value)}
                    placeholder="e.g. Panel A"
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={venueLabel}
                    disabled
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  Post / Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={panel.postLabel}
                    disabled
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-900 text-sm"
                  />
                </div>
              </div>

              <SearchableDropdown
                options={designations.map((d) => ({ id: d.id, label: d.label }))}
                value={selectedDesignation}
                onChange={setSelectedDesignation}
                placeholder="Select a designation..."
                icon={<Award className="h-4 w-4" />}
                label="Designation"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  Room Number
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. Conference Hall A"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-11 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedPost || !selectedDesignation || !roomNumber || !panelName || isLoading}
                  className="flex-1 h-11 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-md shadow-blue-200/50 hover:shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
