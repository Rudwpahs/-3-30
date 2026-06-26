import { useMemo, useState } from "react";
import { Howl } from "howler";
import {
  BookOpen,
  Check,
  ChevronRight,
  GraduationCap,
  Headphones,
  Home,
  Languages,
  ListChecks,
  RotateCcw,
  ScrollText,
  Trophy,
  Volume2,
} from "lucide-react";
import {
  hanziByLesson,
  lessons,
  quiz,
  sentences,
  type DialogueLine,
  type HanziItem,
  type Lesson,
} from "./data";

type View = "home" | "pronunciation" | "lesson2" | "lesson3" | "lesson4" | "hanzi" | "sentences" | "quiz";
type LessonKey = "lesson2" | "lesson3" | "lesson4";

let currentAudio: Howl | null = null;

function playChinese(text: string) {
  currentAudio?.stop();
  const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
  currentAudio = new Howl({
    src: [audioUrl],
    html5: true,
    format: ["mp3"],
    volume: 1,
  });
  currentAudio.play();
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const nav = [
    ["home", "홈", Home],
    ["pronunciation", "발음", Headphones],
    ["lesson2", "2과", BookOpen],
    ["lesson3", "3과", Languages],
    ["lesson4", "4과", GraduationCap],
    ["hanzi", "한자", ScrollText],
    ["sentences", "문장", ListChecks],
    ["quiz", "퀴즈", Trophy],
  ] as [View, string, typeof Home][];

  return (
    <div className="app">
      <header>
        <button className="brand" onClick={() => setView("home")}>
          <b>中</b>
          <span><strong>생활 중국어</strong><small>기말고사 완전 정복</small></span>
        </button>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button className={view === id ? "on" : ""} key={id} onClick={() => setView(id)}>
              <Icon size={16} />{label}
            </button>
          ))}
        </nav>
      </header>
      <main>
        {view === "home" && <HomePage go={setView} />}
        {view === "pronunciation" && <Pronunciation />}
        {view.startsWith("lesson") && <LessonPage data={lessons[view as LessonKey]} />}
        {view === "hanzi" && <HanziPage />}
        {view === "sentences" && <SentencesPage />}
        {view === "quiz" && <QuizPage />}
      </main>
    </div>
  );
}

function Title({ tag, title, sub }: { tag: string; title: string; sub: string }) {
  return <div className="title"><span>{tag}</span><h1>{title}</h1><p>{sub}</p></div>;
}

function HomePage({ go }: { go: (view: View) => void }) {
  const cards: [View, string, string, typeof Home][] = [
    ["pronunciation", "발음 핵심 규칙", "성조, 성모·운모, 표기 규칙", Headphones],
    ["lesson2", "2과 본문", "인사 · 감사 · 사과", BookOpen],
    ["lesson3", "3과 본문", "이름 · 국적 · 인물 묘사", Languages],
    ["lesson4", "4과 본문", "가족 · 나이 · 학년", GraduationCap],
    ["hanzi", "단원별 한자 38개", "뜻 · 한어병음 · 음성", ScrollText],
    ["sentences", "문장 쓰기 20개", "기말 대비 종작 연습", ListChecks],
  ];
  return <>
    <section className="hero">
      <div>
        <span className="pill">학습지·교과서 맞춤형</span>
        <h1>본문은 본문대로,<br /><em>한자는 빠짐없이.</em></h1>
        <p>교과서 2~4과의 본문 1·2를 대화 순서 그대로 정리하고, 학습지의 시험 한자 38개를 단원별로 나눴습니다.</p>
        <button className="primary" onClick={() => go("lesson2")}>2과 본문 시작 <ChevronRight size={18} /></button>
      </div>
      <aside><b>期末</b><strong>기말 대비</strong><span>본문 · 한자 · 음성 · 퀴즈</span></aside>
    </section>
    <section className="cards">
      {cards.map(([id, title, desc, Icon]) => (
        <button key={id} onClick={() => go(id)}>
          <Icon /><span>STUDY</span><h2>{title}</h2><p>{desc}</p>
        </button>
      ))}
    </section>
  </>;
}

function Pronunciation() {
  return <section className="page">
    <Title tag="1과 발음 보충" title="발음 핵심 규칙" sub="학습지 형성평가에 나온 성조·성모·운모와 표기 규칙입니다." />
    <div className="tones">
      {[["제1성", "ā", "높고 평평하게"], ["제2성", "á", "중간에서 위로"], ["제3성", "ǎ", "낮췄다가 올리기"], ["제4성", "à", "높은 데서 내리기"]].map(([name, mark, desc]) => (
        <article key={name}><strong>{mark}</strong><h3>{name}</h3><p>{desc}</p></article>
      ))}
    </div>
    <div className="panel"><h2>성모 21개</h2><div className="chips">{"b p m f d t n l g k h j q x zh ch sh r z c s".split(" ").map(x => <span key={x}>{x}</span>)}</div></div>
    <div className="rules">
      <article><h3>j·q·x 뒤의 ü</h3><p>점 두 개를 생략하여 ju, que, xun처럼 씁니다.</p></article>
      <article><h3>성모가 없는 i·u·ü</h3><p>i는 y, u는 w, ü는 yu로 표기합니다.</p></article>
      <article><h3>iou·uei·uen</h3><p>성모가 붙으면 가운데 모음을 생략해 liu, dui, kun으로 씁니다.</p></article>
      <article><h3>성조 기호 위치</h3><p>a가 우선이며, 없으면 o/e에 붙입니다. iu·ui는 뒤 글자에 붙입니다.</p></article>
    </div>
  </section>;
}

