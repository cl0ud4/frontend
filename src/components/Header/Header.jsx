import "./Header.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { askMenuAtom, lockerMenuAtom, mypageMenuAtom } from "../../recoil/menu/atom";
import { logout } from "../../api/userApi";

export default function Header(props) {
  const [askMenu, setAskMenu] = useRecoilState(askMenuAtom);
  const [lockerMenu, setLockerMenu] = useRecoilState(lockerMenuAtom);
  const [mypageMenu, setMypageMenu] = useRecoilState(mypageMenuAtom);
  const navigate = useNavigate();

  const handleOnClickLogout = async () => {
    const res = await logout();

    sessionStorage.clear();
    navigate("/signin");
  };

  const handleOnClickAsk = () => {
    setAskMenu(true);
    setLockerMenu(false);
    setMypageMenu(false);
    window.location.assign("/board");
  };

  const handleOnClickLocker = () => {
    setAskMenu(false);
    setLockerMenu(true);
    setMypageMenu(false);
  };

  const handleOnClickMypage = () => {
    setAskMenu(false);
    setLockerMenu(false);
    setMypageMenu(true);
  };

  return (
    <>
      <div className="headerWrap">
        <h3 className="title">
          성신여자대학교
          <br />
          사물함 대여 시스템
        </h3>
        <div className="headerLogin">
          <div className="userId">{props.id ? props.id : "김수룡"}</div>
          <button className="logoutButton" onClick={handleOnClickLogout}>
            로그아웃
          </button>
        </div>
        <div className="navWrap">
          <hr className="line" />
          <nav className="topMenu">
            <ul className="menu">
              <li className="menuList" style={{ backgroundColor: askMenu ? "#f4d364" : "#6860a4" }}>
                <Link onClick={handleOnClickAsk} to="/board">
                  Q&A
                </Link>
              </li>
              <li className="menuList" style={{ backgroundColor: lockerMenu ? "#f4d364" : "#6860a4" }}>
                <Link onClick={handleOnClickLocker} to="/locker">
                  사물함
                </Link>
              </li>
              <li className="menuList" style={{ backgroundColor: mypageMenu ? "#f4d364" : "#6860a4" }}>
                <Link onClick={handleOnClickMypage} to="/mypage">
                  마이페이지
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
