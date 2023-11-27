import React from "react";
import "./NoticeAdminModal.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { postSendNotice, getSendNoticeSms, postSendNoticeWrite } from "../../api/noticeApi";

function NoticeAdminModal({ setModalOpen }) {
  const [smsContent, setSMSContent] = useState({
    sms_content: "",
  });

  const [viewContent, setViewContent] = useState([]);

  useEffect(() => {
    const noticeSms = async () => {
      const res = await getSendNoticeSms();
      setViewContent(res.data.result);
    }
    noticeSms();
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
      }).then(async(result) => {
        if (result.isConfirmed) {
          const res = await postSendNoticeWrite(smsContent.sms_content);
          if (res.data.isSuccess) {
            sendSMS();
          } else {
            Swal.fire("에러", res.data.message, "error");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("취소", "작업이 취소되었습니다.", "error");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 문자 보내기
  const sendSMS = async () => {
    const res = await postSendNotice();

    if (res.data.isSuccess) {
      Swal.fire("확인", "문자가 전송되었습니다.", "success");
      closeModal();
    } else {
      Swal.fire("에러", res.data.message, "error");
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
