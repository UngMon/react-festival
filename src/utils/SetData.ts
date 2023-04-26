import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAppDispatch } from "../redux/store";

export const setData = async (contentId: string) => {
  // const dispatch = useAppDispatch();

  const contentRef = doc(db, "content", contentId);
  console.log(contentRef);
  const querySnapshot = await getDoc(contentRef);
  const contentData = querySnapshot.data();
  console.log(contentData)
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
      // useAppDispatch();
    }
  } catch (error: any) {
    alert(error.message);
  }

  // await setDoc(contentRef, docData, { merge: true });
};
