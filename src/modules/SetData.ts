import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export const setData = async (contentId: string) => {
  const docData = {
    comment: [],
    detailImage: [],
    firstImage: '',
    expression: {},
  };

  const contentRef = doc(db, "content", contentId);
  await setDoc(contentRef, docData);
};
