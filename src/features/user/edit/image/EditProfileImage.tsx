import { useRef, useState } from "react";
import { resizeAndCropImage } from "./resizeAndCropImage";
import { auth, storage } from "../../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAppDispatch } from "store/store";
import { firebaseActions } from "store/firebase-slice";
import LoadingSpinnerTwo from "common/loading/LoadingSpinnerTwo";
import "./EditProfileImage.css";

interface T {
  setOpenImageEditor: (value: boolean) => void;
}

const EditProfileImage = ({ setOpenImageEditor }: T) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // [파일 업로드]
  const uploadImage = async (file: File) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB 비트 단위
    const ALLOWED_TYPES = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    // 1. 파일 형식 및 용량 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("PNG, JPG, JPEG, Webp 파일만 업로드할 수 있습니다.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("파일 용량은 최대 5MB를 초과할 수 없습니다.");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      setLoading(true);

      // 2. 리사이징 (중앙 기준 400x400 크롭 자동 수행)
      const compressedBlob = await resizeAndCropImage(file, 400);

      // 3. Firebase Storage 업로드
      const storageRef = ref(storage, `profiles/${user.uid}/profile.jpeg`);
      await uploadBytes(storageRef, compressedBlob);
      const photoURL = await getDownloadURL(storageRef);

      // 4. 서버(Cloud Functions) 업데이트 API 호출
      const idToken = await user.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_FIREBASE_SERVER_POINT}/update-profile-image`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ photoURL }),
        },
      );

      if (!response.ok) throw new Error("업데이트 실패");

      const result = await response.json();

      if (result.success) {
        alert("프로필 사진이 변경되었습니다!");
        // Redux 상태 업데이트
        dispatch(firebaseActions.updateProfileImage({ photoURL }));
        setOpenImageEditor(false);
      }
    } catch (error) {
      console.error(error);
      alert("프로필 이미지 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setOpenImageEditor(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file);
  };

  const handleClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  return (
    <div className="image-edit-wrapper">
      {loading ? (
        <LoadingSpinnerTwo width="50px" padding="10px" />
      ) : (
        <div className="image-edit-container">
          <input
            className="image-input-box"
            type="file"
            accept=".png, .jpg, .jpeg, .webp" // 탐색기에서 해당 확장자만 활성화됨
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadImage(file);
                e.target.value = "";
              }
            }}
          />
          <div className="image-drag-box" onDrop={(e) => handleDrop(e)}>
            <div className="darg-boundary">
              <span>프로필 사진 추가</span>
              <span
                className="material-symbols-outlined image-edit-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenImageEditor(false);
                }}
              >
                close
              </span>
              <span className="material-symbols-outlined cloud_upload">
                cloud_upload
              </span>
              <span>
                PNG, JPG, JPEG, WebP 형식의 이미지 파일을 선택해 주세요.
              </span>
              <button type="button" onClick={handleClick}>
                파일 선택하기
              </button>
              <span>최대 5MB 까지</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfileImage;
