import "./LockerPage.css";
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import WarningToast from "../../components/Toast/WarningToast";

import { userAtom, lockerInfoAtom, lockerListAtom } from "../../recoil/locker/atom";
import { userjwtAtom } from "../../recoil/user/atom";
import { useLockerMenu } from "../../recoil/menu/useMenu";
import { useNavigate } from "react-router-dom";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import LockerUserModal from "../../components/Modal/LockerUserModal";
import LockerAdminModal from "../../components/Modal/LockerAdminModal";

import { Helmet } from "react-helmet-async";
import Header from "../../components/Header/Header";
import { showInfoToastATom, showWraningToastATom } from "../../recoil/menu/atom";
import InfoToast from "../../components/Toast/InfoToast";
import Swal from "sweetalert2";

export default function LockerPage() {
  const [isChanged, setIsChanged] = useState(true);

  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showInfoToast, setShowInfoToast] = useRecoilState(showInfoToastATom);
  const setShowRecoilToast = useSetRecoilState(showWraningToastATom);
  const [searchLocker, setSearchLocker] = useState("");

  const [clickedLocker, setClickedLocker] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const user = useRecoilValue(userAtom);
  const lockerInfo = useRecoilValue(lockerInfoAtom);
  const [lockerList, setLockerList] = useRecoilState(lockerListAtom);

  const userjwt = useRecoilValue(userjwtAtom);
  const { setAskMenu, setLockerMenu, setMypageMenu } = useLockerMenu();

  const nav = useNavigate();

  const initLockerList = () => {
    if (isChanged) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/nemo/lockers?department=${user.department}`, {
          headers: {
            "nemo-access-token": userjwt,
          },
        })
        .then((res) => {
          if (userjwt === null) {
            Swal.fire("에러", "로그인을 해주세요.", "error");
            nav("/signin");
          }
          if (res.data.code === 3104) {
            nav("/lockerinfo", { replace: true });
            return;
          }
          if (!res.data.isSuccess) {
            setStatus(res.code);
            setMsg(res.message);
            setShowToast(true);
            setShowRecoilToast(true);
          } else {
            setLockerList(res.data.result);
          }
        })
        .catch((error) => {
          setStatus(error.code);
          setMsg(error.name);
          setShowToast(true);
          setShowRecoilToast(true);
        });
      setIsChanged(false);
    }
  };

  useEffect(() => {
    setAskMenu(false);
    setLockerMenu(true);
    setMypageMenu(false);
    initLockerList();
  });

  const statusText = (status) => {
    switch (status) {
      case "empty":
        return;
      case "request":
        return "대여가 신청된 사물함입니다";
      case "return":
        return "반납이 신청된 사물함입니다";
      case "using":
        return "사용중";
      default:
        return "사용중단";
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "empty":
        return "#FFFFFF";
      case "request":
        return "#F4D364";
      case "return":
        return "#92E1D4";
      case "using":
        return "#8C52FF";
      default:
        return "#E05E76";
    }
  };

  const handleOnClick = (event) => {
    event.preventDefault();
    setShowModal(true);

    const locker_id = event.target.children[0].id;

    setModalInfo(lockerList[locker_id]);
  };

  const makeLocker = () => {
    const rows = [];

    const row = lockerInfo.row;
    const col = lockerInfo.col;

    let i = 0;

    for (let r = 0; r < row; r++) {
      const cols = [];
      for (let c = 0; c < col; c++, i++) {
        if (lockerList[i] !== null) {
          cols.push(
            <Col
              className="lockerCol"
              key={i}
              name={i}
              style={{ backgroundColor: statusColor(lockerList[i]?.status) }}
              onClick={(e) => handleOnClick(e)}
            >
              <div className="lockerId" id={i} onClick={(event) => event.stopPropagation()}>
                {lockerList[i]?.locker_id}
              </div>
              <div className="lockerStatus" onClick={(event) => event.stopPropagation()}>
                {statusText(lockerList[i]?.status)}
              </div>
              <div className="lockerStatus" onClick={(event) => event.stopPropagation()}>
                {lockerList[i]?.fk_user_id ? lockerList[i]?.fk_user_id : ""}
              </div>
            </Col>
          );
        }
      }
      rows.push(
        <Row key={r} className="lockerRow">
          {cols}
        </Row>
      );
    }
    return rows;
  };

  const handleOnHide = () => {
    setShowModal(false);
    setIsChanged(true);
    window.location.reload(true);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    let locker = lockerList.find((key) => key.locker_id === searchLocker);

    if (typeof locker !== "undefined") {
      setShowModal(true);
      setModalInfo(locker);
    } else {
      setStatus("탐색 불가");
      setMsg("존재하지 않는 사물함입니다");
      setShowInfoToast(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>학과 사물함 - 네모의 꿈</title>
      </Helmet>
      <Header id={user.id} />
      <Form onSubmit={handleOnSubmit} className="searchLockerForm">
        <Button variant="primary" type="submit" className="searchSubmit">
          검색
        </Button>
        <Form.Group className="mb-3">
          <Form.Control
            className="searchControl"
            name="lockerId"
            type="text"
            placeholder="사물함 번호 검색"
            value={searchLocker}
            onChange={(e) => setSearchLocker(e.target.value)}
            required
          />
        </Form.Group>
      </Form>
      {showToast ? <WarningToast warningStatus={status} warningMsg={msg} /> : null}
      {showInfoToast ? <InfoToast infoStatus={status} infoMsg={msg} /> : null}
      <div className="lockerPage">
        {showModal && user.permission ? (
          <LockerAdminModal show={showModal} onHide={() => handleOnHide()} locker={modalInfo} />
        ) : (
          showModal && <LockerUserModal show={showModal} onHide={() => handleOnHide()} locker={modalInfo} />
        )}
        <div className="lockerWrapper">{makeLocker()}</div>
      </div>
    </>
  );
}
