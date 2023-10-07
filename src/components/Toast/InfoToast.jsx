import React from "react";
import Toast from "react-bootstrap/Toast";
import { ToastContainer } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import { useRecoilState } from "recoil";
import { showInfoToastATom } from "../../recoil/menu/atom";

export default function InfoToast({ infoStatus, infoMsg }) {
  const [showInfoToast, setShowInfoToast] = useRecoilState(showInfoToastATom);

  const handleOnClose = () => {
    setShowInfoToast(false);
  };

  return (
    <ToastContainer position="top-center">
      <Toast show={showInfoToast} onClose={handleOnClose} bg="primary">
        <Toast.Header>
          <strong className="me-auto">💁‍♀️ 알림 </strong>
          <small>{infoStatus}</small>
        </Toast.Header>
        <Toast.Body>{infoMsg}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
