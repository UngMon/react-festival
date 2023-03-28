import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export const setData = async (contentId: string) => {
  const docData = {
    comment: {
      name: "",
      uid: "",
      when: '',
      content: '',
    },
    detailImage: ["uri", "uri"],
    firstImage: "cotentId",
    expression: {
      좋아요: 0,
      그저그래요: 0,
      싫어요: 0,
    },
  };

  const contentRef = doc(db, "content", contentId);
  await setDoc(contentRef, docData);
};
