import "./LockerNumbers.css";

import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";

import { adminAtom, lockerInfoAtom, lockerIdsAtom, idArrayAtom } from "../../recoil/locker/atom";
import { userjwtAtom } from "../../recoil/user/atom";
import { useNavigate } from "react-router-dom";
import WarningToast from "../../components/Toast/WarningToast";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

export default function LockerNumbers() {
  const [showToast, setShowToast] = useState(false);

  const lockerInfo = useRecoilValue(lockerInfoAtom);
  const admin = useRecoilValue(adminAtom);
  // 기본 배열로 초기화, 추후 최종 배열
  const [lockerIds, setLockerIds] = useRecoilState(lockerIdsAtom);
  // 입력으로 업데이트 되는 배열
  const [idArray, setIdArray] = useRecoilState(idArrayAtom);

  const userjwt = useRecoilValue(userjwtAtom);

  const nav = useNavigate();

  let row = lockerInfo.row;
  let col = lockerInfo.col;
  const lockerArrayMaker = () => {
    setShowToast(true);
    let arr_size = lockerInfo.row * lockerInfo.col;

    let tmp_arr = new Array(arr_size);

    let i = 0;
    arr_size = lockerInfo.row * lockerInfo.col;

    if (lockerInfo.order === "row") {
      while (i < arr_size) {
        tmp_arr[i] = i + 1;
        i++;
      }
    } else {
      let row_counter = 1;
      for (; i < arr_size; row_counter++) {
        for (let over = 0; over < col; over++, i++) {
          tmp_arr[i] = row_counter + row * over;
        }
      }
    }
    setLockerIds(tmp_arr);
    setIdArray(tmp_arr);
  };

  useEffect(() => {
    if(userjwt===null) {
      Swal.fire("에러", "로그인을 해주세요.", "error");
      nav('/signin')
    }
    lockerArrayMaker();
    setShowToast(false);
  }, []);

  const handleOnChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    const newLockerIds = [...idArray];
    newLockerIds[name] = value;
    setIdArray(newLockerIds);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/nemo/lockers-info/number`,
        {
          lockerIds: idArray,
        },
        {
          headers: {
            "nemo-access-token": userjwt,
          },
        }
      )
      .then((res) => {
        if (res.data.isSuccess === false) {
          throw new Error("LOCKERS INFO POST FAILED");
        }
      })
      .then(() => {
        nav("/locker", { replace: true });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const gridInputs = () => {
    const rows = [];
    let i = 0;

    for (let r = 0; r < row; r++) {
      const cols = [];
      for (let c = 0; c < col; c++, i++) {
        cols.push(
          <Col className="gridCols" key={i}>
            <input className="gridInputs" type="text" name={i} onChange={(e) => handleOnChange(e)} />
            <p>{lockerIds[i]}</p>
          </Col>
        );
      }
      rows.push(
        <Row key={r} className="gridRows">
          {cols}
        </Row>
      );
    }

    return rows;
  };

  return (
    <>
      <Helmet>
        <title>사물함 초기화(2/2) - 네모의 꿈</title>
      </Helmet>
      <div className="container">
        {showToast ? (
          <WarningToast warningStatus={"not prepared"} warningMsg={"사물함이 준비되는 중입니다..."} />
        ) : (
          <>
            <Card style={{ display: "contents", textAlign: "center", left: "35%" }}>
              <Card.Body>
                <Card.Title>사물함 번호 기입 안내사항</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">사물함 번호를 작은 네모칸에 적어주세요</Card.Subtitle>
                <Card.Text>
                  💡 입력칸 아래의 숫자는 앞 페이지에서 작성하신 순서에 기반한 <strong>기본번호</strong>입니다
                  <br />
                  <br />✨ 번호를 기입하지 않은 사물함은 기본번호로 자동 저장됩니다
                  <br />
                  <br />✨ 사물함 번호가 아래 번호와 일치하는 경우 기입하지 않으셔도 됩니다
                </Card.Text>
              </Card.Body>
            </Card>
            <div className="formWrapper">
              <form>{gridInputs()}</form>
              <Button className="numberSubmitButton" variant="outline-primary" onClick={handleSubmit}>
                🔑✨ 사물함 설정 완료!
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
