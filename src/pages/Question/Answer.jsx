import "./QuestionView";
import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";

import Header from "../../components/Header/Header";
import { userjwtAtom } from "../../recoil/user/atom";

const AnswerTemplete = () => {
  const userjwt = useRecoilValue(userjwtAtom);
  const params = useParams();

  const question_id = params.question_id;
  const url = "/board/" + question_id;

  const navigate = useNavigate();
  const navigateToView = () => {
    navigate(url);
  };

  const [questionContent, setQuestionContent] = useState({
    title: "",
    content: "",
    created_date: "",
  });

  const [viewContent, setViewContent] = useState([]);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/question/${question_id}/answer`, {
      headers: {
        "nemo-access-token": userjwt,
      },
    }).then((response) => {
      setViewContent(response.data.result);
    });
  }, []);

  const submitQuestion = async () => {
    try {
      Axios.post(
        `${process.env.REACT_APP_API_URL}/question/${question_id}/answer`,
        {
          title: questionContent.title,
          content: questionContent.content,
          created_date: questionContent.created_date,
        },
        {
          headers: {
            "nemo-access-token": userjwt,
          },
        }
      ).then((res) => {
        if (res.data.isSuccess) {
          Swal.fire("확인", "게시물이 등록되었습니다.", "success");
          navigateToView();
        } else Swal.fire("에러", res.data.message, "error");
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getValue = (e) => {
    const { name, value } = e.target;
    setQuestionContent({
      ...questionContent,
      [name]: value,
    });
  };

  // 유저 정보 가져오기
  const [userContent, setUserContent] = useState([]);
  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/app/user`, {
      headers: {
        "nemo-access-token": userjwt,
      },
    }).then((response) => {
      setUserContent(response.data.result);
    });
  }, []);

  return (
    <>
      <Header id={userContent.id} />
      <br />
      <br />
      <div className="Question-App">
        <Helmet>
          <title>답변 작성하기 - 네모의 꿈</title>
        </Helmet>
        <h1>Q&A</h1>
        <h3>1:1 답변하기</h3>
        <table className="view-table">
          <tbody>
            <tr>
              <td>
                <span className="input-text">제목</span>
              </td>
              <td>
                <input className="title-input" type="text" onChange={getValue} name="title" />
              </td>
            </tr>
            <tr>
              <td>
                <span className="input-text input-textarea">내용</span>
              </td>
              <td>
                <textarea
                  className="content-input"
                  type="text"
                  onChange={(event) => {
                    setQuestionContent({
                      ...questionContent,
                      content: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="qna-but">
          <button className="submit-button qna-button" onClick={submitQuestion}>
            작성
          </button>
          <button className="qna-button" onClick={navigateToView}>
            취소
          </button>
        </div>
      </div>
    </>
  );
};

export default AnswerTemplete;
