import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";

import Mypage from "./pages/User/Mypage";
import Signup from "./pages/User/Signup";
import Signin from "./pages/User/Signin";

import LockerInfo from "./pages/Locker/LockerInfo";
import LockerNumbers from "./pages/Locker/LockerNumbers";
import LockerPage from "./pages/Locker/LockerPage";

import BoardList from "./pages/Question/QuestionList";
import QuestionTemplete from "./pages/Question/Question";
import QuestionView from "./pages/Question/QuestionView";
import AnswerTemplete from "./pages/Question/Answer";
import AnswerView from "./pages/Question/AnswerView";
import NoticeTemplete from "./pages/Question/Notice";
import NoticeView from "./pages/Question/NoticeView";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Signin />} />
          <Route path="/lockerinfo" element={<LockerInfo />} />
          <Route path="/lockernumbers" element={<LockerNumbers />} />
          <Route path="/locker" element={<LockerPage />} />
          <Route path="/board" element={[<BoardList />]}></Route>
          <Route path="/board/:question_id" element={[<QuestionView />, <AnswerView />]}></Route>
          <Route path="/board/write" element={<QuestionTemplete />}></Route>
          <Route path="/board/notice" element={<NoticeTemplete />}></Route>
          <Route path="/board/notice/:notice_id" element={<NoticeView />}></Route>
          <Route path="/board/:question_id/answer" element={<AnswerTemplete />}></Route>
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
