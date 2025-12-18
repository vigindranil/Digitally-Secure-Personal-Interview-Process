"use client"
import React, { useState, useEffect } from 'react';
import { X, Plus, Briefcase, Award, MapPin, Loader2, Building2 } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';
import { mockApi, Post, Designation } from '../app/add-panel/api';

interface AddPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueId: string;
  onSuccess: () => void;
}

export default function AddPanelModal({
  isOpen,
  onClose,
  venueId,
  onSuccess,
}: AddPanelModalProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [selectedPost, setSelectedPost] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [venueLabel, setVenueLabel] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [postsData, designationsData, venuesData] = await Promise.all([
        mockApi.getPosts(),
        mockApi.getDesignations(),
        mockApi.getVenues(),
      ]);
      setPosts(postsData);
      setDesignations(designationsData);
      const v = venuesData.find(v => v.id === venueId);
      setVenueLabel(v?.label || '');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !selectedDesignation || !roomNumber) return;

    setIsLoading(true);
    try {
      await mockApi.createPanel({
        venueId,
        postId: selectedPost,
        designationId: selectedDesignation,
        roomNumber,
      });

      setSelectedPost('');
      setSelectedDesignation('');
      setRoomNumber('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating panel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-2 rounded-lg shadow-lg shadow-cyan-900/20">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add New Panel</h2>
              <p className="text-xs text-slate-500 mt-0.5">Configure panel details</p>
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  Venue
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={venueLabel}
                    disabled
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-900 text-sm"
                  />
                </div>
              </div>

              <SearchableDropdown
                options={posts.map((p) => ({ id: p.id, label: p.label }))}
                value={selectedPost}
                onChange={setSelectedPost}
                placeholder="Select a position..."
                icon={<Briefcase className="h-4 w-4" />}
                label="Interview Post"
              />

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
                  disabled={!selectedPost || !selectedDesignation || !roomNumber || isLoading}
                  className="flex-1 h-11 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-md shadow-cyan-200/50 hover:shadow-cyan-200 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Panel
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
