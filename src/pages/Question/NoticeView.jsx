import Axios from "axios";
import { useEffect, useState } from "react";
import "./QuestionView.css";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import NoticeAdminModal from "../../components/Modal/NoticeAdminModal";
import { userjwtAtom } from "../../recoil/user/atom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";

// 문의글 뷰
function NoticeView() {
  const [userjwt, setUserjwt] = useRecoilState(userjwtAtom);
  const params = useParams();
  const [viewContent, setViewContent] = useState([]);

  const notice_id = params.notice_id;
  const url = `${process.env.REACT_APP_API_URL}/notice/` + notice_id;
  useEffect(() => {
    Axios.get(url).then((res) => {
      const loginError = "로그인을 해주세요."
      const boardError = "해당 게시물이 존재하지 않습니다."
      if(Object.keys(res.data).length === 0 && userjwt === null) {
        Swal.fire("에러", loginError, "error");
        navigate('/signin')
      } else if(Object.keys(res.data).length === 0){
        Swal.fire("에러", boardError, "error");
        navigate('/board')
      }
      setViewContent(res.data);
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
    navigate(`/board/notice/${notice_id}`);
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
        Axios.delete(`${process.env.REACT_APP_API_URL}/notice/${notice_id}`, {
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

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header id={typeof userContent !== 'undefined' ? userContent.id : ""} />
      <br />
      <br />
      <div className="Question-App">
        <Helmet>
          <title>공지 보기 - 네모의 꿈</title>
        </Helmet>
        <h1>공지</h1>
        <h3>공지 내용</h3>

        <div className="notice-board">
          <div className="notice-modal">{showModal ? <NoticeAdminModal setModalOpen={setShowModal} /> : null}</div>
          {viewContent &&
            viewContent.map((element) => (
              <div key={element.notice_id} className="view-table-container">
                <table className="view-table notice-table">
                  <tbody>
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
              </div>
            ))}
        </div>

        <>
        {typeof userContent === 'undefined' ? "":<>
        {viewContent.length > 0 && userContent.permission ? (
            <div className="button-table">
              <button className="qna-button button-float" onClick={deleteBoard}>
                삭제
              </button>
              <button className="submit-button qna-button send-button button-float" onClick={() => setShowModal(true)}>
                문자 보내기
              </button>
            </div>
          ) : null}
        </>}
          
        </>
      </div>
    </>
  );
}

export default NoticeView;
