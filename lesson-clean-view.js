(() => {
  function renderWord(word) {
    const [hanzi,pinyin,meaning]=word;
    return `<article class="clean-word">${audioButton(hanzi)}<strong>${esc(hanzi)}</strong><b>${esc(pinyin)}</b><p>${esc(meaning)}</p></article>`;
  }
  function renderExample(item) {
    const [hanzi,pinyin,meaning]=item;
    return `<article class="clean-example"><div><strong>${esc(hanzi)}</strong><b>${esc(pinyin)}</b><p>${esc(meaning)}</p></div>${audioButton(hanzi)}</article>`;
  }
  function renderSection(section) {
    return `<section class="clean-section"><div class="clean-section-head"><span>${esc(section.page)}</span><h2>${esc(section.title)}</h2></div>${section.words?`<div class="clean-word-grid">${section.words.map(renderWord).join('')}</div>`:''}${section.examples?`<div class="clean-example-list">${section.examples.map(renderExample).join('')}</div>`:''}${section.bullets?`<ul class="clean-bullets">${section.bullets.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</section>`;
  }
  renderLesson = function renderLessonStructured(key) {
    const base=lessons[key];
    const clean=CleanLessonData[key];
    app.innerHTML=`<section class="page clean-lesson">${title(`${clean.label} 교과서 정리`,`${clean.label} ${clean.title}`,clean.subtitle)}<section class="dialogue-block"><div class="section-heading"><span>본문 1</span><h2>${base.body1Title.replace(/^본문 1 — /,'')}</h2></div><div class="dialogue-list">${base.body1.map(dialogue).join('')}</div></section><section class="dialogue-block"><div class="section-heading"><span>본문 2</span><h2>${base.body2Title.replace(/^본문 2 — /,'')}</h2></div><div class="dialogue-list">${base.body2.map(dialogue).join('')}</div></section>${clean.sections.map(renderSection).join('')}</section>`;
  };
  render();
})();