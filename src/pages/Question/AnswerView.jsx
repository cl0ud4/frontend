import Axios from "axios";
import { useEffect, useState } from "react";
import "./QuestionView.css";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userjwtAtom } from "../../recoil/user/atom";
import Swal from "sweetalert2";

function AnswerView() {
  const [userjwt, setUserjwt] = useRecoilState(userjwtAtom);
  const params = useParams();
  const [viewContent, setViewContent] = useState([]);
  const navigate = useNavigate();

  const question_id = params.question_id;

  const url = `${process.env.REACT_APP_API_URL}/question/` + question_id + "/answer";
  useEffect(() => {
    Axios.get(url).then(
      (res) => {
        setViewContent(res.data);
      },
      {
        headers: {
          "nemo-access-token": userjwt,
        },
      }
    );
  }, []);

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

  const deleteBoard = async () => {
    Swal.fire({
      title: "삭제",
      icon: "warning",
      text: "삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`${process.env.REACT_APP_API_URL}/question/${question_id}/answer`, {
          headers: {
            "nemo-access-token": userjwt,
          },
        }).then((res) => {
          // 확인 버튼이 클릭되었을 때의 동작을 여기에 작성한다.
          Swal.fire("확인", "게시물이 삭제되었습니다.", "success");
          navigate("/board");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 취소 버튼이 클릭되었을 때의 동작을 여기에 작성한다.
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
