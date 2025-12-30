export interface Venue {
  id: string;
  label: string;
  venue_id?: string;
  venue_name?: string;
  venue_address?: string;
}

export interface Post {
  // post_id: string | number;
  id: string;
  label: string;
  // post_name: string;
}

export interface Designation {
  id: string;
  label: string;
}

export interface Panel {
  id: string;
  panelName: string;
  roomNumber: string;
  postId: string;
  postLabel: string;
  designationId: string;
  designationLabel: string;
  venueId: string;
  examId?: string;
}

export interface PanelAssignment {
  id: string;
  panelId: string;
  interviewerId: string;
  interviewerName: string;
  date: string;
}

export interface CreatePanelRequest {
  venueId: string;
  postId: string;
  designationId: string;
  roomNumber: string;
}

const MOCK_VENUES: Venue[] = [
  { id: 'v1', label: 'Main Campus - Building A' },
  { id: 'v2', label: 'Tech Park - Tower B' },
  { id: 'v3', label: 'Innovation Hub - Ground Floor' },
  { id: 'v4', label: 'Downtown Office - 5th Floor' },
];

const MOCK_POSTS: Post[] = [
  { id: 'p1', label: 'Senior Frontend Engineer' },
  { id: 'p2', label: 'Backend Developer' },
  { id: 'p3', label: 'UI/UX Designer' },
  { id: 'p4', label: 'Product Manager' },
  { id: 'p5', label: 'DevOps Engineer' },
  { id: 'p6', label: 'Data Scientist' },
];

const MOCK_DESIGNATIONS: Designation[] = [
  { id: 'd1', label: 'Senior Panel Member' },
  { id: 'd2', label: 'Technical Interviewer' },
  { id: 'd3', label: 'HR Representative' },
  { id: 'd4', label: 'Team Lead' },
  { id: 'd5', label: 'Principal Engineer' },
];

let MOCK_PANELS: Panel[] = [
  {
    id: '1',
    panelName: 'Panel A',
    roomNumber: 'Conf-A 101',
    postId: 'p1',
    postLabel: 'Senior Frontend Engineer',
    designationId: 'd1',
    designationLabel: 'Senior Panel Member',
    venueId: 'v1',
  },
  {
    id: '2',
    panelName: 'Panel B',
    roomNumber: 'Meeting Room B',
    postId: 'p4',
    postLabel: 'Product Manager',
    designationId: 'd3',
    designationLabel: 'HR Representative',
    venueId: 'v1',
  },
  {
    id: '3',
    panelName: 'Panel C',
    roomNumber: 'Zoom Pod 4',
    postId: 'p3',
    postLabel: 'UI/UX Designer',
    designationId: 'd2',
    designationLabel: 'Technical Interviewer',
    venueId: 'v2',
  },
];

