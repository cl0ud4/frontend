import React from "react";
import { Link } from "react-router-dom";
import "./NoticeAdminModal.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { userjwtAtom } from "../../recoil/user/atom";
import { useRecoilState } from "recoil";

function NoticeAdminModal({ setModalOpen }) {
  const [userjwt, setUserjwt] = useRecoilState(userjwtAtom);

  const [smsContent, setSMSContent] = useState({
    sms_content: "",
  });

  const [viewContent, setViewContent] = useState([]);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/notice/sms`).then((response) => {
      setViewContent(response.data.result);
    });
  }, [viewContent]);

  const submitSMS = async () => {
    try {
      Swal.fire({
        title: "SMS",
        icon: "question",
        text: "문자를 보내시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          Axios.post(
            `${process.env.REACT_APP_API_URL}/notice/send/write`,
            {
              sms_content: smsContent.sms_content,
            },
            {
              headers: {
                "nemo-access-token": userjwt,
              },
            }
          ).then((res) => {
            if (res.data.isSuccess) {
              sendSMS();
            } else {
              Swal.fire("에러", res.data.message, "error");
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // 취소 버튼이 클릭되었을 때의 동작을 여기에 작성한다.
          Swal.fire("취소", "작업이 취소되었습니다.", "error");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 문자 보내기
  const sendSMS = async () => {
    try {
      Axios.post(
        `${process.env.REACT_APP_API_URL}/notice/send`,
        {},
        {
          headers: {
            "nemo-access-token": userjwt,
          },
        }
      ).then((res) => {
        if (res.data.isSuccess) {
          Swal.fire("확인", "문자가 전송되었습니다.", "success");
          closeModal();
        } else {
          Swal.fire("에러", res.data.message, "error");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div className="modalWrapper">
      <div className="modalContainer">
        <div>
          <br />
          <p className="sms-title">문자 내용 입력</p>
          <textarea
            className="sms-input"
            type="text"
            onChange={(event) => {
              setSMSContent({
                sms_content: event.target.value,
              });
            }}
          />
        </div>
        <button className="sms-send" onClick={submitSMS}>
          보내기
        </button>
        <button className="sms-cancle" onClick={closeModal}>
          취소
        </button>
      </div>
    </div>
  );
}

export default NoticeAdminModal;
