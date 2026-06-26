(() => {
  const { lessons, hanziByLesson, sentences, quiz } = window.StudyData;
  const lessonDetails = window.CleanLessonData;
  const worksheetPages = window.WorksheetData.worksheetPages;
  const root = document.getElementById('root');

  const NAV = [
    ['home','홈','H'],
    ['worksheet','학습지','W'],
    ['lesson2','2과','二'],
    ['lesson3','3과','三'],
    ['lesson4','4과','四'],
    ['hanzi','한자','字'],
    ['sentences','문장','文'],
    ['quiz','퀴즈','Q'],
  ];

  let currentView = location.hash.replace('#','') || 'home';
  let currentHanziLesson = 'lesson2';
  let query = '';
  let quizState = { index: 0, score: 0, picked: '', questions: shuffle([...quiz]) };

  function esc(value='') {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function shuffle(arr){ return arr.sort(() => Math.random() - .5); }
  function audioButton(text){
    const safe = String(text).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return `<button class="audio-btn" onclick="speak('${safe}')" aria-label="발음 듣기" title="발음 듣기">▶</button>`;
  }
  function pageHead(kicker,title,desc){
    return `<header class="page-head"><div class="page-kicker">${esc(kicker)}</div><h1 class="page-title">${title}</h1><p class="page-desc">${esc(desc)}</p></header>`;
  }
  function setView(view){
    currentView = view;
    location.hash = view;
    render();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  window.setView = setView;

  function shell(content){
    const nav = NAV.map(([id,label,icon]) => `<button class="nav-item ${currentView===id?'active':''}" onclick="setView('${id}')"><span class="nav-icon">${icon}</span><span>${label}</span></button>`).join('');
    const mobile = NAV.map(([id,label,icon]) => `<button class="${currentView===id?'active':''}" onclick="setView('${id}')"><b>${icon}</b><span>${label}</span></button>`).join('');
    root.innerHTML = `<div class="app-shell"><header class="topbar"><button class="brand" onclick="setView('home')"><span class="brand-mark">中</span><span class="brand-copy"><strong>생활 중국어 기말고사 학습실</strong><small>교과서 2·3·4과 + 학습지 통합 정리</small></span></button><div class="top-status"><span class="status-dot"></span>학습 자료 준비 완료</div></header><div class="layout"><aside class="sidebar">${nav}</aside><main class="content">${content}</main></div><nav class="mobile-nav">${mobile}</nav></div>`;
  }

  function renderHome(){
    const cards = [
      ['worksheet','학습지 전체 정리','중국 개관부터 발음, 단원 정리, 활동지, 한자 쓰기까지','W'],
      ['lesson2','제2과 你好！','인사·감사·사과 표현과 중국 학교생활','二'],
      ['lesson3','제3과 你是哪国人？','이름·국적·인물 묘사와 중국인의 성씨','三'],
      ['lesson4','제4과 她是谁？','가족·나이·학년 표현과 숫자 문화','四'],
      ['hanzi','필수 한자 38개','2·3·4과 한자를 단원별로 반복 학습','字'],
      ['sentences','문장 쓰기 20개','수행평가 문장을 정답·병음·음성으로 연습','文'],
    ];
    shell(`<div class="page"><section class="hero"><div class="hero-copy"><span class="hero-badge">FINAL EXAM STUDY</span><h1>생활 중국어<br><em>기말고사 대비</em></h1><p>교과서 2·3·4과와 학습지 내용을 시험 준비 흐름에 맞춰 다시 구성했습니다. 본문, 어휘, 문법, 문화, 한자, 문장 쓰기를 한 화면에서 복습할 수 있습니다.</p><div class="hero-actions"><button class="btn-primary" onclick="setView('lesson2')">제2과부터 시작</button><button class="btn-secondary" onclick="setView('worksheet')">학습지 전체 보기</button></div></div><aside class="hero-panel"><div class="stat-grid"><div class="stat"><strong>3개</strong><span>시험 단원</span></div><div class="stat"><strong>38개</strong><span>필수 한자</span></div><div class="stat"><strong>20개</strong><span>문장 쓰기</span></div><div class="stat"><strong>16쪽</strong><span>학습지 정리</span></div></div></aside></section><section class="dashboard-grid">${cards.map(([id,t,d,icon])=>`<button class="dashboard-card" onclick="setView('${id}')"><span class="card-index">${icon}</span><h3>${t}</h3><p>${d}</p></button>`).join('')}</section></div>`);
  }

  function renderDialogue(line){
    return `<article class="dialogue"><div class="speaker">${esc(line.speaker)}</div><div><span class="zh">${esc(line.hanzi)}</span><span class="pinyin">${esc(line.pinyin)}</span><span class="meaning">${esc(line.meaning)}</span></div>${audioButton(line.hanzi)}</article>`;
  }
  function renderWord(word){
    const [hanzi,pinyin,meaning] = word;
    return `<article class="word-card">${audioButton(hanzi)}<span class="zh">${esc(hanzi)}</span><span class="pinyin">${esc(pinyin)}</span><span class="meaning">${esc(meaning)}</span></article>`;
  }
  function renderExample(item){
    const [hanzi,pinyin,meaning] = item;
    return `<article class="example"><div><span class="zh">${esc(hanzi)}</span><span class="pinyin">${esc(pinyin)}</span><span class="meaning">${esc(meaning)}</span></div>${audioButton(hanzi)}</article>`;
  }
  function renderLessonSection(section){
    return `<section class="lesson-section"><div class="lesson-section-head"><span class="page-chip">교과서 ${esc(section.page)}</span><h2>${esc(section.title)}</h2></div>${section.words?`<div class="word-grid">${section.words.map(renderWord).join('')}</div>`:''}${section.examples?`<div class="example-list">${section.examples.map(renderExample).join('')}</div>`:''}${section.bullets?`<ul class="bullet-list">${section.bullets.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</section>`;
  }
  function renderLesson(key){
    const base = lessons[key];
    const detail = lessonDetails[key];
    const titleMap = {
      lesson2:'제2과 你好！ — 인사와 예절 표현',
      lesson3:'제3과 你是哪国人？ — 이름과 국적',
      lesson4:'제4과 她是谁？ — 가족과 학교생활',
    };
    shell(`<div class="page">${pageHead('TEXTBOOK REVIEW',titleMap[key],detail.subtitle)}<section class="section-card"><div class="section-head"><div><div class="meta">본문 1</div><h2>${esc(base.body1Title.replace(/^본문 1 — /,''))}</h2></div></div><div class="dialogue-list">${base.body1.map(renderDialogue).join('')}</div></section><section class="section-card"><div class="section-head"><div><div class="meta">본문 2</div><h2>${esc(base.body2Title.replace(/^본문 2 — /,''))}</h2></div></div><div class="dialogue-list">${base.body2.map(renderDialogue).join('')}</div></section><div class="lesson-sections">${detail.sections.map(renderLessonSection).join('')}</div></div>`);
  }

  function cleanLines(text){
    return String(text).split(/\r?\n/).map(x=>x.trim()).filter(Boolean).filter(x=>!/^\d+\s*제\d과$/.test(x));
  }
  function renderWorksheet(){
    const groups = [
      ['1~4쪽','기초 준비와 발음',[1,2,3,4]],
      ['5~6쪽','제2과 정리',[5,6]],
      ['7~11쪽','제3과 정리',[7,8,9,10,11]],
      ['12~13쪽','제4과 정리',[12,13]],
      ['14~16쪽','기말고사 쓰기 범위',[14,15,16]],
    ];
    const filtered = worksheetPages.filter(p => !query || (p.title+' '+p.text).toLowerCase().includes(query.toLowerCase()));
    const html = groups.map(([,title,pages]) => {
      const rows = filtered.filter(p=>pages.includes(p.page));
      if(!rows.length) return '';
      return `<section class="sheet-group"><h2>${title}</h2>${rows.map(p=>`<article class="sheet-page"><div class="sheet-page-head"><span>${p.page}쪽</span><h3>${esc(p.title)}</h3></div><div class="sheet-lines">${cleanLines(p.text).map(line=>`<p>${esc(line)}</p>`).join('')}</div></article>`).join('')}</section>`;
    }).join('');
    shell(`<div class="page">${pageHead('WORKSHEET','기말고사 학습지 전체 정리','학습지 1~16쪽을 주제별로 묶고, 답안란·개인정보·불필요한 반복 표시는 제외했습니다.')}<section class="section-card"><div class="search"><span>⌕</span><input value="${esc(query)}" placeholder="단어·문장 검색" oninput="setWorksheetQuery(this.value)"></div><div class="worksheet-groups">${html || '<p>검색 결과가 없습니다.</p>'}</div></section></div>`);
  }
  window.setWorksheetQuery = value => { query=value; renderWorksheet(); };

  function renderHanzi(){
    const meta = {lesson2:['제2과',11],lesson3:['제3과',15],lesson4:['제4과',12]};
    const tabs = Object.entries(meta).map(([key,[label,count]])=>`<button class="tab ${currentHanziLesson===key?'active':''}" onclick="setHanziLesson('${key}')">${label} · ${count}개</button>`).join('');
    const cards = hanziByLesson[currentHanziLesson].map(item=>`<article class="hanzi-card">${audioButton(item.hanzi)}<div class="hanzi-char">${esc(item.hanzi)}</div><div class="hanzi-meta"><div><span>PINYIN</span><b>${esc(item.pinyin)}</b></div><div><span>MEANING</span><p>${esc(item.meaning)}</p></div></div></article>`).join('');
    shell(`<div class="page">${pageHead('HANZI REVIEW','기말고사 필수 한자 38개','학습지 한자 쓰기 범위를 2·3·4과로 나누어 한자, 한어병음, 뜻과 음성으로 정리했습니다.')}<section class="section-card"><div class="tabs">${tabs}</div><div class="hanzi-grid">${cards}</div></section></div>`);
  }
  window.setHanziLesson = key => { currentHanziLesson=key; renderHanzi(); };

  function renderSentences(){
    const rows = sentences.map((item,i)=>`<article class="sentence-row"><div class="sentence-no">${String(i+1).padStart(2,'0')}</div><div><div class="sentence-prompt">${esc(item.meaning)}</div><div class="answer-box" id="answer-${i}" hidden><span class="zh">${esc(item.hanzi)}</span><span class="pinyin">${esc(item.pinyin)}</span></div></div><div class="sentence-actions">${audioButton(item.hanzi)}<button class="small-btn" onclick="toggleAnswer(${i},this)">정답 보기</button></div></article>`).join('');
    shell(`<div class="page">${pageHead('WRITING PRACTICE','수행평가 문장 쓰기 20','한국어 문장을 보고 직접 쓴 뒤 중국어 문장과 한어병음을 확인하고 발음을 들어보세요.')}<section class="section-card"><div class="sentence-list">${rows}</div></section></div>`);
  }
  window.toggleAnswer = (i,button) => {
    const el=document.getElementById(`answer-${i}`);
    el.hidden=!el.hidden;
    button.textContent=el.hidden?'정답 보기':'정답 가리기';
  };

  function renderQuiz(){
    const state = quizState;
    if(state.index >= state.questions.length){
      shell(`<div class="page">${pageHead('FINAL CHECK','기말고사 최종 점검','퀴즈 결과를 확인하고 부족한 단원을 다시 복습하세요.')}<section class="result"><div class="page-kicker">QUIZ COMPLETE</div><h1>${state.score*10}점</h1><p>${state.score>=7?'좋습니다. 시험 범위의 핵심 표현을 잘 이해했습니다.':'틀린 문항이 나온 단원과 학습지 내용을 다시 확인해 보세요.'}</p><button class="btn-primary" onclick="resetQuiz()">다시 풀기</button></section></div>`);
      return;
    }
    const q = state.questions[state.index];
    const opts = q[1].map(option=>{
      let cls='option';
      if(state.picked){ if(option===q[2]) cls+=' correct'; else if(option===state.picked) cls+=' wrong'; }
      return `<button class="${cls}" onclick="pickQuiz('${String(option).replace(/'/g,"\\'")}')"><span>${esc(option)}</span><span>${state.picked&&option===q[2]?'✓':''}</span></button>`;
    }).join('');
    shell(`<div class="page quiz-wrap">${pageHead('FINAL CHECK','기말고사 최종 점검',`${state.index+1} / ${state.questions.length}문제`)}<section class="quiz-card"><h2>${esc(q[0])}</h2>${opts}${state.picked?`<button class="btn-primary" style="margin-top:18px" onclick="nextQuiz()">다음 문제</button>`:''}</section></div>`);
  }
  window.pickQuiz = value => {
    if(quizState.picked) return;
    quizState.picked=value;
    if(value===quizState.questions[quizState.index][2]) quizState.score++;
    renderQuiz();
  };
  window.nextQuiz = () => { quizState.index++; quizState.picked=''; renderQuiz(); };
  window.resetQuiz = () => { quizState={index:0,score:0,picked:'',questions:shuffle([...quiz])}; renderQuiz(); };

  function render(){
    if(currentView==='home') renderHome();
    else if(currentView==='worksheet') renderWorksheet();
    else if(['lesson2','lesson3','lesson4'].includes(currentView)) renderLesson(currentView);
    else if(currentView==='hanzi') renderHanzi();
    else if(currentView==='sentences') renderSentences();
    else if(currentView==='quiz') renderQuiz();
    else { currentView='home'; renderHome(); }
  }

  window.addEventListener('hashchange',()=>{
    const next=location.hash.replace('#','')||'home';
    if(NAV.some(([id])=>id===next)){ currentView=next; render(); }
  });
  render();
})();
