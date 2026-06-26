const { lessons, hanziByLesson, sentences, quiz } = StudyData;
const textbookPages = TextbookData.textbookPages;
const worksheetPages = WorksheetData.worksheetPages;

const app = document.getElementById('app');
const nav = document.getElementById('nav');
const views = [
  ['home','홈','⌂'],['worksheet','학습지','▤'],['lesson2','2과','二'],['lesson3','3과','三'],
  ['lesson4','4과','四'],['hanzi','한자','字'],['sentences','문장','文'],['quiz','퀴즈','✓']
];
let currentView='home';
let currentHanziLesson='lesson2';
let tts=null, ttsLoading=null;

function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function normalizeSource(s=''){const map={'å':'ī','ã':'ā','â':'ǎ','ç':'ē','ê':'ě','î':'ǐ','õ':'ō','ô':'ǒ','ñ':'ū','û':'ǔ'};return String(s).replace(/[åãâçêîõôñû]/g,c=>map[c]).replace(/([A-Za-zÀ-ž])8([A-Za-zÀ-ž])/g,"$1'$2").replace(/°/g,'。');}
function title(tag,t,sub){return `<div class="title"><span>${esc(tag)}</span><h1>${esc(t)}</h1><p>${esc(sub)}</p></div>`;}
function renderNav(){nav.innerHTML=views.map(([id,label,icon])=>`<button class="${currentView===id?'on':''}" onclick="setView('${id}')"><b>${icon}</b>${label}</button>`).join('');}
function setView(v){currentView=v;location.hash=v;renderNav();render();ensureTts();scrollTo({top:0,behavior:'smooth'});}
window.setView=setView;

async function ensureTts(){
  if(tts) return tts;
  if(ttsLoading) return ttsLoading;
  ttsLoading=(async()=>{
    try{
      const mod=await import('https://cdn.jsdelivr.net/npm/mespeak@2.0.2/+esm');
      const engine=mod.default||mod;
      const [config,voice]=await Promise.all([
        fetch('https://cdn.jsdelivr.net/npm/mespeak@2.0.2/src/mespeak_config.json').then(r=>{if(!r.ok)throw Error('config');return r.json()}),
        fetch('https://cdn.jsdelivr.net/npm/mespeak@2.0.2/voices/zh.json').then(r=>{if(!r.ok)throw Error('voice');return r.json()})
      ]);
      engine.loadConfig(config); engine.loadVoice(voice); tts=engine; return engine;
    }catch(e){console.warn('meSpeak load failed; using browser fallback',e);return null;}
  })();
  return ttsLoading;
}
async function speak(text){
  const btn=document.activeElement; if(btn?.classList?.contains('audio-button')){btn.classList.add('playing');}
  try{
    const engine=await ensureTts();
    if(engine){engine.resetQueue();engine.speak(text,{voice:'zh',speed:145,pitch:48,amplitude:100,wordgap:1});return;}
    if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.78;speechSynthesis.speak(u);return;}
    alert('이 기기에서 음성을 재생할 수 없습니다.');
  }finally{setTimeout(()=>btn?.classList?.remove('playing'),700);}
}
window.speak=speak;
function audioButton(text){return `<button class="audio-button" onclick="speak('${String(text).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')" title="중국어 발음 듣기" aria-label="중국어 발음 듣기">🔊</button>`;}
function studyCard(item,compact=false){return `<article class="study-card ${compact?'compact':''}">${audioButton(item.hanzi)}<strong>${esc(item.hanzi)}</strong><div class="study-fields"><div><span>한어병음</span><b>${esc(item.pinyin)}</b></div><div><span>뜻</span><p>${esc(item.meaning)}</p></div></div></article>`;}
function dialogue(line){return `<article><div class="speaker">${esc(line.speaker)}</div><div class="dialogue-text"><strong>${esc(line.hanzi)}</strong><b>${esc(line.pinyin)}</b><p>${esc(line.meaning)}</p></div>${audioButton(line.hanzi)}</article>`;}
function sourceDetails(p,label){return `<details><summary><b>${label} ${p.page}쪽</b><span>${esc(p.title)}</span></summary><pre>${esc(normalizeSource(p.text))}</pre></details>`;}

