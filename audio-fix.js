(() => {
  let selectedVoice = null;

  function findChineseVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    selectedVoice =
      voices.find(v => /^zh-CN$/i.test(v.lang)) ||
      voices.find(v => /^zh-Hans/i.test(v.lang)) ||
      voices.find(v => /^zh/i.test(v.lang)) ||
      null;
  }

  if ('speechSynthesis' in window) {
    findChineseVoice();
    window.speechSynthesis.onvoiceschanged = findChineseVoice;
  }

  window.speak = function speakWithBrowserVoice(text) {
    const button = document.activeElement;
    if (button && button.classList && button.classList.contains('audio-button')) {
      button.classList.add('playing');
    }

    if (!('speechSynthesis' in window)) {
      alert('이 브라우저에서는 음성 재생을 지원하지 않습니다. Chrome 또는 Edge에서 열어 주세요.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = selectedVoice?.lang || 'zh-CN';
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.78;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => button?.classList?.remove('playing');
    utterance.onerror = () => button?.classList?.remove('playing');
    window.speechSynthesis.speak(utterance);
  };
})();
