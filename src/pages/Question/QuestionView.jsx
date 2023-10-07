import Axios from "axios";
import { useEffect, useState } from "react";
import "./QuestionView.css";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useRecoilValue } from "recoil";
import { userjwtAtom } from "../../recoil/user/atom";
import Swal from "sweetalert2";

// 문의글 뷰
function QuestionView() {
  const userjwt = useRecoilValue(userjwtAtom);
  const params = useParams();
  const [viewContent, setViewContent] = useState([]);
  const [writerId, setWriterId] = useState([]);

  // 글 내용 가져오기
  const question_id = params.question_id;
  const url = `${process.env.REACT_APP_API_URL}/question/` + question_id;
  useEffect(() => {
    console.warn = () => {};
    Axios.get(url, {
      headers: {
        "nemo-access-token": userjwt,
      },
    }).then((res) => {
      if(Object.keys(res.data).length === 0) {
        Swal.fire("에러", "해당 게시물이 존재하지 않습니다.", "error");
        navigate('/board')
      }
      setViewContent(res.data);
      setWriterId(res.data[0]);
    });
  }, []);

  // 유저 정보 가져오기
  const [userContent, setUserContent] = useState([]);
  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/app/user`, {
      headers: {
        "nemo-access-token": userjwt,
      },
    }).then((response) => {
      if(response.data.isSuccess) setUserContent(response.data.result);
      else navigate("/signin")
    });
  }, []);

  const navigate = useNavigate();
  const navigateToAnswer = () => {
    navigate(`/board/${question_id}/answer`);
  };

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
        Axios.delete(`${process.env.REACT_APP_API_URL}/question/${question_id}`, {
          headers: {
            "nemo-access-token": userjwt,
          },
        }).then((res) => {
          // 확인 버튼이 클릭되었을 때의 동작을 여기에 작성한다.
          if (res.data.isSuccess) {
            Swal.fire("확인", "게시물이 삭제되었습니다.", "success");
            navigate("/board");
          } else {
            Swal.fire("권한 에러", res.data.message, "error"); // 애초에 버튼이 안보이게 작업해둠
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 취소 버튼이 클릭되었을 때의 동작을 여기에 작성한다.
        Swal.fire("취소", "작업이 취소되었습니다.", "error");
      }
    });
  };

  return (
    <>
      <Header id={typeof userContent !== 'undefined' ? userContent.id : ""} />
      <br />
      <br />
      <div className="Question-App">
        <Helmet>
          <title>문의글 보기 - 네모의 꿈</title>
        </Helmet>
        <h1>Q&A</h1>
        <h3>1:1 문의하기</h3>
        <div className=""></div>
        {viewContent &&
          viewContent.map((element) => (
            <table className="view-table" key={element.question_id}>
              <tbody>
                <tr>
                  <td>
                    <span className="input-text input-writer">작성자</span>
                  </td>
                  <td>
                    <input className="writer-input input-readonly" name="title" placeholder={element.writer_id} disabled />
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
                    <textarea className="content-input input-readonly" type="text" placeholder={element.content} disabled />
                  </td>
                </tr>
              </tbody>
            </table>
          ))}

        <div className="button-table">{typeof userContent === 'undefined' ? "":
        <>
        {writerId.writer_id === userContent.id || (userContent && userContent.permission) ? (
            <button className="qna-button button-float" onClick={deleteBoard}>
              삭제
            </button>
          ) : null}

          {userContent && userContent.permission ? (
            <button className="submit-button qna-button send-button button-float" onClick={navigateToAnswer}>
              답변
            </button>
          ) : null}
        </>
        }
          
        </div>
      </div>
    </>
  );
}

export default QuestionView;
