
export interface Post {
  id: number;
  user: string;
  text: string;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null; // e.g., '.pdf', '.mp3'
  timestamp: string; // ISO date string
}
