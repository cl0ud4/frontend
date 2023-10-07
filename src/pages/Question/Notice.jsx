import Axios from "axios";
import { useEffect, useState } from "react";
import "./NoticeView";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { userjwtAtom } from "../../recoil/user/atom";
import { useRecoilState } from "recoil";
import Header from "../../components/Header/Header";
import Swal from "sweetalert2";

const NoticeTemplete = () => {
  const [userjwt, setUserjwt] = useRecoilState(userjwtAtom);

  const navigate = useNavigate();
  const navigateToView = () => {
    navigate("/board");
  };

  const navigateToViewBoard = (last_notice_id) => {
    navigate(`/board/notice/${last_notice_id}`);
  };

  const [questionContent, setQuestionContent] = useState({
    title: "",
    content: "",
    created_date: "",
  });

  const [viewContent, setViewContent] = useState([]);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/notice`, {
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
        `${process.env.REACT_APP_API_URL}/notice/write`,
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
          const last_notice_id = res.data.result[0].notice_id;
          Swal.fire("확인", "게시물이 등록되었습니다.", "success");
          navigateToViewBoard(last_notice_id);
        } else {
          Swal.fire("에러", res.data.message, "error");
        }
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
          <title>공지 작성하기 - 네모의 꿈</title>
        </Helmet>
        <h1>공지</h1>
        <h3>공지 작성하기</h3>
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
        <div className="button-table">
          <button className="qna-button button-float" onClick={navigateToView}>
            취소
          </button>
          <button className="submit-button qna-button send-button button-float" onClick={submitQuestion}>
            작성
          </button>
        </div>
      </div>
    </>
  );
};

export default NoticeTemplete;
