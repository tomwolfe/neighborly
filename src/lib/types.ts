export interface Reply {
  id: string;
  post_id: string;
  neighbor_id: string;
  nickname: string;
  neighborhood: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  neighbor_id: string;
  nickname: string;
  neighborhood: string;
  offer: string;
  need: string;
  created_at: string;
  replies?: Reply[];
  reply_count: number;
}

export interface UserStats {
  neighbor_id: string;
  current_nickname: string;
  post_count: number;
  reply_count: number;
}