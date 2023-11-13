import "./LockerInfo.css";
import { Form, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { lockerInfoAtom, userAtom } from "../../recoil/locker/atom";
import { userjwtAtom } from "../../recoil/user/atom";
import ErrorToast from "../../components/Toast/ErrorToast";
import image from "../../assets/images/locker_img.png";

import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

function textValidator(text) {
  if (text.trim().length < 1) return false;
  else return true;
}

function depositValidator(deposit) {
  return deposit > -1;
}

function rowColValidator(num) {
  return num > 2;
}

export default function LockerInfo() {
  const [showToast, setShowToast] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [validated, setValidated] = useState(false);

  const [recoilLockerInfo, setRecoilLockerInfo] = useRecoilState(lockerInfoAtom);

  const [user, setUser] = useRecoilState(userAtom);
  const userjwt = useRecoilValue(userjwtAtom);

  useEffect(() => {
    if (userjwt === null) {
      nav("/signin");
      Swal.fire("에러", "로그인을 해주세요.", "error");
    }
    if (!user) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/app/user`, {
          headers: {
            "nemo-access-token": userjwt,
          },
        })
        .then((res) => {
          if (res.data.isSuccess !== 200) {
            setErrorStatus(res.code);
            setErrorMsg("학과를 찾을 수 없습니다");
            setShowToast(true);
          }
          setUser(res.data.result);
        })
        .catch((error) => {
          setShowToast(true);
          setErrorStatus(error.code);
          setErrorMsg(error.name);
        });
    }
  }, []);

  const nav = useNavigate();

  const handleSubmit = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity()) {
      setValidated(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/nemo/lockers-info`,
          {
            location: recoilLockerInfo.location,
            deposit: recoilLockerInfo.deposit,
            row: recoilLockerInfo.row,
            col: recoilLockerInfo.col,
            order: recoilLockerInfo.order,
          },
          {
            headers: {
              "nemo-access-token": userjwt,
            },
          }
        )
        .then((res) => {
          if (res.data.isSuccess === false) {
            setErrorStatus(res.data.code);
            setErrorMsg(res.data.message);
            setShowToast(true);
            throw new Error("POST FAILED");
          }
        })
        .then(() => {
          nav("/lockernumbers", { replace: true });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setErrorStatus("NOT_VALID_INPUT");
      setErrorMsg("폼의 입력이 올바르지 않습니다");
      setShowToast(true);
      setValidated(false);
      return;
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setRecoilLockerInfo({
      ...recoilLockerInfo,
      [name]: value,
    });
  };

  return (
    <>
      <Helmet>
        <title>사물함 초기화(1/2) - 네모의 꿈</title>
      </Helmet>
      <div className="splitScreen">
        {showToast && <ErrorToast errorStatus={errorStatus} errorMsg={errorMsg} />}
        <div className="left">
          <p id="greetText">{user.id} 관리자님 반갑습니다👋</p>
          <p id="planeText">사물함의 정보를 입력해주세요</p>
          <img id="locker_img" src={image} alt="MISSING IMG" width={500} height={500}></img>
        </div>
        <div className="divider"></div>
        <div className="right">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="w-50">
              <Form.Label className="formLabel">사물함 위치</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={recoilLockerInfo.location}
                onChange={handleOnChange}
                placeholder="캠퍼스 정보와 건물 등의 위치"
                className="formControl"
                style={{ border: "2px solid black", width: "300px" }}
                isInvalid={!textValidator(recoilLockerInfo.location)}
                required
              />
              <Form.Text className="text-muted" style={{ float: "left" }}>
                예시: 수정캠퍼스 수정관 3층 A동
              </Form.Text>
              <Form.Control.Feedback type="invalid" style={{ textAlign: "start" }}>
                <br />
                [필수] 사물함의 위치를 입력해주세요
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="w-25">
              <Form.Label className="formLabel">보증금(단위: 원)</Form.Label>
              <Form.Control
                type="number"
                name="deposit"
                onChange={handleOnChange}
                value={recoilLockerInfo.deposit}
                placeholder="보증금 입력"
                className="formControl"
                style={{ border: "2px solid black", width: "150px" }}
                isInvalid={!depositValidator(recoilLockerInfo.deposit)}
                required
              />
              <Form.Text className="text-muted" style={{ float: "left", textAlign: "start", width: "400px" }}>
                예시: 5000(숫자만 기입해주세요)
              </Form.Text>
              <Form.Control.Feedback type="invalid" style={{ float: "left", textAlign: "start", width: "400px" }}>
                [필수] 보증금을 입력해주세요(없으면 '0')
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="w-25">
              <Form.Label className="formLabel">사물함 개수</Form.Label>
              <Form.Control
                type="number"
                name="row"
                min="3"
                onChange={handleOnChange}
                placeholder="행 입력"
                className="formControl"
                style={{ border: "2px solid black", width: "150px" }}
                isInvalid={!rowColValidator(recoilLockerInfo.row)}
                required
              />
              <Form.Text className="text-muted" style={{ float: "left", textAlign: "start", width: "300px" }}>
                예시: 3(숫자만 기입해주세요)
              </Form.Text>
              <Form.Control.Feedback type="invalid" style={{ float: "left", textAlign: "start", width: "400px", marginBottom: "10px" }}>
                [필수] 가능한 최소 행은 '3'입니다
              </Form.Control.Feedback>
              <Form.Control
                type="number"
                name="col"
                min="3"
                onChange={handleOnChange}
                placeholder="열 입력"
                className="formControl"
                style={{ border: "2px solid black", width: "150px" }}
                isInvalid={!rowColValidator(recoilLockerInfo.col)}
                required
              />
              <Form.Text className="text-muted" style={{ float: "left", textAlign: "start", width: "250px" }}>
                예시: 10(숫자만 기입해주세요)
              </Form.Text>
              <Form.Control.Feedback type="invalid" style={{ float: "left", textAlign: "start", width: "280px" }}>
                [팔수]가능한 최소 열은 '3'입니다
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="w-25">
              <Form.Label className="formLabel">번호매김 순서</Form.Label>
              <Form.Select
                name="order"
                value={recoilLockerInfo.order}
                onChange={handleOnChange}
                onClick={handleOnChange}
                style={{ border: "2px solid black", width: "200px" }}
                isInvalid={!textValidator(recoilLockerInfo.order)}
                required
              >
                <option value="row">가로 방향</option>
                <option value="col">세로 방향</option>
              </Form.Select>
              <Form.Text className="text-muted" style={{ float: "left", textAlign: "start", width: "250px" }}>
                가로 방향: ↔, 세로 방향: ↕
              </Form.Text>
              <Form.Control.Feedback type="invalid" style={{ float: "left", textAlign: "start", width: "280px" }}>
                [필수] 순서를 선택해주세요
              </Form.Control.Feedback>
            </Form.Group>
            <div className="bottomButtons">
              <Button type="submit" id="submitButton">
                등록하기
              </Button>
              <Button onClick={handleCancel} id="cancelButton">
                취소하기
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
