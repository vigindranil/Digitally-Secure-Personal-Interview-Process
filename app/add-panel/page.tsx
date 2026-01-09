"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutGrid,
  Plus,
  Building2,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import SearchableDropdown from '../../components/SearchableDropdown';
import AddPanelModal from '../../components/AddPanelModal';
import { mockApi, Venue, Panel, getVenueList, getInterviewPanelInfo } from './api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { sanitizeString } from '@/lib/security-utils';


export default function PanelManagement() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [panels, setPanels] = useState<any[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [isLoadingPanels, setIsLoadingPanels] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPanelRaw, setEditingPanelRaw] = useState<any | null>(null);
  const [deletingPanelId, setDeletingPanelId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);



  const normalizePanel = (p: any): Panel => ({
    id: sanitizeString(String(p?.panel_id ?? '')),
    panelName: sanitizeString(String(p?.panel_name ?? '')),
    roomNumber: sanitizeString(String(p?.room_no ?? '')),
    postId: sanitizeString(String(p?.post_id ?? '')),
    postLabel: sanitizeString(String(p?.post_name ?? '')),
    designationId: sanitizeString(String(p?.designation_id ?? '')),
    designationLabel: sanitizeString(String(p?.designation_name ?? '')),
    venueId: sanitizeString(String(p?.venue_id ?? '')),
  });

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    if (selectedVenue) {
      loadPanels();
    } else {
      setPanels([]);
    }
  }, [selectedVenue]);


  const handleTestError = () => {
    throw new Error('This is a test error from the Test Error button');
  };



  const loadVenues = async () => {
    setIsLoadingVenues(true);
    try {
      const data = await getVenueList();
      setVenues(data);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setIsLoadingVenues(false);
    }
  };


  const loadPanels = async () => {
    if (!selectedVenue) return;
    const venueId = parseInt(selectedVenue, 10);
    if (isNaN(venueId)) {
      // handle error
      return;
    }


    setIsLoadingPanels(true);
    try {
      const res = await getInterviewPanelInfo(venueId, 0);
      const next = res?.status === 0 && Array.isArray(res?.data) ? res.data : [];
      setPanels(next);
    } catch (error) {
      console.error('Error loading panels:', error);
    } finally {
      setIsLoadingPanels(false);
    }
  };

  const handleDeletePanel = async (id: string) => {
    setDeletingPanelId(id);
    try {
      await mockApi.deletePanel(id);
      await loadPanels();
    } catch (error) {
      console.error('Error deleting panel:', error);
    } finally {
      setDeletingPanelId(null);
    }
  };

  const handleEditClick = (panel: any) => {
    setEditingPanelRaw(panel);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/30 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-900/20">
            <LayoutGrid className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Panel Management
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Configure interview rooms and slot allocations
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
              <div className="w-full sm:w-96">
                {isLoadingVenues ? (
                  <div className="h-11 rounded-xl border border-slate-200 bg-slate-50/30 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 w-full">
                    <SearchableDropdown
                      options={venues.map((v) => ({
                        id: String(v.venue_id),
                        label: `${v.venue_name} | ${v.venue_address}`,
                      }))}
                      value={selectedVenue}
                      onChange={setSelectedVenue}
                      placeholder="Select a venue..."
                      icon={<Building2 className="h-4 w-4" />}
                      label="Interview Venue"
                    />
                  </div>

                )}
              </div>

              {selectedVenue && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-md shadow-cyan-200/50 hover:shadow-cyan-200 active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  Add Panel
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {!selectedVenue ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <Building2 className="h-10 w-10 opacity-50" />
                </div>
                <p className="text-sm font-medium">Please select a venue</p>
                <p className="text-xs opacity-70 mt-1">
                  Choose a venue to view and manage panels
                </p>
              </div>
            ) : isLoadingPanels ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="text-sm font-medium">Loading panels...</p>
              </div>
            ) : panels?.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <AlertCircle className="h-10 w-10 opacity-50" />
                </div>
                <p className="text-sm font-medium">No panels found</p>
                <p className="text-xs opacity-70 mt-1">
                  Click "Add Panel" to create your first panel
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Panel Name
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Room Number
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Post
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Designation
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {panels?.map((panel) => (
                      <tr
                        key={String(panel.panel_id)}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="text-sm font-semibold text-slate-900">
                            {panel.panel_name}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-700">
                            {panel.room_no}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-cyan-50 text-xs font-medium text-cyan-700 border border-cyan-100">
                            {panel.post_name}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-xs font-medium text-blue-700 border border-blue-100">
                            {panel.designation_name}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(normalizePanel(panel))}
                              className="h-9 w-9 flex items-center justify-center hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                              title="Edit panel"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => { setConfirmTargetId(String(panel.panel_id)); setConfirmOpen(true) }}
                              disabled={deletingPanelId === String(panel.panel_id)}
                              className="h-9 w-9 flex items-center justify-center hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete panel"
                            >
                              {deletingPanelId === String(panel.panel_id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                Cookies.set('selected_panel', JSON.stringify(panel), { path: '/' });
                                router.push(`/panel-details/${String(panel.panel_id)}?venueId=${selectedVenue}`);
                              }}
                              className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm shadow-cyan-200 transition-all"
                              title="View panel details"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Panel</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Do you want to delete this panel?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setConfirmOpen(false); setConfirmTargetId(null) }}
                className="px-4 py-2 rounded-md bg-white border border-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!confirmTargetId) return;
                  await handleDeletePanel(confirmTargetId);
                  setConfirmOpen(false);
                  setConfirmTargetId(null);
                }}
                className="px-4 py-2 rounded-md bg-rose-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedVenue && (
        <AddPanelModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          venueId={selectedVenue}
          onSuccess={loadPanels}
        />
      )}

      {editingPanelRaw && (
        <AddPanelModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPanelRaw(null);
          }}
          venueId={selectedVenue}
          onSuccess={loadPanels}
          panel={editingPanelRaw}
        />
      )}
    </div>
  );
}
