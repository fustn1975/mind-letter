import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// .env 파일에 적어둔 주소와 열쇠를 자동으로 안전하게 읽어옵니다.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleUnlock = () => {
    if (password === '1004') {
      setCurrentUser('허정');
      setIsAuthenticated(true);
    } else if (password === '4001') {
      setCurrentUser('로터스');
      setIsAuthenticated(true);
    } else {
      alert('마음의 문이 열리지 않았습니다. 비밀번호를 다시 확인해 주세요.');
      setPassword('');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-stone-200' : 'bg-[#fcfbf9] text-stone-800'} font-serif`}>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="text-center space-y-8 max-w-md">
            <h1 className="text-4xl font-light tracking-[0.2em] opacity-90">마음편지</h1>
            <p className="text-sm font-light tracking-widest opacity-60">허정과 로터스, 조용한 서재</p>

            <div className="pt-12 space-y-4">
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                className={`w-full px-4 py-3 text-center tracking-[0.3em] bg-transparent border-b outline-none transition-all duration-300 ${isDarkMode ? 'border-stone-700 focus:border-stone-400' : 'border-stone-300 focus:border-stone-600'}`}
              />
              <button
                onClick={handleUnlock}
                className="text-xs font-light tracking-[0.25em] opacity-50 hover:opacity-100 transition-opacity duration-300 pt-2"
              >
                문 열기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <MainShelf currentUser={currentUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      )}
    </div>
  );
}

