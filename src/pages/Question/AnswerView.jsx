import { useEffect, useState } from "react";
import "./QuestionView.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUser } from "../../api/userApi";
import { deleteQuestionAnswer, getQuestionAnswer } from "../../api/questionApi";

function AnswerView() {
  const params = useParams();
  const [viewContent, setViewContent] = useState([]);
  const navigate = useNavigate();

  const question_id = params.question_id;

  useEffect(() => {
    const getQna = async() => {
      const response = await getQuestionAnswer(question_id);
      setViewContent(response.data);
    }
    getQna();
  }, []);

  // 유저 정보 가져오기
  const [userContent, setUserContent] = useState([]);
  useEffect(() => {
    const getUserInfo = async() => {
      const response = await getUser();
      if (response.data.isSuccess) setUserContent(response.data.result);
      else navigate("/signin");
    }
    getUserInfo();
  }, []);

  const deleteBoard = async () => {
    Swal.fire({
      title: "삭제",
      icon: "warning",
      text: "삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async(result) => {
      if (result.isConfirmed) {
        const res = await deleteQuestionAnswer(question_id);
        Swal.fire("확인", "게시물이 삭제되었습니다.", "success");
        navigate("/board");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("취소", "작업이 취소되었습니다.", "error");
      }
    });
  };

  return (
    <div className="Question-App">
      <br /> <br /> <br />
      {viewContent &&
        viewContent.map((element) => (
          <table className="view-table" key={element.answer_id}>
            <tbody>
              <tr>
                <td>
                  <span className="input-text input-writer">작성자</span>
                </td>
                <td>
                  <input className="writer-input input-readonly" name="title" placeholder={"관리자"} disabled />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="input-text">제목</span>
                </td>
                <td>
                  <input className="title-input input-readonly" name="title" placeholder={element.title} disabled />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="input-text input-textarea">내용</span>
                </td>
                <td>
                  <textarea className="answer-content-input input-readonly" type="text" placeholder={element.content} disabled />
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      <>
      {typeof userContent === 'undefined' ? "":<>
        {viewContent.length > 0 && userContent.permission ? (
            <div className="button-table">
              <button className="qna-button button-float" onClick={deleteBoard}>
                삭제
              </button>
            </div>
          ) : null}
      </>}
      </>
    </div>
  );
}

export default AnswerView;
