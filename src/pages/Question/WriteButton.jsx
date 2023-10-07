import "./QuestionView.css";
import { useNavigate } from "react-router-dom";
import { userjwtAtom } from "../../recoil/user/atom";
import Axios from "axios";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import NoticeButton from "./NoticeButton";
import Swal from "sweetalert2";

const WriteButton = () => {
  const userjwt = useRecoilValue(userjwtAtom);
  const navigate = useNavigate();

  const navigateToWrite = () => {
    navigate("/board/write");
  };
  const [userContent, setUserContent] = useState([]);
  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/app/user`, {
      headers: {
        "nemo-access-token": userjwt,
      },
    }).then((response) => {
      const loginError = "로그인을 해주세요."
      if(Object.keys(!response.data.isSuccess) && userjwt === null) {
        Swal.fire("에러", loginError, "error");
        navigate('/signin')
      } 
      if(response.data.isSuccess) setUserContent(response.data.result);
    });
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
