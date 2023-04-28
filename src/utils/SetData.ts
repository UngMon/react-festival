import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const setData = async (contentId: string) => {
  const contentRef = doc(db, "content", contentId);
  const querySnapshot = await getDoc(contentRef);
  const contentData = querySnapshot.data();
  try {
    if (!contentData) {
      const docData = {
        comment: [],
        detailImage: [],
        firstImage: "",
        expression: {},
      };
      await setDoc(contentRef, docData);
      
    } else {
    }
  } catch (error: any) {
    console.log(error.message);
  }
};
