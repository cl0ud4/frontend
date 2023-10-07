import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";

import axios from "axios";

import WarningToast from "../Toast/WarningToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { userjwtAtom } from "../../recoil/user/atom";
import { showWraningToastATom } from "../../recoil/menu/atom";

export default function LockerAdminModal({ show, onHide, locker }) {
  const [lockerId, setLockerId] = useState(locker.locker_id);
  const [status, setStatus] = useState(locker.status);
  const [userId, setUserId] = useState(locker.fk_user_id || "20190000");
  const [note, setNote] = useState(locker.note);

  const [showToast, setShowToast] = useRecoilState(showWraningToastATom);
  const [warningStatus, setWarningStatus] = useState("");
  const [warningMsg, setWarningMsg] = useState("");

  const userjwt = useRecoilValue(userjwtAtom);

  const nav = useNavigate();

  const handleOnSubmit = (event) => {
    event.preventDefault();

    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/nemo/locker/${lockerId}`,
        {
          userId: userId,
          note: note,
          status: status,
        },
        {
          headers: {
            "nemo-access-token": userjwt,
          },
        }
      )
      .then((res) => {
        if (res.data.isSuccess === false) {
          throw {
            res: res.data,
            error: new Error(),
          };
        } else {
          onHide();
        }
      })
      .catch(({ res, error }) => {
        if (showToast) {
          setShowToast(false);
        }
        if (res) {
          setWarningStatus(res.code);
          setWarningMsg(res.message);
        } else {
          setWarningMsg("변경 실패");
          setWarningMsg("사물함 상태 변경에 실패하였습니다. 잘못 입력된 값이 없는지 확인해주세요");
        }
        setShowToast(true);
      });
  };

  return (
    <>
      {showToast ? <WarningToast warningStatus={warningStatus} warningMsg={warningMsg} /> : null}
      <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{locker.locker_id}번 사물함 관리</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 style={{ textAlign: "center" }}>관리자 전용</h4>
          <div className="formWrapper">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="userId">대여자 학번</Form.Label>
                <Form.Control type="text" placeholder="20190000" value={userId} onChange={(e) => setUserId(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="note">사물함 특이사항</Form.Label>
                <Form.Control type="text" value={note} onChange={(e) => setNote(e.target.value)} />
              </Form.Group>
              <Form.Group className="w-25">
                <Form.Label className="status">사물함 상태</Form.Label>
                <Form.Select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="empty">사용자 없음</option>
                  <option value="request">대여 요청</option>
                  <option value="return">반납 요청</option>
                  <option value="using">사용중</option>
                  <option value="other">사용 불가</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => handleOnSubmit(e)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
