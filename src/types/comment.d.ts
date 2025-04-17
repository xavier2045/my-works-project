interface Comment {
  id: number;             // 评论 ID
  parentId: number | null; // 顶级评论的 parentId 为 null，子评论的 parentId 为父评论的 ID
  content: string;        // 评论内容
  username: string;       // 用户名
  avatar: string;         // 用户头像
  likes: number;          // 点赞数
  createdAt: string;      // 评论时间
}

interface ReplyPagination {
  currentPage: number;     // 当前页码
  totalPages: number;      // 总页数
  replies: Comment[];      // 当前已加载的子评论
}

type ReplyData = Record<number, ReplyPagination>;
