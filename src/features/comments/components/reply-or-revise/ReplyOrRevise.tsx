import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import LoadingSpinnerTwo from "common/loading/LoadingSpinnerTwo";
import UserIcon from "../comment/UserIcon";
import { modalActions } from "store/modal-slice";
import { useEffect } from "react";

interface Props {
  type: string;
  loading: boolean;
  depth: number;
  submitPossible: boolean;
  onSubmit: (e: React.FormEvent) => void;
  handleInput: (e: React.FormEvent) => void;
  comment_id: string;
  divRef: React.RefObject<HTMLDivElement>;
  text?: string;
}

const ReplyOrRevise = ({
  type,
  loading,
  depth,
  submitPossible,
  onSubmit,
  handleInput,
  comment_id,
  divRef,
  text,
}: Props) => {
  const dispatch = useAppDispatch();
  const { current_user_photo, current_user_name } = useSelector(
    (state: RootState) => state.firebase,
  );

  const handleCancel = () => {
    dispatch(modalActions.clearModalInfo({ comment_id, type }));
  };

  useEffect(() => {
    if (divRef.current && type === "revise" && text)
      divRef.current.innerText = text;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinnerTwo width="20px" padding="7px" />
      ) : (
        <div
          className="comment-container"
          style={{
            marginLeft: `${depth * 55}px`,
          }}
        >
          <UserIcon
            user_photo={current_user_photo}
            user_name={current_user_name}
          />
          <form className="reply-input-box" onSubmit={(e) => onSubmit(e)}>
            <div className="reply-text-box">
              <div
                ref={divRef}
                className="editable"
                contentEditable="true"
                spellCheck="false"
                dir="auto"
                onInput={(e) => handleInput(e)}
              ></div>
              <i />
            </div>
            <div className="reply-button-box">
              <button className="enabled" type="button" onClick={handleCancel}>
                취소
              </button>
              <button
                className={submitPossible ? "enabled" : "disabled"}
                type="submit"
                disabled={!submitPossible}
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ReplyOrRevise;
