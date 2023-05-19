export type Comment = {
  name: string;
  uid: string;
  when: string;
  text: string;
  userPhoto: string;
};

export type Expression = {
  [key: string]: {
    좋아요: number;
    그저그래요: number;
    싫어요: number;
  };
};

export type ContentData = {
  comment: Comment[];
  detailImage: string[];
  firstImage: string;
  expression: Expression;
};
