import "./QuestionView.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NoticeButton from "./NoticeButton";
import Swal from "sweetalert2";
import { getUser } from "../../api/userApi";

const WriteButton = () => {
  const navigate = useNavigate();

  const navigateToWrite = () => {
    navigate("/board/write");
  };
  const [userContent, setUserContent] = useState([]);
  useEffect(() => {
    const usercheck = async () => {
      const response = await getUser();
      const loginError = "로그인을 해주세요."
      if(Object.keys(!response.data.isSuccess) && sessionStorage.getItem("jwt") === null) {
        Swal.fire("에러", loginError, "error");
        navigate('/signin')
      } 
      if(response.data.isSuccess) setUserContent(response.data.result);
    }
    usercheck();
  }, []);

  return (
    <>
      {userContent && userContent.permission ? (
        <NoticeButton />
      ) : (
        <button className="submit-button qna-button qna-list-write-button" onClick={navigateToWrite}>
          글쓰기
        </button>
      )}
    </>
  );
};

export default WriteButton;
