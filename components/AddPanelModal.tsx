"use client"
import React, { useState, useEffect } from 'react';
import { X, Plus, Briefcase, Award, MapPin, Loader2, Building2 } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';
import { Post, Designation, getVenueList, getDesignationList, getPostList, getExamList, saveInterviewPanel, getExamDate } from '../app/add-panel/api';
import { getUser } from '@/hooks/getUser';
import { useToast } from '@/components/ui/use-toast';

interface AddPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueId: string;
  onSuccess: () => void;
  panel?: any;
}

export default function AddPanelModal({
  isOpen,
  onClose,
  venueId,
  onSuccess,
  panel,
}: AddPanelModalProps) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [selectedPost, setSelectedPost] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [venue, setVenue] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [examDates, setExamDates] = useState<any[]>([]);
  const [examDate, setExamDate] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [panelName, setPanelName] = useState('');
  const [user, setUser] = useState<any>(null);



  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const u = await getUser();
      setUser(u);
    })();
    loadData();
  }, [isOpen]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {

      const venuesData = await getVenueList();
      const v = venuesData.find((v: any) => String(v.venue_id) === String(venueId));
      setVenue(v);
      const examsData = await getExamList();
      setExams(examsData);
      if (panel) {
        const initialExamId = Number(panel?.exam_id ?? 0);
        const initialPostId = Number(panel?.post_id ?? 0);
        const initialDesigId = Number(panel?.designation_id ?? 0);
        setSelectedExam(initialExamId);
        setSelectedPost(initialPostId);
        setSelectedDesignation(initialDesigId);
        setPanelName(String(panel?.panel_name ?? ''));
        setRoomNumber(String(panel?.room_no ?? ''));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      if (!selectedExam) {
        setPosts([]);
        setSelectedPost('');
        setDesignations([]);
        setSelectedDesignation('');
        setExamDates([]);
        setExamDate('');
        return;
      }
      const edRes = await getExamDate(Number(selectedExam));
      const dates = Array.isArray(edRes?.data) ? edRes.data : Array.isArray(edRes) ? edRes : [];
      setExamDates(dates || []);
      const postsData = await getPostList(Number(selectedExam));
      setPosts(postsData || []);
      setSelectedPost('');
      setDesignations([]);
      setSelectedDesignation('');
    })();
  }, [selectedExam, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      if (!selectedPost) {
        setDesignations([]);
        setSelectedDesignation('');
        return;
      }
      const designationsData = await getDesignationList(Number(selectedPost));
      setDesignations(designationsData || []);
      setSelectedDesignation('');
    })();
  }, [selectedPost, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam || !selectedPost || !selectedDesignation || !panelName || !roomNumber) return;
    setIsLoading(true);
    try {
      const res = await saveInterviewPanel({
        panelId: Number(panel?.panel_id ?? 0),
        venueId: Number(venueId),
        examId: Number(selectedExam),
        postId: Number(selectedPost),
        designationId: Number(selectedDesignation),
        panelName: panelName,
        roomNumber: roomNumber,
        examDate: examDate,
        entryUserId: user?.user_id ?? 0,
      });

      if (res?.status === 0) {
        toast({
          title: 'Panel saved',
          description: panel ? 'Panel updated successfully' : 'Panel created successfully',
        });
        setSelectedExam('');
        setSelectedPost('');
        setSelectedDesignation('');
        setRoomNumber('');
        setPanelName('');
        setExamDate('');
        setExamDates([]);
        onSuccess();
        onClose();
      } else {
        toast({
          title: 'Save failed',
          description: res?.message || 'Unable to save panel',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating panel:', error);
      toast({
        title: 'Save failed',
        description: 'An unexpected error occurred while saving the panel',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-blue-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-2 rounded-lg shadow-lg shadow-cyan-900/20">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{panel ? 'Edit Panel' : 'Add New Panel'}</h2>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {isLoadingData ? (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              <p className="text-sm">Loading options...</p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  Venue
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={`${venue?.venue_name} | ${venue?.venue_address}` || ''}
                    disabled
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-900 text-sm"
                  />
                </div>
              </div>

              <SearchableDropdown
                options={exams.map((e: any) => ({ id: String(e.exam_id), label: e.exam_name }))}
                value={selectedExam}
                onChange={setSelectedExam}
                placeholder="Select a exam..."
                icon={<Briefcase className="h-4 w-4" />}
                label="Exam"
              />
              <SearchableDropdown
                disabled={!selectedExam}
                options={(examDates || []).map((d: any) => ({ id: String(d?.exam_date || ''), label: String(d?.exam_date || '') }))}
                value={examDate}
                onChange={setExamDate}
                placeholder="Select a exam date..."
                icon={<Briefcase className="h-4 w-4" />}
                label="Exam Date"
              />

              <SearchableDropdown
                disabled={!examDate}
                options={posts.map((p: any) => ({ id: String(p.post_id), label: p.post_name }))}
                value={selectedPost}
                onChange={setSelectedPost}
                placeholder="Select a position..."
                icon={<Briefcase className="h-4 w-4" />}
                label="Interview Post"
              />

              <SearchableDropdown
                disabled={!selectedPost}
                options={designations.map((d: any) => ({ id: String(d.designation_id), label: d.designation_name }))}
                value={selectedDesignation}
                onChange={setSelectedDesignation}
                placeholder="Select a designation..."
                icon={<Award className="h-4 w-4" />}
                label="Designation"
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  Panel name
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={panelName}
                    onChange={(e) => setPanelName(e.target.value)}
                    placeholder="e.g. Panel 1"
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
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
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-10 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedExam || !selectedPost || !selectedDesignation || !panelName || !roomNumber || isLoading}
                  className="flex-1 h-10 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-md shadow-cyan-200/50 hover:shadow-cyan-200 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      {panel ? 'Update Panel' : 'Add Panel'}
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