let MOCK_ASSIGNMENTS: PanelAssignment[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  getVenues: async (): Promise<Venue[]> => {
    await delay(300);
    return MOCK_VENUES;
  },
  getVenueById: async (id: string): Promise<Venue | null> => {
    await delay(200);
    return MOCK_VENUES.find(v => v.id === id) || null;
  },

  getPosts: async (): Promise<Post[]> => {
    await delay(300);
    return MOCK_POSTS;
  },

  getDesignations: async (): Promise<Designation[]> => {
    await delay(300);
    return MOCK_DESIGNATIONS;
  },

  getPanelsByVenue: async (venueId: string): Promise<Panel[]> => {
    await delay(400);
    return MOCK_PANELS.filter((panel) => panel.venueId === venueId);
  },
  getPanelById: async (id: string): Promise<Panel | null> => {
    await delay(300);
    return MOCK_PANELS.find(p => p.id === id) || null;
  },

  createPanel: async (data: CreatePanelRequest): Promise<Panel> => {
    await delay(500);

    const post = MOCK_POSTS.find((p) => p.id === data.postId);
    const designation = MOCK_DESIGNATIONS.find((d) => d.id === data.designationId);

    const newPanel: Panel = {
      id: Date.now().toString(),
      panelName: `Panel ${String.fromCharCode(65 + MOCK_PANELS.length)}`,
      roomNumber: data.roomNumber,
      postId: data.postId,
      postLabel: post?.label || '',
      designationId: data.designationId,
      designationLabel: designation?.label || '',
      venueId: data.venueId,
    };

    MOCK_PANELS.push(newPanel);
    return newPanel;
  },

  updatePanel: async (
    id: string,
    data: Partial<CreatePanelRequest>
  ): Promise<Panel> => {
    await delay(500);

    const panelIndex = MOCK_PANELS.findIndex((p) => p.id === id);
    if (panelIndex === -1) {
      throw new Error('Panel not found');
    }

    const panel = MOCK_PANELS[panelIndex];

    if (data.postId) {
      const post = MOCK_POSTS.find((p) => p.id === data.postId);
      panel.postId = data.postId;
      panel.postLabel = post?.label || '';
    }

    if (data.designationId) {
      const designation = MOCK_DESIGNATIONS.find((d) => d.id === data.designationId);
      panel.designationId = data.designationId;
      panel.designationLabel = designation?.label || '';
    }

    if (data.roomNumber) {
      panel.roomNumber = data.roomNumber;
    }

    MOCK_PANELS[panelIndex] = panel;
    return panel;
  },

  deletePanel: async (id: string): Promise<void> => {
    await delay(400);
    MOCK_PANELS = MOCK_PANELS.filter((panel) => panel.id !== id);
  },
  getAssignmentsByPanel: async (panelId: string): Promise<PanelAssignment[]> => {
    await delay(300);
    return MOCK_ASSIGNMENTS.filter(a => a.panelId === panelId);
  },
  createAssignments: async (panelId: string, interviewerIds: string[], date: string): Promise<PanelAssignment[]> => {
    await delay(500);
    const { interviewers } = await import('../../lib/interviewers');
    const created: PanelAssignment[] = interviewerIds.map(id => {
      const i = interviewers.find(x => x.id === id);
      return {
        id: `${panelId}-${id}-${Date.now()}`,
        panelId,
        interviewerId: id,
        interviewerName: i?.name || id,
        date,
      }
    });
    MOCK_ASSIGNMENTS = [...MOCK_ASSIGNMENTS, ...created];
    return created;
  },
  updateAssignment: async (id: string, data: Partial<Pick<PanelAssignment, 'interviewerId' | 'date'>>): Promise<PanelAssignment> => {
    await delay(400);
    const idx = MOCK_ASSIGNMENTS.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Assignment not found');
    const current = MOCK_ASSIGNMENTS[idx];
    let interviewerName = current.interviewerName;
    if (data.interviewerId) {
      const { interviewers } = await import('../../lib/interviewers');
      const i = interviewers.find(x => x.id === data.interviewerId);
      interviewerName = i?.name || data.interviewerId;
    }
    const updated: PanelAssignment = {
      ...current,
      interviewerId: data.interviewerId ?? current.interviewerId,
      interviewerName,
      date: data.date ?? current.date,
    };
    MOCK_ASSIGNMENTS[idx] = updated;
    return updated;
  },
  deleteAssignment: async (id: string): Promise<void> => {
    await delay(300);
    MOCK_ASSIGNMENTS = MOCK_ASSIGNMENTS.filter(a => a.id !== id);
  },
};




import { callAPIWithEnc } from '@/lib/commonApi';

export async function getExamList() {
  const response = await callAPIWithEnc(
    '/admin/getExamList',
    'POST',
  )
  return response.data;
}
export async function getExamDate(examId: number) {
  const response = await callAPIWithEnc(
    '/admin/getExamDateByExamID',
    'POST',
    {
      exam_id: examId,
    }
  )
  return response.data;
}
export async function getVenueList() {
  const response = await callAPIWithEnc(
    '/admin/getVenueDetails',
    'POST',
  )
  return response.data;
}
export async function getPostList(examId: String | number) {
  const response = await callAPIWithEnc(
    '/admin/getPostList',
    'POST',
    {
      exam_id: examId,
    }
  )
  return response.data;
}
export async function getDesignationList(postId: String |number) {
  const response = await callAPIWithEnc(
    '/admin/getDesignationList',
    'POST',
    {
      postID: postId,
    }
  )
  return response.data;
}
export async function getInterviewPanelInfo(venueId: number, typeId: number) {
  const response = await callAPIWithEnc(
    '/admin/getInterviewPanelInfoByVenue',
    'POST',
    {
      venue_id: venueId,
      exam_id: 0,
      post_id: 0,
      designation_id: 0,
      assign_type_id: typeId,
      exam_date: '19-12-2025',
    }
  )
  return response;
}
export async function saveInterviewPanel(interviewPanel: {
  panelId: number;
  postId: number;
  designationId: number;
  panelName: string;
  roomNumber: string;
  venueId: number;
  examDate: string;
  examId: number;
  entryUserId: number;
}) {
  const response = await callAPIWithEnc(
    '/admin/saveInterviewPanel',
    'POST',
    {
      panel_id: interviewPanel.panelId,
      post_id: interviewPanel.postId,
      designation_id: interviewPanel.designationId,
      panel_name: interviewPanel.panelName,
      room_no: interviewPanel.roomNumber,
      venue_id: interviewPanel.venueId,
      exam_id: interviewPanel.examId,
      exam_date: interviewPanel.examDate,
      entry_user_id: interviewPanel.entryUserId,
    }
  )
  return response;
}

