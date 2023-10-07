import "./QuestionView.css";
import { useNavigate } from "react-router-dom";

const NoticeButton = () => {
  const navigate = useNavigate();
  const navigateToWrite = () => {
    navigate("/board/notice");
  };

  return (
    <button className="submit-button qna-button qna-list-write-button" onClick={navigateToWrite}>
      공지 쓰기
    </button>
  );
};

export default NoticeButton;
