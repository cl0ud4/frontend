import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import axios from "axios";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../recoil/locker/atom";
import { userjwtAtom } from "../../recoil/user/atom";

// 0: not mine, 1: mine, -1: no locker i rent
async function isMyLocker(locker, user, userjwt) {
  try {
    // 사용자가 대여한 사물함 조회
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/nemo/check`, {
      headers: {
        "nemo-access-token": userjwt,
      },
    });
    if (res.data.code === 3116) return -1;
    if (user.id === locker.fk_user_id) return 1;
  } catch (error) {
    console.error(error);
  }
  return 0;
}

async function emptyHandler(locker, userjwt) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/nemo/locker/rent/${locker.locker_id}`,
      {},
      {
        headers: {
          "nemo-access-token": userjwt,
        },
      }
    );
    if (res.data.isSuccess === false) {
      throw new Error(res.data.message);
    }
    return "OK";
  } catch (error) {
    console.error(error);
    return "KO";
  }
}

async function borrowHandler(locker, userjwt) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/nemo/locker/cancel/${locker.locker_id}`,
      {},
      {
        headers: {
          "nemo-access-token": userjwt,
        },
      }
    );
    if (res.data.isSuccess === false) {
      throw new Error(res.data.message);
    }
    return "OK";
  } catch (error) {
    console.error(error);
    return "KO";
  }
}

async function returnHandler(locker, userjwt) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/nemo/locker/cancel-return/${locker.locker_id}`,
      {},
      {
        headers: {
          "nemo-access-token": userjwt,
        },
      }
    );
    if (res.data.isSuccess === false) {
      throw new Error(res.data.message);
    }
    return "OK";
  } catch (error) {
    console.error(error);
    return "KO";
  }
}

async function usingHandler(locker, userjwt) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/nemo/locker/return/${locker.locker_id}`,
      {},
      {
        headers: {
          "nemo-access-token": userjwt,
        },
      }
    );
    if (res.data.isSuccess === false) {
      throw new Error(res.data.message);
    }
    return "OK";
  } catch (error) {
    console.error(error);
    return "KO";
  }
}

export default function LockerUserModal({ show, onHide, locker }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [buttonText, setButtonText] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [infoStatus, setInfoStatus] = useState("접근 불가");
  const [infoMsg, setInfoMsg] = useState("대여한 사물함에만 접근하실 수 있습니다");

  const [res, setRes] = useState("");

  const user = useRecoilValue(userAtom);
  const userjwt = useRecoilValue(userjwtAtom);

  const nav = useNavigate();

  const initText = async () => {
    try {
      const myLockerStatus = await isMyLocker(locker, user, userjwt);
      switch (locker.status) {
        case "empty": {
          if (myLockerStatus === -1) {
            setTitle("비어있는 사물함입니다");
            setContent("사물함 대여를 진행하시겠습니까?");
            setButtonText("대여 신청");
          } else {
            setShowToast(true);
          }
          break;
        }
        case "request": {
          if (myLockerStatus === 1) {
            setTitle("대여 요청 상태의 사물함입니다");
            setContent("대여 요청을 취소하시겠습니까?");
            setButtonText("대여 취소");
          } else {
            setShowToast(true);
          }
          break;
        }
        case "return": {
          if (myLockerStatus === 1) {
            setTitle("반납 요청 상태의 사물함입니다");
            setContent("반납 요청을 취소하시겠습니까?");
            setButtonText("반납 취소");
          } else {
            setShowToast(true);
          }
          break;
        }
        case "using": {
          if (myLockerStatus === 1) {
            setTitle("사용 중인 사물함입니다");
            setContent("반납 하시겠습니까?");
            setButtonText("반납 신청");
          } else {
            setShowToast(true);
          }
          break;
        }
        default: {
          setTitle("사용 중단 상태의 사물함입니다");
          setContent(locker.note);
          setButtonText("check");
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initText();
  });

  const handleOnClick = async (event) => {
    event.preventDefault();
    let ret;

    switch (locker.status) {
      case "empty": {
        ret = await emptyHandler(locker, userjwt);
        break;
      }
      case "request": {
        ret = await borrowHandler(locker, userjwt);
        break;
      }
      case "return": {
        ret = await returnHandler(locker, userjwt);
        break;
      }
      case "using": {
        ret = await usingHandler(locker, userjwt);
        break;
      }
    }
    if (ret === "OK") {
      setShowToast(true);
      setInfoStatus("요청 처리");
      setInfoMsg("요청이 정상적으로 처리되었습니다");
    } else {
      setShowToast(true);
      setInfoStatus("요청 처리");
      setInfoMsg("요청이 처리되지 않았습니다. 다시 한번 시도해보세요");
    }
  };

  return (
    <>
      {showToast ? (
        <Modal show={showToast} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">{locker.locker_id}번 사물함</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{infoStatus}</h4>
            <p>{infoMsg}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">{locker.locker_id}번 사물함</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{title}</h4>
            <p>{content}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              닫기
            </Button>
            <Button variant="primary" onClick={handleOnClick}>
              {buttonText}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
