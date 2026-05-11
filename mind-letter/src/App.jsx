import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';

// 1. 대문 화면 (MainScreen)
function MainScreen() {
  return (
    <div className="main-container">
      <div className="main-content">
        <h1 className="main-title">마음편지함</h1>
        <p className="main-subtitle">소중한 온기를 담아 전하는 정갈한 공간</p>
        <Link to="/bookcase" className="enter-button">
          서재 입장하기
        </Link>
      </div>
    </div>
  );
}

// 임시 편지 데이터 (시인님의 서재를 채워줄 따뜻한 편지들)
const initialLetters = [
  { id: 1, title: "오월의 푸른 잎사귀에게", sender: "그리움", receiver: "나 나", content: "초록이 짙어가는 계절입니다. 마음에 남겨둔 작은 안부들이 잎사귀 사이로 반짝이는 날, 당신의 하루도 평안하길 바랍니다." },
  { id: 2, title: "소리 없이 내리는 비처럼", sender: "빗방울", receiver: "기다림", content: "창가에 가만히 기대어 빗소리를 듣습니다. 요란하지 않게 대지를 적시는 비처럼, 가만히 스며드는 온기를 보냅니다." }
];

// 2. 서재 화면 (BookcaseScreen)
function BookcaseScreen() {
  return (
    <div className="bookcase-container">
      <h2 className="section-title">마음의 서재</h2>
      <p className="section-desc">그동안 차곡차곡 쌓인 온기들을 꺼내어 봅니다.</p>
      <div className="bookcase-box">
        <Link to="/letters" className="bookcase-link">
          📮 도착한 편지 꾸러미 열어보기
        </Link>
      </div>
      <div className="back-link-box">
        <Link to="/" className="back-link">대문으로 돌아가기</Link>
      </div>
    </div>
  );
}

// 3. 편지 목록 화면 (LetterListScreen)
function LetterListScreen() {
  return (
    <div className="list-container">
      <h2 className="section-title">편지함 목록</h2>
      <div className="letter-list">
        {initialLetters.map((letter) => (
          <Link to={`/letter/${letter.id}`} key={letter.id} className="letter-item">
            <span className="letter-title">{letter.title}</span>
            <span className="letter-info">보낸이: {letter.sender}</span>
          </Link>
        ))}
      </div>
      <div className="back-link-box">
        <Link to="/bookcase" className="back-link">서재로 돌아가기</Link>
      </div>
    </div>
  );
}

// 4. 편지 상세 보기 화면 (LetterDetailScreen)
function LetterDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const letter = initialLetters.find(l => l.id === parseInt(id));

  if (!letter) {
    return (
      <div className="detail-container">
        <p>편지를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/letters')} className="back-button">목록으로</button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-header">
          <span className="detail-user">보낸 이: {letter.sender} ➔ 받는 이: {letter.receiver}</span>
          <h3 className="detail-title">{letter.title}</h3>
        </div>
        <p className="detail-content">{letter.content}</p>
      </div>
      <button onClick={() => navigate('/letters')} className="back-button">목록으로 돌아가기</button>
    </div>
  );
}

// 5. 전체 라우터 조립 (App)
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/bookcase" element={<BookcaseScreen />} />
        <Route path="/letters" element={<LetterListScreen />} />
        <Route path="/letter/:id" element={<LetterDetailScreen />} />
      </Routes>
    </Router>
  );
}

export default App;