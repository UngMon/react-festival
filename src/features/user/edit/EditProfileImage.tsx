import { useRef, useState } from "react";
import { resizeAndCropImage } from "./resizeAndCropImage";
import { auth, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAppDispatch } from "store/store";
import { firebaseActions } from "store/firebase-slice";
import LoadingSpinnerTwo from "common/loading/LoadingSpinnerTwo";
import "./EditProfileImage.css";

interface T {
  setOpenImageEditor: (value: boolean) => void;
}

const EditProfileImage = ({ setOpenImageEditor }: T) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // 파일 처리 공통 로직
  const processFile = async (file: File) => {
    const user = auth.currentUser;

    if (!user) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB 비트 단위
    const ALLOWED_TYPES = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    // 1. 파일 형식 검증 (image type 체크)
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("PNG, JPG, JPEG, Webp 파일만 업로드할 수 있습니다.");
      return;
    }

    // 2. 용량 제한 검증
    if (file.size > MAX_SIZE) {
      alert("파일 용량은 최대 5MB를 초과할 수 없습니다.");
      return;
    }

    try {
      setLoading(true);

      // 이전에 만든 리사이징 함수 실행
      const compressedBlob = await resizeAndCropImage(file, 400);
      console.log("가공된 이미지:", compressedBlob);
      // 여기서 Firebase 업로드 함수 호출

      // 3. [Storage 저장] 고유한 UID 파일명 지정
      const storageRef = ref(storage, `profiles/${user.uid}_${Date.now()}.jpg`);

      //업로드 실행
      await uploadBytes(storageRef, compressedBlob);

      // 3. 업로드된 이미지 URL 가져오기
      const photoURL = await getDownloadURL(storageRef);
      console.log(photoURL);

      const idToken = await user.getIdToken();

      // 4. Cloud Functions 호출 (Auth 및 관련 문서 업데이트)
      const response = await fetch(
        `http://127.0.0.1:5001/festival-moa-fc37b/us-central1/auth/update-profile-image`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ photoURL }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "이미지 업데이트에 실패했습니다.");
      }

      const result = await response.json();

      if (result.success) {
        alert("프로필 사진이 성공적으로 변경되었습니다!");
        dispatch(firebaseActions.updateProfileImage({ photoURL }));
      }
    } catch (error) {
      console.error("이미지 처리 실패:", error);
      alert("프로필 이미지 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setOpenImageEditor(false);
    }
  };

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
    console.log("dragOverHandler");
  };

  const dragLeaveHandler = () => {
    if (isDragging) setIsDragging(false);
    console.log("dragLeaveHandler");
  };

  const dropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    console.log("Drop_Handler", e);
    const file = e.dataTransfer.files?.[0];
    console.log(file);
    if (file) {
      processFile(file);
    }
  };

  const dragBoxClickHandler = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  return (
    <>
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
              console.log("Change Input", e);
            }}
          />
          <div
            className="image-drag-box"
            onDragOver={(e) => dragOverHandler(e)}
            onDragLeave={dragLeaveHandler}
            onDrop={(e) => dropHandler(e)}
            onClick={(e) => {
              console.log("onClick", e);
            }}
          >
            <div className="darg-boundary">
              <span>이미지 업로드</span>
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
              <button type="button" onClick={dragBoxClickHandler}>
                파일 선택하기
              </button>
              <span>최대 5MB 까지</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileImage;