function renderHome(){
  const cards=[
    ['worksheet','학습지 16쪽 전체','중국 개관·발음·단원정리·활동·한자·종작','▤'],
    ['lesson2','교과서 2과 전체','26~37쪽의 작은 글씨와 문화·활동까지','二'],
    ['lesson3','교과서 3과 전체','38~47쪽의 본문·표현·활동·문화','三'],
    ['lesson4','교과서 4과 전체','48~57쪽의 본문·숫자·가족·문화','四'],
    ['hanzi','시험 한자 38개','단원별 뜻·한어병음·음성','字'],
    ['sentences','종작 20문장','정답·성조·음성 반복 연습','文']
  ];
  app.innerHTML=`<section class="hero"><div><span class="pill">교과서·학습지 전체 수록</span><h1>요약본이 아니라<br><em>시험 범위 전체.</em></h1><p>교과서 2~4과 26~57쪽과 학습지 16쪽을 페이지별로 정리했습니다. 본문 아래의 작은 어휘, 표현 쏙쏙, 문화 통통, 활동, 확인 문제까지 모두 확인할 수 있습니다.</p><button class="primary" onclick="setView('worksheet')">학습지 전체 보기 →</button></div><aside><b>全</b><strong>전체 범위</strong><span>교과서 32쪽 · 학습지 16쪽</span></aside></section><section class="cards">${cards.map(([id,t,d,icon])=>`<button onclick="setView('${id}')"><i>${icon}</i><span>FINAL EXAM</span><h2>${t}</h2><p>${d}</p></button>`).join('')}</section>`;
}
function renderWorksheet(){
  app.innerHTML=`<section class="page">${title('보내주신 학습지 원문','학습지 1~16쪽 전체 정리','인쇄된 설명과 작은 글씨까지 페이지 순서대로 옮겼습니다. 학생 개인정보와 손글씨 답안은 제외하고, 학습 내용은 빠짐없이 정리했습니다.')}<div class="searchbox">⌕<input id="worksheetSearch" placeholder="학습지에서 단어·문장 검색" oninput="filterWorksheet(this.value)"></div><div id="worksheetPages" class="source-pages">${worksheetPages.map(p=>sourceDetails(p,'학습지')).join('')}</div></section>`;
}
function filterWorksheet(q){const x=q.toLowerCase();document.getElementById('worksheetPages').innerHTML=worksheetPages.filter(p=>(p.title+'\n'+p.text).toLowerCase().includes(x)).map(p=>sourceDetails(p,'학습지')).join('')||'<p>검색 결과가 없습니다.</p>';}
window.filterWorksheet=filterWorksheet;
function renderLesson(key){
  const data=lessons[key]; const range=key==='lesson2'?[26,37]:key==='lesson3'?[38,47]:[48,57];
  const pages=textbookPages.filter(p=>p.page>=range[0]&&p.page<=range[1]);
  app.innerHTML=`<section class="page">${title('교과서 전체 범위',data.title,`${data.subtitle} · 교과서 ${range[0]}~${range[1]}쪽 전체`)}<section class="dialogue-block"><div class="section-heading"><span>TEXTBOOK</span><h2>${data.body1Title}</h2></div><div class="dialogue-list">${data.body1.map(dialogue).join('')}</div></section><section class="dialogue-block"><div class="section-heading"><span>TEXTBOOK</span><h2>${data.body2Title}</h2></div><div class="dialogue-list">${data.body2.map(dialogue).join('')}</div></section><section class="lesson-section"><div class="section-heading"><span>표현 다지기</span><h2>핵심 표현</h2></div><div class="expression-grid">${data.keyExpressions.map(x=>studyCard(x,true)).join('')}</div></section><div class="panel"><h2>문법·발음 포인트</h2><ol>${data.rules.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><section class="full-source"><div class="section-heading"><span>PAGE BY PAGE</span><h2>작은 글씨까지 포함한 페이지별 전체 내용</h2></div><p class="source-note">각 페이지의 본문, 옆쪽 어휘, 표현 쏙쏙, 문화 통통, 활동, 확인 문제, 과제 문구를 함께 수록했습니다.</p><div class="source-pages">${pages.map(p=>sourceDetails(p,'교과서')).join('')}</div></section></section>`;
}
function renderHanzi(){const meta={lesson2:['2과',11],lesson3:['3과',15],lesson4:['4과',12]};app.innerHTML=`<section class="page">${title('학습지 한자 쓰기 원문','시험 한자 38개','학습지 6·11·14·15쪽의 내용을 합쳐 단원별로 나눴습니다. 모든 카드에 한자, 한어병음, 뜻, 음성이 있습니다.')}<div class="lesson-tabs">${Object.keys(meta).map(k=>`<button class="${currentHanziLesson===k?'active':''}" onclick="currentHanziLesson='${k}';renderHanzi()"><strong>${meta[k][0]}</strong><span>${meta[k][1]}개</span></button>`).join('')}</div><div class="hanzi-grid-large">${hanziByLesson[currentHanziLesson].map(x=>studyCard(x)).join('')}</div></section>`;}
window.renderHanzi=renderHanzi;
function renderSentences(){app.innerHTML=`<section class="page">${title('학습지 16쪽 원문','기말 대비 종작 20문장','한국어 문제, 정확한 한어병음, 성조, 음성을 모두 넣었습니다.')}<div class="sentence-list">${sentences.map((s,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(s.meaning)}</h3><div id="ans${i}" hidden><strong>${esc(s.hanzi)}</strong><b>${esc(s.pinyin)}</b></div></div><div class="sentence-actions">${audioButton(s.hanzi)}<button onclick="toggleAnswer(${i},this)">정답</button></div></article>`).join('')}</div></section>`;}
function toggleAnswer(i,b){const el=document.getElementById('ans'+i);el.hidden=!el.hidden;b.textContent=el.hidden?'정답':'가리기';}
window.toggleAnswer=toggleAnswer;
let quizIndex=0,quizScore=0,quizPicked=false,quizQuestions=[];
function startQuiz(){quizIndex=0;quizScore=0;quizPicked=false;quizQuestions=[...quiz].sort(()=>Math.random()-.5);renderQuiz();}
function renderQuiz(){if(!quizQuestions.length)quizQuestions=[...quiz].sort(()=>Math.random()-.5);if(quizIndex>=quizQuestions.length){app.innerHTML=`<section class="result"><span>QUIZ COMPLETE</span><h1>${quizScore*10}점</h1><p>${quizScore>=7?'좋습니다. 시험 준비가 잘 되어 있습니다.':'틀린 단원을 페이지 전체 내용에서 다시 확인하세요.'}</p><button class="primary" onclick="startQuiz()">다시 시작</button></section>`;return}const q=quizQuestions[quizIndex];app.innerHTML=`<section class="quiz page">${title('실전 퀴즈','최종 점검',`${quizIndex+1} / ${quizQuestions.length} 문제`)}<div class="quiz-box"><h2>${esc(q[0])}</h2>${q[1].map(o=>`<button onclick="answerQuiz(this,'${String(o).replace(/'/g,"\\'")}')">${esc(o)}<span></span></button>`).join('')}<button id="quizNext" class="primary next" hidden onclick="quizIndex++;quizPicked=false;renderQuiz()">다음 →</button></div></section>`;}
function answerQuiz(btn,val){if(quizPicked)return;quizPicked=true;const right=quizQuestions[quizIndex][2];if(val===right){quizScore++;btn.classList.add('correct')}else btn.classList.add('wrong');[...document.querySelectorAll('.quiz-box>button:not(.next)')].forEach(b=>{if(b.textContent.trim()===right)b.classList.add('correct')});document.getElementById('quizNext').hidden=false;}
window.startQuiz=startQuiz;window.answerQuiz=answerQuiz;
function render(){if(currentView==='home')renderHome();else if(currentView==='worksheet')renderWorksheet();else if(currentView.startsWith('lesson'))renderLesson(currentView);else if(currentView==='hanzi')renderHanzi();else if(currentView==='sentences')renderSentences();else if(currentView==='quiz')renderQuiz();}
const hash=location.hash.slice(1);if(views.some(v=>v[0]===hash))currentView=hash;renderNav();render();ensureTts();