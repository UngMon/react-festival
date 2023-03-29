import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export const setData = async (contentId: string) => {
  const docData = {
    comment: [],
    detailImage: ["uri", "uri"],
    firstImage: "cotentId",
    expression: {
      nothing: {
        좋아요: 1,
        그저그래요: 0,
        싫어요: 0,
      },
    },
  };

  const contentRef = doc(db, "content", contentId);
  await setDoc(contentRef, docData);
};
