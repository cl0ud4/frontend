import React from "react";
import Toast from "react-bootstrap/Toast";
import { ToastContainer } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { useRecoilState } from "recoil";
import { showWraningToastATom } from "../../recoil/menu/atom";

export default function WarningToast({ warningStatus, warningMsg }) {
  const [show, setShow] = useRecoilState(showWraningToastATom);

  const handleCloseToast = () => {
    setShow(false);
  };

  return (
    <ToastContainer position="middle-center">
      <Toast show={show} onClose={handleCloseToast} bg="warning">
        <Toast.Header>
          <strong className="me-auto">❓ WARNING</strong>
          <small>{warningStatus}</small>
        </Toast.Header>
        <Toast.Body>{warningMsg}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
