(() => {
  document.title = '생활 중국어 2·3·4과 기말고사 대비';
  const brandNote = document.querySelector('.brand small');
  if (brandNote) brandNote.textContent = '2·3·4과 기말고사 대비';

  const baseNormalize = normalizeSource;

  function cleanStudyText(text) {
    let value = baseNormalize(text)
      .replace(/\b0\d{2}\b/g, '')
      .replace(/\^/g, '!')
      .replace(/\bwô\b/gi, 'wǒ')
      .replace(/\byôu\b/gi, 'yǒu')
      .replace(/\bshñbāo\b/gi, 'shūbāo')
      .replace(/\bshôujī\b/gi, 'shǒujī')
      .replace(/\bchñzhōng\b/gi, 'chūzhōng')
      .replace(/\bchñ\s+yī\b/gi, 'chū yī');

    const cleaned = [];
    let previousBlank = false;

    for (const rawLine of value.split(/\r?\n/)) {
      const line = rawLine.replace(/[ \t]+$/g, '');
      const trimmed = line.trim();

      if (!trimmed) {
        if (!previousBlank) cleaned.push('');
        previousBlank = true;
        continue;
      }
      previousBlank = false;

      if (/^(그림 한자|한어병음|뜻)$/.test(trimmed)) continue;
      if (/^\d{1,3}\s*(제[234]과|융합 수업.*)$/.test(trimmed)) continue;
      if (/^(Nǐ hǎo|Nǐ shì nǎ guó rén|Tā shì shéi)\D*\d{1,3}$/.test(trimmed)) continue;

      const allowed = [...trimmed].filter(ch => /[\p{Script=Hangul}\p{Script=Han}\p{Script=Latin}\d\s.,!?;:()'"·~%+\-=/°①-⑩❶-❾]/u.test(ch)).length;
      const readableRatio = allowed / Math.max([...trimmed].length, 1);
      if (trimmed.length >= 4 && readableRatio < 0.62) continue;
      if (/[␀⃬ᶏᢵᴸὌԨⳠᣛᾭᇍ᪴]/u.test(trimmed) && readableRatio < 0.85) continue;

      cleaned.push(line);
    }

    return cleaned.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  sourceDetails = function sourceDetailsClean(p, label) {
    return `<details><summary><b>${label} ${p.page}쪽</b><span>${esc(p.title)}</span></summary><pre>${esc(cleanStudyText(p.text))}</pre></details>`;
  };

  renderHome = function renderHomeClean() {
    const cards = [
      ['worksheet','학습지 전체 정리','중국 개관·발음·단원 정리·활동·한자·문장 쓰기','▤'],
      ['lesson2','제2과 你好！','인사·감사·사과와 관련 문화','二'],
      ['lesson3','제3과 你是哪国人？','이름·국적·인물 묘사와 관련 문화','三'],
      ['lesson4','제4과 她是谁？','가족·나이·학년·숫자와 관련 문화','四'],
      ['hanzi','기말고사 필수 한자','2·3·4과 총 38개: 뜻·병음·음성','字'],
      ['sentences','기말고사 문장 쓰기','학습지 수행평가 20문장','文']
    ];
    app.innerHTML = `<section class="hero"><div><span class="pill">교과서·학습지 통합 정리</span><h1>생활 중국어<br><em>기말고사 대비 완전 정리</em></h1><p>교과서 2·3·4과와 기말고사 학습지의 시험 관련 내용을 단원별로 정리했습니다. 본문, 핵심 어휘, 문법, 활동, 문화, 한자와 문장 쓰기를 한곳에서 학습할 수 있습니다.</p><button class="primary" onclick="setView('lesson2')">제2과부터 학습하기 →</button></div><aside><b>期末</b><strong>기말고사 대비</strong><span>교과서 2·3·4과 · 학습지</span></aside></section><section class="cards">${cards.map(([id,t,d,icon])=>`<button onclick="setView('${id}')"><i>${icon}</i><span>FINAL EXAM</span><h2>${t}</h2><p>${d}</p></button>`).join('')}</section>`;
  };

  renderWorksheet = function renderWorksheetClean() {
    app.innerHTML = `<section class="page">${title('기말고사 학습지','학습지 전체 내용 정리','중국 개관, 발음, 단원 정리, 활동지, 한자 쓰기와 종작 연습을 페이지 순서대로 정리했습니다. 개인정보·손글씨·빈 답안란과 판독 불가능한 스캔 문자는 제외했습니다.')}<div class="searchbox">⌕<input id="worksheetSearch" placeholder="학습지에서 단어·문장 검색" oninput="filterWorksheet(this.value)"></div><div id="worksheetPages" class="source-pages">${worksheetPages.map(p=>sourceDetails(p,'학습지')).join('')}</div></section>`;
  };

  renderLesson = function renderLessonClean(key) {
    const data = lessons[key];
    const meta = {
      lesson2: { no: '제2과', range: [26,37], title: '你好！', desc: '인사·감사·사과' },
      lesson3: { no: '제3과', range: [38,47], title: '你是哪国人？', desc: '이름·국적·인물 묘사' },
      lesson4: { no: '제4과', range: [48,57], title: '她是谁？', desc: '가족·나이·학년·숫자' }
    }[key];
    const pages = textbookPages.filter(p => p.page >= meta.range[0] && p.page <= meta.range[1]);
    app.innerHTML = `<section class="page">${title(`${meta.no} 교과서 정리`,`${meta.no} ${meta.title}`,`${meta.desc} · 교과서 ${meta.range[0]}~${meta.range[1]}쪽`)}<section class="dialogue-block"><div class="section-heading"><span>본문 1</span><h2>${data.body1Title.replace(/^본문 1 — /,'')}</h2></div><div class="dialogue-list">${data.body1.map(dialogue).join('')}</div></section><section class="dialogue-block"><div class="section-heading"><span>본문 2</span><h2>${data.body2Title.replace(/^본문 2 — /,'')}</h2></div><div class="dialogue-list">${data.body2.map(dialogue).join('')}</div></section><section class="lesson-section"><div class="section-heading"><span>핵심 어휘</span><h2>함께 외울 표현</h2></div><div class="expression-grid">${data.keyExpressions.map(x=>studyCard(x,true)).join('')}</div></section><div class="panel"><h2>문법·발음 핵심</h2><ol>${data.rules.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><section class="full-source"><div class="section-heading"><span>교과서 세부 내용</span><h2>페이지별 시험 범위</h2></div><p class="source-note">본문 옆 어휘, 표현 설명, 활동, 확인 문제와 문화 내용 중 학습에 필요한 문장을 정리했습니다.</p><div class="source-pages">${pages.map(p=>sourceDetails(p,'교과서')).join('')}</div></section></section>`;
  };

  const oldRenderHanzi = renderHanzi;
  renderHanzi = function renderHanziClean() {
    oldRenderHanzi();
    const h = document.querySelector('.title h1');
    const p = document.querySelector('.title p');
    if (h) h.textContent = '기말고사 필수 한자 38개';
    if (p) p.textContent = '학습지에 제시된 한자를 2·3·4과로 나누어 한자, 한어병음, 뜻과 음성으로 정리했습니다.';
  };
  window.renderHanzi = renderHanzi;

  const oldRenderSentences = renderSentences;
  renderSentences = function renderSentencesClean() {
    oldRenderSentences();
    const h = document.querySelector('.title h1');
    const p = document.querySelector('.title p');
    if (h) h.textContent = '기말고사 문장 쓰기 20개';
    if (p) p.textContent = '학습지 수행평가 문장을 한국어, 중국어, 한어병음과 음성으로 연습합니다.';
  };

  render();
})();
