export const CATEGORY_TITLES: Record<string, string> = {
  userInfo: "계정 관리",
  myComment: "내가 작성한 댓글",
  likedComment: "좋아요 누른 댓글",
  likedContent: "좋아요 누른 콘텐츠",
};

export const CATEGORY_EXPLANATION: Record<string, string> = {
  userInfo: "이곳저곳의 계정을 관리해보세요.",
  myComment: "작성한 댓글 기록을 관리할 수 있습니다.",
  likedComment: "좋아요 댓글 기록을 관리해보세요",
  likedContent: "좋아요 누른 콘텐츠 기록을 관리해보세요",
};

export const CATEGORY: [string, string, string][] = [
  ["userInfo", "settings_account_box", "계정 관리"],
  ["myComment", "rate_review", "작성한 댓글"],
  ["likedContent", "favorite", "좋아요 누른 콘텐츠"],
  ["likedComment", "thumb_up", "좋아요 누른 댓글"],
];
