export interface Reply {
  id: string;
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
  replies: Reply[];
  reply_count: number;
}
