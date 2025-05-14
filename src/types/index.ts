export interface MediaItem {
  url: string;
  name: string;
  type: string;
}

export interface Post {
  id: number;
  user: string;
  text: string;
  media: MediaItem[];
  timestamp: string;
}
