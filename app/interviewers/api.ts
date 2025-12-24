import { callAPIWithEnc } from "@/lib/commonApi";



export interface Exam {
  exam_id: number;
  exam_name: string;
}


export interface Post {
  exam_id: number;
  post_id: number;
  post_name: string;
}

export interface Designation {
  designation_id: number;
  designation_name: string;
}


export interface SaveInterviewerRequest {
  inuser_id: number;
  post_id: number;
  designation_id: number;
  full_name: string;
  bank_name: string;
  branch_name: string;
  ifsc: string;
  bank_acc_no: string;
  contact_no: string;
  address: string;
  user_name: string;
  user_password: string;
  entry_user_id: number;
  user_id: number;
  examId?: string;
  examLabel?: string;
}

export interface SaveInterviewerResponse {
  version: string;
  status: number;
  message: string;
  data?: any;
}



export async function getPostList(examId: number = 1): Promise<Post[]> {
  try {
    const response = await callAPIWithEnc(`/admin/getPostList`, 'POST', { exam_id: examId });

    // if (!response.ok) {
    //   throw new Error('Failed to fetch posts');
    // }

   return response.data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getDesignationList(postId: number): Promise<Designation[]> {
  try {
    const response = await callAPIWithEnc(`/admin/getDesignationList`, 'POST', { postID: postId });

    // if (!response.ok) {
    //   throw new Error('Failed to fetch designations');
    // }
    return response.data || [];
  } catch (error) {
    console.error('Error fetching designations:', error);
    return [];
  }
}


export async function saveInterviewer(data: SaveInterviewerRequest): Promise<SaveInterviewerResponse> {
  try {
    const response = await callAPIWithEnc(`/admin/saveInterviewerMstr`, 'POST', data);


    console.log('Save interviewer response:', response);

    // if (!response.ok) {
    //   throw new Error('Failed to save interviewer');
    // }

    return response || [];
  } catch (error) {
    console.error('Error saving interviewer:', error);
    throw error;
  }
}


export async function getExamList(): Promise<Exam[]> {
  try {
    const response = await callAPIWithEnc(`/admin/getExamList`, 'POST', {});
    return response.data || [];
  } catch (error) {
    console.error('Error fetching exams:', error);
    return [];
  }
}