import "./Mypage.css";
import React from "react";
import { Form, Modal } from "react-bootstrap";
import axios from "axios";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userjwtAtom } from "../../recoil/user/atom";
import { lockerInfoAtom } from "../../recoil/locker/atom";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../../components/Header/Header";
import Swal from "sweetalert2";

export default function Mypage() {
  const [userId, setUserId] = React.useState("");
  const [userDepartment, setUserDepartment] = React.useState("");
  const [userPhoneNumber, setUserPhoneNumber] = React.useState("");
  const [userLocker, setUserLocker] = React.useState("");
  //  null -> 사용자가 신청한 사물함이 없음
  const [userDeposit, setUserDeposit] = React.useState("");
  const [returnLockerShowModal, setReturnLockerShowModal] = React.useState(false);
  const [withdrawShowModal, setWithdrawShowModal] = React.useState(false);
  const [userPermission, setUserPermission] = React.useState("");
  const [lockerLocation, setLockerLocation] = React.useState("");
  const [lockerRow, setLockerRow] = React.useState("");
  const [lockerCol, setLockerCol] = React.useState("");
  const [lockerDeposit, setLockerDeposit] = React.useState("");
  const setLockerInfo = useSetRecoilState(lockerInfoAtom);
  const [lockerStatus, setLockerStatus] = React.useState("");

  const userjwt = useRecoilValue(userjwtAtom);
  const navigate = useNavigate();

  // 사용자 전화번호 변경 입력 처리
  function handleUserPhoneNumberChange(event) {
    const phoneNumber = event.target.value.replace(/-/g, "");

    setUserPhoneNumber(phoneNumber);
  }

  function handleUserPhoneNumberSubmit(event) {
    event.preventDefault();

    // 전화번호 11자리 미만 입력 시 경고창 표시
    if (userPhoneNumber.length !== 11 || isNaN(userPhoneNumber)) {
      Swal.fire("입력 오류", "전화번호 11자리를 입력해주세요. 숫자만 입력 가능합니다.", "error");
    } else {
      axios
        .patch(
          `${process.env.REACT_APP_API_URL}/app/user`,
          { phoneNumber: userPhoneNumber },
          {
            headers: {
              "nemo-access-token": userjwt,
            },
          }
        )
        .then((res) => {
          if (res.status.isSuccess) {
            Swal.fire("에러", "전화번호 변경에 실패하였습니다.", "error");
          } else {
            Swal.fire("성공", "전화번호 변경에 성공하였습니다.", "success");
          }
        });
    }
  }

  useEffect(() => {
    if (userjwt === null) {
      navigate("/signin");
      Swal.fire("에러", "로그인을 해주세요.", "error");
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/app/user`, {
          headers: {
            "nemo-access-token": userjwt,
          },
        });
        const { id, department, phoneNumber, permission } = userResponse.data.result;

        setUserId(id);
        setUserDepartment(department);
        setUserPhoneNumber(phoneNumber);
        setUserPermission(permission);

        const lockerResponse = await axios.get(`${process.env.REACT_APP_API_URL}/nemo/check`, {
          headers: {
            "nemo-access-token": userjwt,
          },
        });

        await axios.get(`${process.env.REACT_APP_API_URL}/nemo/lockers-info?department=${department}`).then((res) => {
          if (res.data.isSuccess) {
            setLockerDeposit(res.data.result.deposit);
            setUserDeposit(res.data.result.deposit);
            setLockerLocation(res.data.result.location);
            setLockerRow(res.data.result.row);
            setLockerCol(res.data.result.col);
          } else {
            setUserDepartment("");
          }
        });

        if (lockerResponse.data && lockerResponse.data.result) {
          setUserLocker(lockerResponse.data.result.locker_id);
          setLockerStatus(lockerResponse.data.result.status);
        } else {
          setUserDeposit("");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userjwt]);

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleReturnLockerShowModal() {
    // 팝업 표시
    setReturnLockerShowModal(true);
  }

  function handleReturnLockerCloseModal() {
    // 팝업 닫기
    setReturnLockerShowModal(false);
  }

  function handleReturnLocker() {
    // 서버에 사물함 반납 요청 전송
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/nemo/locker/return/${userLocker}`,
        {},
        {
          headers: {
            "nemo-access-token": userjwt,
          },
        }
      )
      .then((res) => {
        if (res.data.isSuccess) {
          Swal.fire("성공", res.data.message, "success");
          setReturnLockerShowModal(false);
          navigate("/locker");
        } else {
          Swal.fire("에러", res.data.message, "error");
        }
      });
  }

  function handleDeleteAllLockers() {
    // 서버에 사물함 삭제 요청 전송
    Swal.fire("확인", "사물함 전체를 삭제합니다.", "info");

    axios
      .delete(`${process.env.REACT_APP_API_URL}/nemo/lockers`, {
        headers: {
          "nemo-access-token": userjwt,
        },
      })
      .then((res) => {
        setLockerInfo({ location: "", deposit: 0, row: 0, col: 0, order: "" });
        if (res.data.isSuccess) {
          Swal.fire("성공", "사물함 전체 삭제에 성공하였습니다.", "success");
        }
        navigate("/lockerinfo");
      });
  }

  // 탈퇴하기 버튼 클릭 시
  function handleWithdrawShowModal() {
    if (userLocker.length !== 0) {
      setWithdrawShowModal(true); // 탈퇴하기 모달을 표시하기 위해 상태를 true로 설정
    } else {
      // 서버에 회원탈퇴 요청 전송
      axios
        .patch(
          `${process.env.REACT_APP_API_URL}/user/goodbye`,
          { id: userId },
          {
            headers: {
              "nemo-access-token": userjwt,
            },
          }
        )
        .then((res) => {
          if (res.data.isSuccess) {
            Swal.fire("성공", "회원탈퇴가 완료되었습니다.", "success");
            navigate("/signin");
          } else {
            Swal.fire("에러", "회원 탈퇴에 실패하였습니다. ", "error");
          }
        });
    }
  }

  function handleWithdrawCloseModal() {
    // 팝업 닫기
    setWithdrawShowModal(false);
  }

  function setLockerStatusText() {
    if (lockerStatus === "using") {
      return "대여중인 사물함";
    } else if (lockerStatus === "request") {
      return "대여 요청중인 사물함";
    } else if (lockerStatus === "return") {
      return "반납 요청중인 사물함";
    }
    return "사용중인 사물함이 없습니다";
  }

  return (
    <>
      <Header id={userId} />
      <div className="Mypage">
        <Helmet>
          <title>마이페이지 - 네모의 꿈</title>
        </Helmet>
        <Form className="mypage_class" onSubmit={handleSubmit}>
          <div className="info">
            <div className="my_id">
              <Form.Label>학번</Form.Label>
              <Form.Control type="text" value={userId} readOnly />
            </div>

            <div className="my_department">
              <Form.Label>학과</Form.Label>
              <Form.Control
                type="text"
                value={userDepartment === "computerEngineering" ? "컴퓨터공학과" : userDepartment === "schoolOfAI" ? "AI융합학부" : ""}
                readOnly
              />
            </div>
          </div>

          {(userPermission === 0 || userPermission === "0") && (
            <div className="my_number">
              <div className="my_number_div">
                <Form.Group size="lg" controlId="userPhoneNumber">
                  <Form.Label>전화번호</Form.Label>
                  <Form.Control className="mypage_phoneNumber" type="text" value={userPhoneNumber} onChange={handleUserPhoneNumberChange} />
                </Form.Group>
              </div>
              <button className="number_button" type="submit" onClick={handleUserPhoneNumberSubmit}>
                전화번호 변경
              </button>
            </div>
          )}

          <div className="locker">
            {(userPermission === 0 || userPermission === "0") && (
              <>
                <Form.Label>{setLockerStatusText()}</Form.Label>
                <Form.Control
                  type="text"
                  value={userLocker ? userLocker + "번" : "대여한 사물함이 없습니다."}
                  style={{ width: "200px" }}
                  readOnly
                />
              </>
            )}
          </div>

          {userPermission !== 0 && (
            <>
              <div className="locker-info">
                <Form.Label>관리중인 사물함 정보</Form.Label>
                <div className="locker-location">
                  <Form.Control type="text" value={lockerLocation ? lockerLocation : "사물함 위치정보가 없습니다."} readOnly />
                </div>
                <p> </p>
                <Form.Label>사물함 개수</Form.Label>
                <p> </p>
                <Form.Label>행</Form.Label>
                <div className="locker-row">
                  <Form.Control type="text" value={lockerRow ? lockerRow : ""} readOnly />
                </div>
                <Form.Label>열</Form.Label>
                <div className="locker-col">
                  <Form.Control type="text" value={lockerCol ? lockerCol : ""} readOnly />
                </div>
                <p></p>
              </div>
            </>
          )}

          {userPermission !== 0 ? (
            <div className="deposit">
              <Form.Label>보증금</Form.Label>
              <Form.Control type="text" value={lockerDeposit ? lockerDeposit : "0원"} style={{ width: "200px" }} readOnly />
            </div>
          ) : (
            <div className="deposit">
              <Form.Label>보증금</Form.Label>
              <Form.Control type="text" value={userDeposit ? userDeposit : "0원"} style={{ width: "200px" }} readOnly />
            </div>
          )}

          {lockerStatus === "using" ? (
            <>
              <button type="button" onClick={handleReturnLockerShowModal}>
                {"반납요청 하기"}
              </button>
              <div className="return_pop">
                <Modal className="return_modal" show={returnLockerShowModal} onHide={handleReturnLockerCloseModal}>
                  <Modal.Header>
                    <Modal.Title></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <h4>사물함 반납 신청</h4>
                    <br></br>
                    <p>반납하는 사물함 정보 확인 후 신청 바랍니다.</p>
                    <br></br>

                    <h5>사물함 정보</h5>
                    <p>대여자 학과: {userDepartment}</p>
                    <p>대여자 학번: {userId}</p>
                    <p>전화번호: {userPhoneNumber}</p>
                    <p>사물함 번호: {userLocker}</p>
                    <p>보증금: {userDeposit} </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <button className="return" onClick={handleReturnLocker}>
                      반납신청
                    </button>
                    <button className="close" onClick={handleReturnLockerCloseModal}>
                      닫기
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            </>
          ) : null}

          {userPermission !== 0 ? (
            <button className="delete-lockers" onClick={handleDeleteAllLockers}>
              전체 사물함 삭제
            </button>
          ) : (
            <button className="goodbye" onClick={handleWithdrawShowModal}>
              회원탈퇴
            </button>
          )}

          <div className="withdraw_pop">
            <Modal className="withdraw_modal" show={withdrawShowModal} onHide={handleWithdrawCloseModal}>
              <Modal.Header>
                <Modal.Title>회원탈퇴</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p> 사물함이 완전히 반납처리가 되어야 회원 탈퇴가 가능합니다.</p>
                <p> 대여한 사물함을 반납해주시기 바랍니다.</p>
              </Modal.Body>
              <Modal.Footer>
                <button className="close" onClick={handleWithdrawCloseModal}>
                  닫기
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </Form>
      </div>
    </>
  );
}
