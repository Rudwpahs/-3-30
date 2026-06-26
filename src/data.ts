export type DialogueLine = {
  speaker: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type HanziItem = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type Lesson = {
  title: string;
  subtitle: string;
  body1Title: string;
  body1: DialogueLine[];
  body2Title: string;
  body2: DialogueLine[];
  keyExpressions: HanziItem[];
  rules: string[];
};

export const lessons: Record<"lesson2" | "lesson3" | "lesson4", Lesson> = {
  lesson2: {
    title: "你好！",
    subtitle: "인사 · 감사 · 사과",
    body1Title: "본문 1 — 만나고 헤어질 때 인사하기",
    body1: [
      { speaker: "이한나·장페이", hanzi: "你好！", pinyin: "Nǐ hǎo!", meaning: "안녕!" },
      { speaker: "왕징징", hanzi: "你们好！", pinyin: "Nǐmen hǎo!", meaning: "너희들 안녕!" },
      { speaker: "이한나", hanzi: "再见！", pinyin: "Zàijiàn!", meaning: "잘 가!" },
      { speaker: "장페이", hanzi: "明天见！", pinyin: "Míngtiān jiàn!", meaning: "내일 만나!" },
    ],
    body2Title: "본문 2 — 감사하고 사과하기",
    body2: [
      { speaker: "장페이", hanzi: "谢谢！", pinyin: "Xièxie!", meaning: "감사합니다!" },
      { speaker: "이한나", hanzi: "不客气！", pinyin: "Bú kèqi!", meaning: "천만에요!" },
      { speaker: "김동민", hanzi: "对不起。", pinyin: "Duìbuqǐ.", meaning: "미안합니다." },
      { speaker: "왕징징", hanzi: "没关系。", pinyin: "Méi guānxi.", meaning: "괜찮습니다." },
    ],
    keyExpressions: [
      { hanzi: "您好", pinyin: "Nín hǎo", meaning: "안녕하세요(존칭)" },
      { hanzi: "老师好", pinyin: "Lǎoshī hǎo", meaning: "선생님 안녕하세요" },
      { hanzi: "大家好", pinyin: "Dàjiā hǎo", meaning: "여러분 안녕하세요" },
      { hanzi: "不好意思", pinyin: "Bù hǎoyìsi", meaning: "미안합니다 / 실례합니다" },
    ],
    rules: [
      "제3성 뒤에 제3성이 오면 앞의 제3성을 제2성처럼 발음하지만 성조 표기는 바꾸지 않습니다.",
      "不 뒤에 제4성이 오면 不를 제2성 bú로 발음합니다: bú kèqi.",
      "중국어는 높임말이 거의 없지만 你 대신 您을 존칭으로 사용합니다.",
    ],
  },
  lesson3: {
    title: "你是哪国人？",
    subtitle: "이름 · 국적 · 인물 묘사",
    body1Title: "본문 1 — 이름과 국적 묻고 답하기",
    body1: [
      { speaker: "장페이", hanzi: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", meaning: "너는 이름이 뭐니?" },
      { speaker: "김동민", hanzi: "我叫金东民。", pinyin: "Wǒ jiào Jīn Dōngmín.", meaning: "나는 김동민이라고 해." },
      { speaker: "장페이", hanzi: "你是哪国人？", pinyin: "Nǐ shì nǎ guó rén?", meaning: "너는 어느 나라 사람이니?" },
      { speaker: "김동민", hanzi: "我是韩国人。", pinyin: "Wǒ shì Hánguórén.", meaning: "나는 한국인이야." },
    ],
    body2Title: "본문 2 — 친구를 묘사하고 소개하기",
    body2: [
      { speaker: "이한나", hanzi: "他很帅！", pinyin: "Tā hěn shuài!", meaning: "그는 아주 잘생겼어!" },
      { speaker: "왕징징", hanzi: "他是我的朋友。", pinyin: "Tā shì wǒ de péngyou.", meaning: "그는 내 친구야." },
      { speaker: "이한나", hanzi: "他是美国人吗？", pinyin: "Tā shì Měiguórén ma?", meaning: "그는 미국인이니?" },
      { speaker: "왕징징", hanzi: "不是，他是加拿大人。", pinyin: "Bú shì, tā shì Jiānádàrén.", meaning: "아니, 그는 캐나다인이야." },
    ],
    keyExpressions: [
      { hanzi: "漂亮", pinyin: "piàoliang", meaning: "예쁘다" },
      { hanzi: "好看", pinyin: "hǎokàn", meaning: "보기 좋다 / 근사하다" },
      { hanzi: "可爱", pinyin: "kě'ài", meaning: "귀엽다" },
      { hanzi: "不是", pinyin: "bú shì", meaning: "~이 아니다 / 아니요" },
    ],
    rules: [
      "중국어 기본 어순은 주어 + 서술어 + 목적어입니다.",
      "평서문 끝에 吗를 붙이면 예·아니오로 답하는 의문문이 됩니다.",
      "什么, 哪 같은 의문사는 묻고 싶은 자리에 그대로 놓습니다.",
      "나라 이름과 사람 이름의 한어병음 첫 글자는 대문자로 표기합니다.",
    ],
  },
  lesson4: {
    title: "她是谁？",
    subtitle: "가족 · 나이 · 학년 · 숫자",
    body1Title: "본문 1 — 가족을 소개하고 나이 묻기",
    body1: [
      { speaker: "왕징징", hanzi: "她是谁？", pinyin: "Tā shì shéi?", meaning: "그녀는 누구니?" },
      { speaker: "김동민", hanzi: "她是我妹妹。", pinyin: "Tā shì wǒ mèimei.", meaning: "그녀는 내 여동생이야." },
      { speaker: "왕징징", hanzi: "她很像你！她几岁？", pinyin: "Tā hěn xiàng nǐ! Tā jǐ suì?", meaning: "그녀는 너를 아주 닮았어! 몇 살이니?" },
      { speaker: "김동민", hanzi: "今年八岁。", pinyin: "Jīnnián bā suì.", meaning: "올해 여덟 살이야." },
    ],
    body2Title: "본문 2 — 형제 유무와 학년 묻기",
    body2: [
      { speaker: "이한나", hanzi: "你有哥哥吗？", pinyin: "Nǐ yǒu gēge ma?", meaning: "너는 형이 있니?" },
      { speaker: "장페이", hanzi: "有，这是我哥哥。", pinyin: "Yǒu, zhè shì wǒ gēge.", meaning: "응, 이 사람이 내 형이야." },
      { speaker: "이한나", hanzi: "他上几年级？", pinyin: "Tā shàng jǐ niánjí?", meaning: "그는 몇 학년이니?" },
      { speaker: "장페이", hanzi: "高中二年级。", pinyin: "Gāozhōng èr niánjí.", meaning: "고등학교 2학년이야." },
    ],
    keyExpressions: [
      { hanzi: "爸爸", pinyin: "bàba", meaning: "아버지" },
      { hanzi: "妈妈", pinyin: "māma", meaning: "어머니" },
      { hanzi: "哥哥", pinyin: "gēge", meaning: "형 / 오빠" },
      { hanzi: "姐姐", pinyin: "jiějie", meaning: "누나 / 언니" },
      { hanzi: "妹妹", pinyin: "mèimei", meaning: "여동생" },
      { hanzi: "弟弟", pinyin: "dìdi", meaning: "남동생" },
    ],
    rules: [
      "几는 주로 10 이하로 예상되는 수를 물을 때 사용합니다.",
      "有의 부정은 不有가 아니라 没有입니다.",
      "가족처럼 가까운 관계에서는 소유를 나타내는 的를 생략할 수 있습니다.",
      "나이는 几岁, 多大, 多大年纪로 대상에 맞게 묻습니다.",
    ],
  },
};

export const hanziByLesson: Record<"lesson2" | "lesson3" | "lesson4", HanziItem[]> = {
  lesson2: [
    { hanzi: "我", pinyin: "wǒ", meaning: "나" },
    { hanzi: "你", pinyin: "nǐ", meaning: "너" },
    { hanzi: "您", pinyin: "nín", meaning: "당신(존칭)" },
    { hanzi: "他", pinyin: "tā", meaning: "그" },
    { hanzi: "她", pinyin: "tā", meaning: "그녀" },
    { hanzi: "好", pinyin: "hǎo", meaning: "안녕하다, 좋다" },
    { hanzi: "再见", pinyin: "zàijiàn", meaning: "잘 가" },
    { hanzi: "明天", pinyin: "míngtiān", meaning: "내일" },
    { hanzi: "见", pinyin: "jiàn", meaning: "만나다" },
    { hanzi: "不", pinyin: "bù", meaning: "~이 아니다" },
    { hanzi: "没", pinyin: "méi", meaning: "없다" },
  ],
  lesson3: [
    { hanzi: "叫", pinyin: "jiào", meaning: "부르다" },
    { hanzi: "什么", pinyin: "shénme", meaning: "무엇" },
    { hanzi: "名字", pinyin: "míngzi", meaning: "이름" },
    { hanzi: "是", pinyin: "shì", meaning: "~이다, 네" },
    { hanzi: "哪", pinyin: "nǎ", meaning: "어느" },
    { hanzi: "国", pinyin: "guó", meaning: "나라" },
    { hanzi: "人", pinyin: "rén", meaning: "사람" },
    { hanzi: "韩国人", pinyin: "Hánguórén", meaning: "한국인" },
    { hanzi: "中国人", pinyin: "Zhōngguórén", meaning: "중국인" },
    { hanzi: "美国人", pinyin: "Měiguórén", meaning: "미국인" },
    { hanzi: "很", pinyin: "hěn", meaning: "아주, 매우" },
    { hanzi: "的", pinyin: "de", meaning: "~의" },
    { hanzi: "朋友", pinyin: "péngyou", meaning: "친구" },
    { hanzi: "吗", pinyin: "ma", meaning: "~입니까?" },
    { hanzi: "学生", pinyin: "xuésheng", meaning: "학생" },
  ],
  lesson4: [
    { hanzi: "谁", pinyin: "shéi", meaning: "누구" },
    { hanzi: "几", pinyin: "jǐ", meaning: "몇" },
    { hanzi: "岁", pinyin: "suì", meaning: "살, 세" },
    { hanzi: "今年", pinyin: "jīnnián", meaning: "올해" },
    { hanzi: "多", pinyin: "duō", meaning: "얼마나" },
    { hanzi: "大", pinyin: "dà", meaning: "(나이가) 많다" },
    { hanzi: "年纪", pinyin: "niánjì", meaning: "연세" },
    { hanzi: "有", pinyin: "yǒu", meaning: "있다" },
    { hanzi: "没有", pinyin: "méiyǒu", meaning: "없다" },
    { hanzi: "这", pinyin: "zhè", meaning: "이, 이것" },
    { hanzi: "上", pinyin: "shàng", meaning: "(학교에) 다니다" },
    { hanzi: "年级", pinyin: "niánjí", meaning: "학년" },
  ],
};

export const sentences: HanziItem[] = [
  { hanzi: "你们好！", pinyin: "Nǐmen hǎo!", meaning: "얘들아 안녕!" },
  { hanzi: "老师好！", pinyin: "Lǎoshī hǎo!", meaning: "선생님 안녕하세요!" },
  { hanzi: "大家好！", pinyin: "Dàjiā hǎo!", meaning: "여러분 안녕하세요!" },
  { hanzi: "您好！", pinyin: "Nín hǎo!", meaning: "어르신 안녕하세요!" },
  { hanzi: "谢谢！", pinyin: "Xièxie!", meaning: "감사합니다!" },
  { hanzi: "对不起！", pinyin: "Duìbuqǐ!", meaning: "미안합니다!" },
  { hanzi: "没关系。", pinyin: "Méi guānxi.", meaning: "괜찮습니다." },
  { hanzi: "不客气。", pinyin: "Bú kèqi.", meaning: "천만에요." },
  { hanzi: "再见！", pinyin: "Zàijiàn!", meaning: "잘 가!" },
  { hanzi: "明天见！", pinyin: "Míngtiān jiàn!", meaning: "내일 만나!" },
  { hanzi: "你是中国人吗？", pinyin: "Nǐ shì Zhōngguórén ma?", meaning: "당신은 중국인입니까?" },
  { hanzi: "不，我是韩国人。", pinyin: "Bù, wǒ shì Hánguórén.", meaning: "아니요, 나는 한국인입니다." },
  { hanzi: "我不是日本人。", pinyin: "Wǒ bú shì Rìběnrén.", meaning: "나는 일본인이 아닙니다." },
  { hanzi: "你是哪国人？", pinyin: "Nǐ shì nǎ guó rén?", meaning: "당신은 어느 나라 사람입니까?" },
  { hanzi: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", meaning: "너의 이름은 무엇이니?" },
  { hanzi: "他是学生吗？", pinyin: "Tā shì xuésheng ma?", meaning: "그는 학생이니?" },
  { hanzi: "他很帅。", pinyin: "Tā hěn shuài.", meaning: "그는 잘생겼다." },
  { hanzi: "她不漂亮。", pinyin: "Tā bù piàoliang.", meaning: "그녀는 예쁘지 않다." },
  { hanzi: "她很可爱。", pinyin: "Tā hěn kě'ài.", meaning: "그녀는 귀엽다." },
  { hanzi: "她是我的朋友。", pinyin: "Tā shì wǒ de péngyou.", meaning: "그녀는 내 친구다." },
];

export const quiz: [string, string[], string][] = [
  ["‘천만에요’는?", ["没关系", "不客气", "对不起", "再见"], "不客气"],
  ["有의 부정형은?", ["不有", "没有", "不是", "没是"], "没有"],
  ["‘너의 이름은 무엇이니?’는?", ["你是哪国人？", "你叫什么名字？", "她是谁？", "你有哥哥吗？"], "你叫什么名字？"],
  ["제3성+제3성의 실제 발음은?", ["앞 음절을 제1성", "앞 음절을 제2성", "뒤 음절을 제2성", "둘 다 제4성"], "앞 음절을 제2성"],
  ["36의 중국어 표기는?", ["三六", "三十六", "十三六", "六十三"], "三十六"],
  ["‘그녀는 누구니?’는?", ["她是谁？", "她几岁？", "她好吗？", "她是哪国人？"], "她是谁？"],
  ["‘나는 한국인이다’는?", ["我是韩国人。", "我不是韩国人。", "我是中国人吗？", "你是韩国人。"], "我是韩国人。"],
  ["‘내일 만나!’는?", ["再见！", "明天见！", "你们好！", "不客气！"], "明天见！"],
];