function LessonPage({ data }: { data: Lesson }) {
  return <section className="page">
    <Title tag="교과서 본문" title={data.title} sub={data.subtitle} />
    <DialogueBlock title={data.body1Title} lines={data.body1} />
    <DialogueBlock title={data.body2Title} lines={data.body2} />
    <section className="lesson-section">
      <div className="section-heading"><span>표현 다지기</span><h2>함께 알아둘 표현</h2></div>
      <div className="expression-grid">
        {data.keyExpressions.map(item => <StudyCard key={item.hanzi} item={item} compact />)}
      </div>
    </section>
    <div className="panel"><h2>본문 문법·발음 포인트</h2><ol>{data.rules.map(rule => <li key={rule}>{rule}</li>)}</ol></div>
  </section>;
}

function DialogueBlock({ title, lines }: { title: string; lines: DialogueLine[] }) {
  return <section className="dialogue-block">
    <div className="section-heading"><span>TEXTBOOK</span><h2>{title}</h2></div>
    <div className="dialogue-list">
      {lines.map((line, index) => (
        <article key={`${line.hanzi}-${index}`}>
          <div className="speaker">{line.speaker}</div>
          <div className="dialogue-text">
            <strong>{line.hanzi}</strong>
            <b>{line.pinyin}</b>
            <p>{line.meaning}</p>
          </div>
          <button className="audio-button" onClick={() => playChinese(line.hanzi)} aria-label={`${line.hanzi} 발음 듣기`}>
            <Volume2 size={22} />
          </button>
        </article>
      ))}
    </div>
  </section>;
}

function HanziPage() {
  const [lesson, setLesson] = useState<LessonKey>("lesson2");
  const lessonMeta: Record<LessonKey, { label: string; count: number }> = {
    lesson2: { label: "2과", count: 11 },
    lesson3: { label: "3과", count: 15 },
    lesson4: { label: "4과", count: 12 },
  };
  return <section className="page">
    <Title tag="학습지 한자 암기" title="단원별 시험 한자 38개" sub="학습지에 정리된 순서와 내용을 그대로 반영했습니다. 각 카드에서 뜻·한어병음·음성을 모두 확인할 수 있습니다." />
    <div className="lesson-tabs">
      {(Object.keys(lessonMeta) as LessonKey[]).map(key => (
        <button key={key} className={lesson === key ? "active" : ""} onClick={() => setLesson(key)}>
          <strong>{lessonMeta[key].label}</strong><span>{lessonMeta[key].count}개</span>
        </button>
      ))}
    </div>
    <div className="hanzi-summary"><b>{lessonMeta[lesson].label}</b><span>시험 한자 {lessonMeta[lesson].count}개</span></div>
    <div className="hanzi-grid-large">
      {hanziByLesson[lesson].map(item => <StudyCard key={item.hanzi} item={item} />)}
    </div>
  </section>;
}

function StudyCard({ item, compact = false }: { item: HanziItem; compact?: boolean }) {
  return <article className={compact ? "study-card compact" : "study-card"}>
    <button className="audio-button" onClick={() => playChinese(item.hanzi)} aria-label={`${item.hanzi} 발음 듣기`}><Volume2 size={22} /></button>
    <strong>{item.hanzi}</strong>
    <div className="study-fields">
      <div><span>한어병음</span><b>{item.pinyin}</b></div>
      <div><span>뜻</span><p>{item.meaning}</p></div>
    </div>
  </article>;
}

function SentencesPage() {
  const [open, setOpen] = useState<number[]>([]);
  return <section className="page">
    <Title tag="기말 대비 종작 연습" title="문장 쓰기 20개" sub="한국어만 보고 먼저 쓴 뒤 정답과 음성을 확인하세요." />
    <div className="sentence-list">
      {sentences.map((item, index) => {
        const isOpen = open.includes(index);
        return <article key={item.hanzi}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><h3>{item.meaning}</h3>{isOpen && <><strong>{item.hanzi}</strong><b>{item.pinyin}</b></>}</div>
          <div className="sentence-actions">
            {isOpen && <button className="icon-only" onClick={() => playChinese(item.hanzi)}><Volume2 size={19} /></button>}
            <button onClick={() => setOpen(isOpen ? open.filter(x => x !== index) : [...open, index])}>{isOpen ? "가리기" : "정답"}</button>
          </div>
        </article>;
      })}
    </div>
  </section>;
}

function QuizPage() {
  const questions = useMemo(() => [...quiz].sort(() => Math.random() - 0.5), []);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState("");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  if (done) return <section className="result"><Trophy size={54} /><span>QUIZ COMPLETE</span><h1>{score * 10}점</h1><p>{score >= 7 ? "좋습니다. 시험 준비가 잘 되어 있습니다." : "틀린 단원을 한 번 더 복습해 보세요."}</p><button className="primary" onClick={() => window.location.reload()}><RotateCcw size={17} /> 다시 시작</button></section>;
  const question = questions[index];
  return <section className="quiz page">
    <Title tag="실전 퀴즈" title="최종 점검" sub={`${index + 1} / ${questions.length} 문제`} />
    <div className="quiz-box">
      <h2>{question[0]}</h2>
      {question[1].map(option => (
        <button key={option} className={picked ? (option === question[2] ? "correct" : option === picked ? "wrong" : "") : ""} onClick={() => { if (!picked) { setPicked(option); if (option === question[2]) setScore(score + 1); } }}>
          {option}{picked && option === question[2] && <Check size={18} />}
        </button>
      ))}
      {picked && <button className="primary next" onClick={() => { if (index === questions.length - 1) setDone(true); else { setIndex(index + 1); setPicked(""); } }}>다음 <ChevronRight size={17} /></button>}
    </div>
  </section>;
}
