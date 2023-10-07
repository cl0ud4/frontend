import { Component } from "react";
import Axios from "axios";
import { Link  } from "react-router-dom";
import "./QuestionList.css";
import Pagination from "./QuestionPaging";
import WriteButton from "./WriteButton";
import Header from "../../components/Header/Header";
import { Helmet } from "react-helmet-async";
import { userjwtAtom } from "../../recoil/user/atom"; // jwt 정보 정의 파일
import { useRecoilValue } from "recoil";

var userjwt = null;
const depList = {
  computerEngineering: "컴퓨터공학과",
  schoolOfAI: "AI융합학부"
};

function JwtDisplay() {
  userjwt = useRecoilValue(userjwtAtom);
  return userjwt;
}

const Board = ({ no, id, title, created_date, department, state }) => {
  return (
    <tr>
      <td>{no}</td>
      <td>{depList[department]}</td>
      <td className="title-board">
        <Link to={`/board/${id}`}>{title}</Link>
      </td>
      <td>{created_date}</td>
      <td>{state}</td>
    </tr>
  );
};

const BoardNotice = ({ id, title, created_date }) => {
  return (
    <tr>
      <td className="notice-tbody">공지</td>
      <td></td>
      <td className="title-board">
        <Link to={`/board/notice/${id}`}>{title}</Link>
      </td>
      <td>{created_date}</td>
      <td></td>
    </tr>
  );
};

/**
 * BoardList class
 */
class BoardList extends Component {
  state = {
    noticeList: [],
    boardList: [],
    pageNo: 1, // 페이징 넘버
    userjwt: "",
    userContent: [],
    selectedValue: "default",
    department: "default",
    pageCnt: 0,
    pageNum: 0,
  };

  getListCnt = () => {
    Axios.get(`${process.env.REACT_APP_API_URL}/question/cnt?department=${this.state.department}`, {})
      .then((res) => {
        const length = res.data.result[0].cnt;

        this.setState({
          pageCnt: length,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  getNotice = () => {
    Axios.get(`${process.env.REACT_APP_API_URL}/notice`, {})
      .then((res) => {
        const { data } = res;
        this.setState({
          noticeList: data,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  getUser = () => {
    <JwtDisplay />;
    Axios.get(`${process.env.REACT_APP_API_URL}/app/user`, {
      headers: {
        "nemo-access-token": userjwt,
      },
    })
      .then((res) => {
        const { data } = res;
        this.setState({
          userContent: data.result,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  componentDidMount() {
    this.getList();
    this.getNotice();
    this.getUser();
    this.getListCnt();
    console.warn = () => {};
  }

  check = (x) => {
    this.setState({
      pageNo: x,
      pageNum: (x - 1) * 10,
    });
  };

  handleSelectChange = (event) => {
    this.setState({ selectedValue: event.target.value });
  };

  handleButtonClick = () => {
    this.setState({ department: this.state.selectedValue }, () => {
      this.getList(); // 버튼 클릭 시 getList 함수 호출하여 페이지로 이동
      this.getListCnt();
    });
  };

  getList = () => {
    Axios.get(`${process.env.REACT_APP_API_URL}/question?department=${this.state.department}`, {})
      .then((res) => {
        const { data } = res;
        this.setState({
          boardList: data,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * @return {Component} Component
   */
  render() {
    const { noticeList, boardList, pageNo, userContent, pageCnt, pageNum } = this.state;

    let isContent = true;
    if (typeof userContent === 'undefined') isContent = false;

    return (
      <div>
        <div className="jwt-hidden">
          <JwtDisplay />
        </div>

        <Header id={isContent ? userContent.id : ""} />
        <br />
        <br />
        <div className="Question-App">
          <Helmet>
            <title>문의글 보기 - 네모의 꿈</title>
          </Helmet>
          <h1>Q&A</h1>
          <h3>1:1 문의하기</h3>
        </div>
        <br />
        <div id="board-search">
          <div className="board-container">
            <table className="board-table" hover="true" bordered="true" striped="true">
              <thead>
                <tr>
                  <th scope="col" className="th-num">
                    No
                  </th>
                  <th scope="col" className="th-dep">
                    학과
                  </th>
                  <th scope="col" className="th-title">
                    제목
                  </th>
                  <th scope="col" className="th-date">
                    작성일
                  </th>
                  <th scope="col" className="th-date">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {noticeList.result &&
                  noticeList.result.map((v, i) => {
                    return <BoardNotice key={`notice_${v.notice_id}`} title={v.title} id={v.notice_id} created_date={v.created_date} />;
                  })}
                {
                  // eslint-disable-next-line
                  boardList.result &&
                    boardList.result.slice((pageNo - 1) * 10, pageNo * 10).map((v, i) => {
                      return (
                        <Board
                          key={`board_${v.question_id}`}
                          title={v.title}
                          no={pageCnt - (pageNum + i)}
                          id={v.question_id}
                          created_date={v.created_date}
                          department={v.department}
                          state={v.state}
                        />
                      );
                    })
                }
              </tbody>
            </table>
            <div className="button-line">
              <select
                className="select-department"
                aria-label="학과 선택"
                value={this.state.selectedValue}
                onChange={this.handleSelectChange}
              >
                <option value="default">학과를 선택하세요</option>
                <option value="computerEngineering">컴퓨터공학과</option>
                <option value="choolOfAIConvergence">AI융합학부</option>
              </select>
              <button className="q-search-btn" onClick={this.handleButtonClick}>
                검색
              </button>
              <WriteButton />
            </div>
          </div>
        </div>

        <Pagination check={this.check} totalPage={pageCnt} />
      </div>
    );
  }
}

export default BoardList;
