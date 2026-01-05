export interface Reply {
  id: string;
  post_id: string;
  nickname: string;
  neighborhood: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  nickname: string;
  neighborhood: string;
  offer: string;
  need: string;
  created_at: string;
  replies?: Reply[]; // Made optional as it might be fetched separately
  reply_count: number;
}

export interface UserStats {
  nickname: string;
  post_count: number;
  reply_count: number;
}
