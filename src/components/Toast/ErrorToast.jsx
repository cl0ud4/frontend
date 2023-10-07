import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import { ToastContainer } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

export default function ErrorToast({ errorStatus, errorMsg }) {
  const [show, setShow] = useState(true);

  const handleCloseToast = () => {
    setShow(false);
  };

  return (
    <ToastContainer position="top-center">
      <Toast show={show} onClose={handleCloseToast} bg="danger">
        <Toast.Header>
          <strong className="me-auto">🚨 ERROR</strong>
          <small>{errorStatus}</small>
        </Toast.Header>
        <Toast.Body>{errorMsg}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
