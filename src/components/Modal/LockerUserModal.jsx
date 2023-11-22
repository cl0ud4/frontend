import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useRecoilValue } from "recoil";
import { userAtom } from "../../recoil/locker/atom";
import { getUserLockerCheck, postLockerCancel, postLockerCancelReturn, postLockerRent, postLockerReturn } from "../../api/lockerApi";

// 0: not mine, 1: mine, -1: no locker i rent
async function isMyLocker(locker, user) {
  try {
    // 사용자가 대여한 사물함 조회
    const res = await getUserLockerCheck();
    if (res.data.code === 3116) return -1;
    if (user.id === locker.fk_user_id) return 1;
  } catch (error) {
    console.error(error);
  }
  return 0;
}

async function emptyHandler(locker) {
  const res = await postLockerRent(locker.locker_id);
    
  if (res.data.isSuccess === false) {
    return "KO"
  }
  return "OK";
}

async function borrowHandler(locker) {
  const res = await postLockerCancel(locker.locker_id);
    
  if (res.data.isSuccess === false) {
    return "KO"
  }
  return "OK";
}

async function returnHandler(locker) {
  const res = await postLockerCancelReturn(locker.locker_id);
    
  if (res.data.isSuccess === false) {
    return "KO"
  }
  return "OK";
}

async function usingHandler(locker) {

  const res = await postLockerReturn(locker.locker_id);
    
  if (res.data.isSuccess === false) {
    return "KO"
  }
  return "OK";
}

export default function LockerUserModal({ show, onHide, locker }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [buttonText, setButtonText] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [infoStatus, setInfoStatus] = useState("접근 불가");
  const [infoMsg, setInfoMsg] = useState("대여한 사물함에만 접근하실 수 있습니다");

  const user = useRecoilValue(userAtom);

  const initText = async () => {
    try {
      const myLockerStatus = await isMyLocker(locker, user);
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
        ret = await emptyHandler(locker);
        break;
      }
      case "request": {
        ret = await borrowHandler(locker);
        break;
      }
      case "return": {
        ret = await returnHandler(locker);
        break;
      }
      case "using": {
        ret = await usingHandler(locker);
        break;
      }
      default:
        break;
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