function MainShelf({ currentUser, isDarkMode, setIsDarkMode }) {
  const [activeTab, setActiveTab] = useState(currentUser === '허정' ? 'HJ_TO_LT' : 'LT_TO_HJ');
  const [letters, setLetters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLetters();
  }, [activeTab]);

  const fetchLetters = async () => {
    setLoading(true);
    const sender = activeTab === 'HJ_TO_LT' ? '허정' : '로터스';

    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('sender', sender)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLetters(data);
    }
    setLoading(false);
  };

  const filteredLetters = letters.filter(letter => {
    return letter.title.includes(searchQuery) || letter.content.includes(searchQuery);
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-12 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <h2 className="text-2xl font-light tracking-widest">마음편지</h2>
          <p className="text-xs font-light opacity-50 mt-1">느린 시간 속에서 문장을 나눕니다.</p>
        </div>
        <div className="flex items-center space-x-6 text-sm font-light">
          <span className="opacity-85 font-normal text-xs bg-stone-100 dark:bg-stone-900/60 px-3 py-1.5 rounded-full">
            {currentUser}의 서랍 열림
          </span>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="opacity-60 hover:opacity-100 transition-opacity">
            {isDarkMode ? '낮의 서재' : '밤의 서재'}
          </button>
          <button onClick={() => setIsWriting(true)} className="opacity-100 hover:opacity-80 transition-opacity text-pink-600 dark:text-pink-400 font-normal">
            편지 쓰기
          </button>
        </div>
      </header>

      {isWriting ? (
        <WriteScreen currentUser={currentUser} onClose={() => { setIsWriting(false); fetchLetters(); }} />
      ) : selectedLetter ? (
        <ReadScreen letter={selectedLetter} onClose={() => { setSelectedLetter(null); fetchLetters(); }} />
      ) : (
        <>
          <div className="flex justify-center space-x-12 mb-10 text-lg font-light tracking-widest border-b border-stone-100 dark:border-stone-900 pb-4">
            <button
              onClick={() => setActiveTab('HJ_TO_LT')}
              className={`pb-2 transition-all ${activeTab === 'HJ_TO_LT' ? 'border-b border-stone-600 dark:border-stone-400 font-normal' : 'opacity-40 hover:opacity-80'}`}
            >
              허정의 마음
            </button>
            <button
              onClick={() => setActiveTab('LT_TO_HJ')}
              className={`pb-2 transition-all ${activeTab === 'LT_TO_HJ' ? 'border-b border-stone-600 dark:border-stone-400 font-normal' : 'opacity-40 hover:opacity-80'}`}
            >
              로터스의 마음
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 text-sm font-light">
            <input
              type="text"
              placeholder="마음 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 w-full md:w-64 bg-transparent border-b border-stone-200 dark:border-stone-800 outline-none"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm font-light opacity-50">서재를 정돈하고 있습니다...</div>
          ) : filteredLetters.length === 0 ? (
            <div className="text-center py-20 text-sm font-light opacity-40">아직 머무른 흔적이 없습니다. 첫 온기를 나누어 보세요.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredLetters.map((letter) => (
                <div
                  key={letter.id}
                  onClick={() => setSelectedLetter(letter)}
                  className="group p-8 rounded-lg border border-stone-100 dark:border-stone-900 bg-white dark:bg-stone-900/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[180px]"
                >
                  <div>
                    <div className="text-xs opacity-40 mb-3 tracking-widest">
                      {new Date(letter.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-normal tracking-wide group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors mb-2">
                      {letter.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed line-clamp-2 opacity-70">
                      {letter.content}
                    </p>
                  </div>
                  {letter.media_path && (
                    <div className="text-xs opacity-50 mt-4 text-right">
                      {letter.is_video ? '🎥 동영상 첨부됨' : '🖼️ 사진 첨부됨'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function WriteScreen({ currentUser, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 채워주세요.');
      return;
    }

    setUploading(true);
    let mediaPath = null;
    let isVideo = false;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `letters/${fileName}`;
      isVideo = file.type.startsWith('video/');

      const { error: uploadError } = await supabase.storage
        .from('letter-media')
        .upload(filePath, file);

      if (uploadError) {
        alert('미디어 업로드에 실패했습니다: ' + uploadError.message);
        setUploading(false);
        return;
      }
      mediaPath = filePath;
    }

    const { error } = await supabase.from('letters').insert([
      {
        title: title,
        content: content,
        sender: currentUser,
        receiver: currentUser === '허정' ? '로터스' : '허정',
        media_path: mediaPath,
        is_video: isVideo
      }
    ]);

    setUploading(false);

    if (error) {
      alert('편지 전송에 실패했습니다: ' + error.message);
    } else {
      alert('조용한 서재에 편지를 소중히 보관했습니다.');
      onClose();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-light tracking-widest">마음 받아 적기</h3>
        <button onClick={onClose} className="text-sm font-light opacity-50 hover:opacity-100">닫기</button>
      </div>
      <div className="space-y-6">
        <div className="text-xs opacity-50 tracking-widest border-b border-stone-100 dark:border-stone-900 pb-2">
          보내는 이: {currentUser} ➔ 받는 이: {currentUser === '허정' ? '로터스' : '허정'}
        </div>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-lg py-2 bg-transparent border-b border-stone-200 dark:border-stone-800 outline-none"
        />
        <textarea
          placeholder="고요하게 흐르는 마음에 귀 기울여 보세요..."
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full py-2 bg-transparent outline-none resize-none leading-relaxed font-light text-base"
        />

        <div className="border border-dashed border-stone-200 dark:border-stone-800 rounded p-6 text-center">
          <input
            type="file"
            accept="image/*,video/*"
            id="media-upload"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="media-upload" className="cursor-pointer text-xs font-light tracking-wider opacity-60 hover:opacity-100 transition-opacity">
            {file ? `선택된 파일: ${file.name}` : '🖼️ 사진 또는 🎥 동영상 첨부하기 (클릭)'}
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full py-3 bg-stone-800 text-stone-100 dark:bg-stone-200 dark:text-stone-900 rounded tracking-[0.2em] font-light text-sm hover:opacity-95 transition-opacity disabled:opacity-50"
        >
          {uploading ? '서재로 마음을 조심스레 보내는 중...' : '마음 전송하기'}
        </button>
      </div>
    </div>
  );
}

function ReadScreen({ letter, onClose }) {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const mediaUrl = letter.media_path
    ? `${SUPABASE_URL}/storage/v1/object/public/letter-media/${letter.media_path}`
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <button onClick={onClose} className="text-sm font-light opacity-50 hover:opacity-100">목록으로</button>
      <article className="space-y-8">
        <header className="space-y-2">
          <div className="text-xs opacity-40 tracking-widest">보낸 이: {letter.sender} ➔ 받는 이: {letter.receiver}</div>
          <h1 className="text-2xl font-normal tracking-wide">{letter.title}</h1>
        </header>

        {mediaUrl && (
          <div className="rounded-lg overflow-hidden border border-stone-100 dark:border-stone-900 shadow-sm max-h-[450px] flex justify-center items-center bg-black/5">
            {letter.is_video ? (
              <video src={mediaUrl} controls className="w-full max-h-[450px] object-contain" />
            ) : (
              <img src={mediaUrl} alt="편지 첨부 이미지" className="w-full max-h-[450px] object-contain" />
            )}
          </div>
        )}

        <p className="text-base font-light leading-loose whitespace-pre-wrap opacity-90">{letter.content}</p>
      </article>
    </div>
  );
}