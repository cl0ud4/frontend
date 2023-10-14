import "./Signup.css";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Logo from "../../assets/images/signup_logo.png";
import Swal from "sweetalert2";

export default function Signup() {
  const [userId, setUserId] = React.useState("");
  const [userDepartment, setUserDepartment] = React.useState("");
  const [userPhoneNumber, setUserPhoneNumber] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [userPasswordCheck, setUserPasswordCheck] = React.useState("");
  const [mailAuthenticationNumber, setMailAuthenticationNumber] = React.useState("");
  const [isMailChecked, setIsMailChecked] = React.useState(false);
  const [adminCheck, setAdminCheck] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [adminShowModal, setAdminShowModal] = React.useState(false);

  let invalidFormMsg = "";
  const navigate = useNavigate();

  function handleSignup(event) {
    event.preventDefault();
    const isValidForm = validateForm();
    if (isValidForm === false) {
      Swal.fire("입력오류", invalidFormMsg, "error");
      invalidFormMsg = "";
      return;
    }

    // 학번 8자리 미만 9자리 초과 입력 시 경고창 표시
    if (adminCheck === "0" && (userId.length < 8 || userId.length > 9)) {
      Swal.fire("입력 오류", "학번을 다시 입력해주세요.", "error");
      return;
    }

    // 관리자라면 관리자로 등록
    if (adminCheck === "1") {
      axios
        .post(`${process.env.REACT_APP_API_URL}/signup/admin`, {
          id: userId,
          department: userDepartment,
          password: userPassword,
          permission: adminCheck,
        })
        .then((response) => {
          const data = response.data;
          if (data.isSuccess) {
            Swal.fire("성공", "회원가입이 완료되었습니다. 관리자 계정은 승인 후 로그인할 수 있습니다.", "success");
            navigate("/signin");
          } else {
            Swal.fire("에러", "회원가입에 실패하였습니다.", "error");
          }
        })
        .catch((error) => {
          console.error("에러 발생:", error);
        });
    } else {
      if (userPhoneNumber.length !== 11) {
        Swal.fire("입력 오류", "전화번호를 다시 입력해주세요.", "error");
        return;
      }
      axios
        .post(`${process.env.REACT_APP_API_URL}/signup`, {
          id: userId,
          department: userDepartment,
          phoneNumber: userPhoneNumber,
          password: userPassword,
          permission: adminCheck,
        })
        .then((response) => {
          const data = response.data;

          if (data.isSuccess) {
            Swal.fire("성공", "회원가입이 완료되었습니다.", "success");

            navigate("/signin");
          } else if (data.code === 2022) {
            Swal.fire("에러", "학과 사물함이 존재하지 않아 가입이 불가합니다.", "error");
          } else {
            Swal.fire("에러", data.message, "error");
          }
        })
        .catch((error) => {
          console.error("에러 발생:", error);
        });
    }
  }

  function onClickSendMail() {
    // 메일 전송 버튼
    if (userId.length < 8 || userId.length > 9) {
      alert("학번을 다시 입력해주세요");
      setIsMailChecked(false);
      return;
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/app/mail/send`, {
          studentId: userId,
        })
        .then((res) => {
          if (res.data.isSuccess === false) {
            setIsMailChecked(false);
            Swal.fire("서버에러", "인증번호 메일 발송에 실패하였습니다.", "error");
          } else Swal.fire("성공", "인증번호 메일 발송이 완료되었습니다.", "success");
        })
        .catch((error) => {
          setIsMailChecked(false);
          alert(error);
        });
    }
  }

  function handleMailAuthenticationNumber(event) {
    setMailAuthenticationNumber(event.target.value);
  }
  function onClickCheckAuthentication() {
    //인증번호 확인
    if (mailAuthenticationNumber.toString().length === 6) {
      // 인증번호는 6자리
      axios
        .post(`${process.env.REACT_APP_API_URL}/app/mail/check`, {
          studentId: userId,
          mailAuthenticationNumber: mailAuthenticationNumber,
        })
        .then((res) => {
          if (res.data.isSuccess === false) {
            setIsMailChecked(false);
            alert(res.data.message);
          } else {
            setIsMailChecked(true);
            Swal.fire("성공", "인증이 완료되었습니다.", "success");
          }
        })
        .catch((error) => {
          setIsMailChecked(false);
          alert(error);
        });
    } else {
      setIsMailChecked(false);
      alert("인증번호는 6자리입니다 다시 확인해주세요");
    }
  }

  // 사용자 학번, 학과, 전화번호 입력 처리
  function handleUserId(event) {
    setUserId(event.target.value);
  }

  function handleUserDepartment(event) {
    setUserDepartment(event.target.value);
  }

  function handleUserPhoneNumber(event) {
    // 전화번호에 - 제거
    const phoneNumber = event.target.value.replace(/-/g, "");
    setUserPhoneNumber(phoneNumber);
    // 전화번호 11자리 이상 입력 시 경고창 표시
  }

  function handleUserPassword(event) {
    setUserPassword(event.target.value);
  }

  function handleUserPasswordCheck(event) {
    setUserPasswordCheck(event.target.value);
  }

  function handleAdminCheck(event) {
    setAdminCheck(event.target.value);
    if (event.target.value === "0") {
      setShowModal(true);
    } else if (event.target.value === "1") {
      setAdminShowModal(true);
    }
  }

  function handleCloseInfomoal() {
    setShowModal(false);
  }

  function handleCloseAdminInfomoal() {
    setAdminShowModal(false);
  }

  function validateForm() {
    if (adminCheck === "1" && (userId[0] !== "s" || userId[1] !== "s" || userId[2] !== "w" || userId[3] !== "u" || userId[4] !== "-")) {
      invalidFormMsg = "관리자 계정의 아이디는 sswu-로 시작해야합니다";
      return false;
    }
    if (adminCheck === "0" && isMailChecked === false) {
      invalidFormMsg = "학번 인증이 완료되지 않았습니다";
      return false;
    }
    if (userDepartment.length === 0) {
      invalidFormMsg = "학과를 선택해주세요";
      return false;
    }
    if (userPassword.length === 0) {
      invalidFormMsg = "비밀번호를 입력해주세요";
      return false;
    }
    if (userPassword !== userPasswordCheck) {
      invalidFormMsg = "비밀번호 확인이 일치하지 않습니다";
      return false;
    }
    return true;
  }

  return (
    <div className="Signup">
      <Helmet>
        <title>회원가입 - 네모의 꿈</title>
      </Helmet>
      <img className="logo_signup" src={Logo} alt="logo" width="80" height="50" />
      <Form className="signup_class" onSubmit={handleSignup}>
        <div className="page_title">
          <h1>회원가입</h1>
        </div>
        <div className="info-modal">
          <Modal className="signup-info-modal" show={showModal} onHide={handleCloseInfomoal}>
            <Modal.Header closeButton>
              <Modal.Title>회원가입 안내</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>학교 메일을 통한 학번 인증을 완료해야 회원가입이 가능합니다.</p>
              <p>학번 인증을 완료하지 않은 상태에서 회원가입을 진행하면</p>
              <p>회원가입이 되지 않습니다.</p>
            </Modal.Body>
            <Modal.Footer className="user-modal">
              <p>학과 정보가 변경되어 재가입하려는 경우 sswudreamofnemo@gmail.com 으로 연락주시기 바랍니다.</p>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="admin-info-modal">
          <Modal className="signup-info-modal" show={adminShowModal} onHide={handleCloseAdminInfomoal}>
            <Modal.Header closeButton>
              <Modal.Title>관리자 계정 안내</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>관리자 계정은 관리자임을 확인 받은 후 로그인할 수 있습니다.</p>
              <p>관리자 가입기간 내 sswudreamofnemo@gmail.com 으로 연락주시면 </p>
              <p>관리자 자격 확인 후 아이디를 승인해드리겠습니다. </p>
              <h6>관리자 가입 기간 : 2023.08.20 ~ 2023.08.30</h6>
            </Modal.Body>
          </Modal>
        </div>

        <div className="status">
          <Form.Label>관리자 여부</Form.Label>
          <Form.Select aria-label="관리자 여부" value={adminCheck} onChange={handleAdminCheck}>
            <option value="">선택 필수</option>
            <option value="0">일반 학생</option>
            <option value="1">관리자</option>
          </Form.Select>
        </div>

        {adminCheck === "0" ? (
          <>
            <div className="id_div">
              <div className="new_id">
                <Form.Label style={{ display: "flex" }}>학번</Form.Label>
                <input
                  className="new_user_id"
                  type="text"
                  value={userId}
                  onChange={handleUserId}
                  style={{ width: "150px", float: "left" }}
                />
              </div>
              <Button style={{ width: "130px", marginTop: "30px", marginLeft: "10px" }} onClick={onClickSendMail}>
                인증번호 발송
              </Button>
            </div>
            <div className="new_id">
              <Form.Label style={{ display: "flex", marginTop: "10px" }}>메일인증 번호</Form.Label>
              <Form.Control
                isValid={isMailChecked}
                isInvalid={!isMailChecked}
                type="number"
                value={mailAuthenticationNumber}
                onChange={handleMailAuthenticationNumber}
                placeholder="인증번호 기입"
                style={{ width: "150px", marginBottom: "10px", float: "left" }}
              />
              <Button style={{ width: "130px", marginLeft: "10px", marginBottom: "20px" }} onClick={onClickCheckAuthentication}>
                인증번호 확인
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="id_div">
              <div className="new_id">
                <Form.Label style={{ display: "flex" }}>아이디</Form.Label>
                <input
                  className="new_user_id"
                  type="text"
                  value={userId}
                  onChange={handleUserId}
                  placeholder="예시:sswu-com"
                  style={{ width: "150px", float: "left", marginBottom: "20px" }}
                />
              </div>
            </div>
          </>
        )}

        <div className="department">
          <Form.Label>학과</Form.Label>
          <select className="select_department" aria-label="학과 선택" value={userDepartment} onChange={handleUserDepartment}>
            <option value="">학과를 선택하세요</option>
            <option value="computerEngineering">컴퓨터공학과</option>
            <option value="schoolOfAI">AI융합학부</option>
          </select>
        </div>

        {adminCheck === "0" && (
          <div className="number">
            <Form.Group controlId="userPhoneNumber">
              <Form.Label>전화번호</Form.Label>
              <input
                className="new_user_phoneNumber"
                placeholder="숫자만 입력해주세요."
                type="text"
                value={userPhoneNumber}
                onChange={handleUserPhoneNumber}
              />
            </Form.Group>
          </div>
        )}

        <div className="password">
          <Form.Label>비밀번호 입력</Form.Label>
          <input className="new_user_password" type="password" value={userPassword} onChange={handleUserPassword} />
        </div>
        <div className="password_check">
          <Form.Label>비밀번호 확인</Form.Label>
          <input className="new_user_password_check" type="password" value={userPasswordCheck} onChange={handleUserPasswordCheck} />
        </div>

        <button type="submit">회원가입</button>
      </Form>
    </div>
  );
}
