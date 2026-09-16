# KAIST IP 자기소개서 작성기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Floot에 KAIST IP 자기소개서 작성기를 구현하고, local-first 작성·선택적 GPT 검토 공유·맞춤법 검사·Verified 소재 DB·위험표현 경고를 검증한 뒤 GitHub `Rudwpahs/-3-30`에 재현 가능한 소스를 동기화한다.

**Architecture:** 실제 런타임은 Floot의 React/TypeScript 페이지 + 서버리스 endpoint + Floot 관리형 Postgres를 사용한다. 초안은 브라우저 `localStorage`에만 저장하고, 사용자가 검토 공유를 확인한 문항만 `POST /_api/review-requests`로 DB에 저장한다. 맞춤법은 `POST /_api/spellcheck`가 명시적 동의를 검증한 뒤 서버에서 한국어 교정 제공자를 호출하며, 위험표현/소재 검색은 클라이언트에서만 수행한다.

**Tech Stack:** Floot React/TypeScript, CSS Modules, Floot serverless endpoints, Floot-managed Postgres, Jasmine + Testing Library, GitHub mirror.

**Spec:** `docs/superpowers/specs/2026-09-16-kaist-ip-writer-design.md`

## Global Constraints

- Floot가 실제 서비스 런타임이며 GitHub는 소스 보관 및 이력 관리용이다.
- 개발 Git 브랜치는 `work/kaist-ip-writer`; 기능 검증 전 `main`을 변경하지 않는다.
- 5개 자기소개서 문항은 각각 공백 포함 1,000자 제한을 표시하되 초과 입력을 강제로 자르지 않는다.
- 자동저장 초안, 위험표현 검사, Verified 소재 검색은 서버로 자동 전송하지 않는다.
- GPT 검토 공유는 사용자가 현재 문항을 확인하고 명시적으로 승인한 경우에만 서버 DB에 저장한다.
- 맞춤법 검사는 외부 전송 동의가 없으면 네트워크 호출 자체를 하지 않는다.
- 서버 로그에 자기소개서 본문을 의도적으로 출력하지 않는다.
- 검토 요청 저장 API에 공개 읽기 endpoint를 만들지 않는다.
- Editorial Glass UI를 유지하며 데스크톱과 모바일에서 동일 기능을 제공한다.
- 구현은 TDD로 진행하며 각 동작은 실패 테스트를 확인한 뒤 최소 구현으로 통과시킨다.

---

### Task 1: Floot 프로젝트와 핵심 도메인 유틸리티

**Files:**
- Create: `helpers/questions.tsx`
- Create: `helpers/questions.spec.tsx`
- Create: `helpers/riskRules.tsx`
- Create: `helpers/riskRules.spec.tsx`
- Create: `helpers/localDrafts.tsx`
- Create: `helpers/localDrafts.spec.tsx`
- Create: `base.css`

**Interfaces:**
- Produces: `QUESTIONS`, `countCharacters(text)`, `detectRisks(text)`, `loadDraftState(storage)`, `saveDraftState(storage, state)`.

- [ ] **Step 1: Write failing tests for question metadata and 1,000-character counting**

```ts
import { QUESTIONS, countCharacters } from './questions';

describe('questions', () => {
  it('defines exactly five 1000-character questions', () => {
    expect(QUESTIONS.length).toBe(5);
    expect(QUESTIONS.every(q => q.maxChars === 1000)).toBeTrue();
  });

  it('counts Korean text including spaces', () => {
    expect(countCharacters('안녕 세계')).toBe(5);
  });
});
```

- [ ] **Step 2: Run the tests and confirm RED**

Run: Floot `run_tests` with `helpers/questions.spec.tsx`.
Expected: FAIL because the helper does not exist yet.

- [ ] **Step 3: Implement `QUESTIONS` and `countCharacters` minimally**

```ts
export type QuestionId = 1 | 2 | 3 | 4 | 5;
export type Question = { id: QuestionId; title: string; prompt: string; maxChars: 1000 };
export const QUESTIONS: Question[] = [/* verified official prompts */];
export const countCharacters = (text: string) => Array.from(text).length;
```

- [ ] **Step 4: Add failing tests for local save/restore and risk detection**

```ts
it('restores only local draft state from storage', () => { /* fake Storage with five drafts */ });
it('flags absolute claims without altering text', () => {
  const result = detectRisks('세계 최고이고 100% 성공했습니다.');
  expect(result.map(x => x.term)).toContain('세계 최고');
  expect(result.map(x => x.term)).toContain('100%');
});
```

- [ ] **Step 5: Implement the minimal local storage and risk helpers, then run all helper tests GREEN**

Expected: all helper specs PASS with no warnings.

- [ ] **Step 6: Create a Floot checkpoint**

Checkpoint title: `Core local-first domain utilities`.

### Task 2: Editorial Glass 작성 워크스페이스

**Files:**
- Create: `pages/_index.tsx`
- Create: `pages/_index.module.css`
- Create: `components/QuestionNavigator.tsx`
- Create: `components/QuestionNavigator.module.css`
- Create: `components/EssayEditor.tsx`
- Create: `components/EssayEditor.module.css`
- Create: `components/EssayWorkspace.tsx`
- Create: `components/EssayWorkspace.module.css`
- Create: `helpers/workspace.spec.tsx`

**Interfaces:**
- Consumes: `QUESTIONS`, `countCharacters`, local draft helpers.
- Produces: five-question navigation, textarea editor, save status, progress, reset confirmation.

- [ ] **Step 1: Write failing component tests for five question tabs, character counter, and local restore**

```ts
it('renders five question navigation buttons', () => { /* render workspace and query five buttons */ });
it('shows over-limit state without truncating content', () => { /* 1001 chars stays in editor and counter marks over */ });
it('restores the last selected question from local storage', () => { /* seed storage, render, assert */ });
```

- [ ] **Step 2: Run tests RED**

Expected: FAIL because workspace components do not exist.

- [ ] **Step 3: Implement minimal functional workspace and responsive Editorial Glass styling**

Desktop layout: left navigation / center editor / right tools rail.
Mobile layout: top question tabs / editor / collapsible tools section.

- [ ] **Step 4: Run workspace tests GREEN and typecheck**

Run: Floot `run_tests`; Floot `typecheck`.
Expected: PASS, no type errors.

- [ ] **Step 5: Create checkpoint**

Checkpoint title: `Editorial Glass essay workspace`.

### Task 3: Verified 소재 DB와 위험표현 패널

**Files:**
- Create: `helpers/materials.tsx`
- Create: `helpers/materials.spec.tsx`
- Create: `components/MaterialPanel.tsx`
- Create: `components/MaterialPanel.module.css`
- Create: `components/RiskPanel.tsx`
- Create: `components/RiskPanel.module.css`

**Interfaces:**
- Produces: `Material`, `EvidenceStatus`, `MATERIALS`, client-side filtering, factual-note insertion.

- [ ] **Step 1: Write failing tests for material status and safe insertion behavior**

```ts
it('contains only allowed evidence statuses', () => { /* VERIFIED/TIME_BOUND/CONFLICT/SELF_REPORT */ });
it('returns factual notes rather than generated essay prose', () => { /* inserted payload is source-note form */ });
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Populate source-grounded material records from uploaded project evidence**

Initial records: MediaPipe AI yoga project, PM accident data/simulator/site, portfolio web project, gifted-camp Design Thinking/AI activities. Each record must include provenance label and note; unsupported claims are omitted rather than inferred.

- [ ] **Step 4: Implement panels and connect them to the current question**

- [ ] **Step 5: Run tests GREEN and typecheck**

- [ ] **Step 6: Create checkpoint**

Checkpoint title: `Verified materials and risk review`.

### Task 4: 선택적 GPT 검토 공유 데이터베이스와 endpoint

**Files:**
- Create via Floot managed DB: table `review_requests`
- Create: `endpoints/review-requests_POST.ts`
- Create: `endpoints/review-requests_POST.schema.ts`
- Create: `helpers/reviewRequests.tsx`
- Create: `helpers/reviewRequests.spec.tsx`
- Create: `components/ReviewSharePanel.tsx`
- Create: `components/ReviewSharePanel.module.css`

**Interfaces:**
- `POST /_api/review-requests` body: `{ browserId, questionId, content, charCount }`.
- Response: `{ id, questionId, version, createdAt }`.
- DB columns: `id`, `browser_id`, `question_id`, `content`, `char_count`, `version`, `status`, `created_at`.

- [ ] **Step 1: Provision Floot managed database**

- [ ] **Step 2: Execute migration**

```sql
CREATE TABLE review_requests (
  id BIGSERIAL PRIMARY KEY,
  browser_id TEXT NOT NULL,
  question_id SMALLINT NOT NULL CHECK (question_id BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  char_count INTEGER NOT NULL,
  version INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX review_requests_browser_question_version
  ON review_requests(browser_id, question_id, version);
CREATE INDEX review_requests_latest
  ON review_requests(browser_id, question_id, created_at DESC);
```

- [ ] **Step 3: Write failing tests for version increment, validation, and explicit share only**

```ts
it('rejects question ids outside 1..5', async () => { /* handler returns 400 */ });
it('does not persist anything from local autosave', () => { /* client helper only POSTs after confirm */ });
it('increments version for repeated shares of the same browser/question', async () => { /* v1 then v2 */ });
```

- [ ] **Step 4: Run RED**

- [ ] **Step 5: Implement endpoint with a transaction-safe next-version insert and no content logging**

- [ ] **Step 6: Implement confirmation modal and success copy with version**

Success example: `검토 요청 완료 — 3번 v2. ChatGPT에서 “방금 쓴 3번 봐줘”라고 말하세요.`

- [ ] **Step 7: Run endpoint tests GREEN, query DB to verify stored row, and create checkpoint**

Checkpoint title: `Explicit GPT review sharing`.

### Task 5: 맞춤법 검사 서버 어댑터와 동의 게이트

**Files:**
- Create: `helpers/spellcheck.tsx`
- Create: `helpers/spellcheck.spec.tsx`
- Create: `endpoints/spellcheck_POST.ts`
- Create: `endpoints/spellcheck_POST.schema.ts`
- Create: `components/SpellcheckPanel.tsx`
- Create: `components/SpellcheckPanel.module.css`

**Interfaces:**
- Request: `{ text: string, consent: true }`.
- Response: `{ correctedText, suggestions, provider }`.
- `splitKoreanText(text, max=500)` preserves order and reconstructs the original text before correction.

- [ ] **Step 1: Inspect Floot-supported network/runtime resources and confirm the current `py-hanspell` provider can be ported safely**

If Naver Speller proxy remains reachable from Floot server runtime, port the request flow to TypeScript. If it is not reliably reachable, use the first supported Korean correction provider available in Floot and record the provider name in the response. Do not silently substitute browser-only checking.

- [ ] **Step 2: Write failing tests for 500-character chunking and consent rejection**

```ts
it('splits long Korean text into ordered chunks no longer than 500 chars', () => { /* assert chunk sizes and join */ });
it('rejects spellcheck when consent is not true', async () => { /* 400/403 */ });
```

- [ ] **Step 3: Run RED**

- [ ] **Step 4: Implement chunking and provider adapter minimally**

- [ ] **Step 5: Implement UI that shows original vs suggestion and never auto-overwrites the essay**

- [ ] **Step 6: Run unit tests GREEN and make one live server call with consent=true; verify consent=false produces zero provider calls**

- [ ] **Step 7: Create checkpoint**

Checkpoint title: `Consent-gated Korean spellcheck`.

### Task 6: Privacy, failure states, and full Preview verification

**Files:**
- Modify: `pages/_index.tsx`
- Modify: relevant components from Tasks 2–5
- Create: `helpers/privacy.spec.tsx`

**Interfaces:**
- Produces: clear external-transfer copy, local-save failure banner, server failure retries, reset confirmation.

- [ ] **Step 1: Write failing privacy/failure tests**

```ts
it('does not call review or spellcheck endpoints while typing', () => { /* spy fetch */ });
it('keeps draft text when server share fails', () => { /* local content unchanged */ });
it('keeps original essay when spellcheck provider fails', () => { /* no overwrite */ });
```

- [ ] **Step 2: Run RED, implement failure states, run GREEN**

- [ ] **Step 3: Typecheck and run the full test suite**

Expected: all specs PASS and typecheck has zero errors.

- [ ] **Step 4: Open private Floot Preview and test desktop**

Verify: five questions, autosave/refresh restore, 1,000+ state, material filtering/insertion, risk warning, spellcheck consent OFF/ON, review-share confirm, DB version increment, reset modal.

- [ ] **Step 5: Test mobile layout and keyboard accessibility**

Verify usable at narrow viewport; labels, focus order, buttons, dialogs are operable.

- [ ] **Step 6: Inspect browser/server logs for runtime errors and confirm essay bodies are not intentionally logged**

- [ ] **Step 7: Create checkpoint**

Checkpoint title: `Preview verified KAIST IP writer`.

### Task 7: GitHub mirror, CI, and production publication

**Files in GitHub `work/kaist-ip-writer`:**
- Replace: current Vite Chinese-study application with a reproducible mirror/reference implementation of the Floot app.
- Preserve/Create: `docs/superpowers/specs/2026-09-16-kaist-ip-writer-design.md`
- Preserve/Create: `docs/superpowers/plans/2026-09-16-kaist-ip-writer.md`
- Update: `README.md` with Floot runtime architecture, privacy contract, test instructions, and live URL after publication.
- Replace obsolete Chinese-study assets/workflows as needed.

- [ ] **Step 1: Export/sync the final Floot source structure into the GitHub work branch in a maintainable mirror form**

- [ ] **Step 2: Run GitHub-side build/type checks where applicable**

- [ ] **Step 3: Compare `main...work/kaist-ip-writer` and ensure the old Chinese app is fully replaced in the work branch**

- [ ] **Step 4: Use `verification-before-completion` before claiming readiness**

- [ ] **Step 5: Use `finishing-a-development-branch`; only after verified completion, replace `main` because the user explicitly requested this repository to become the new site**

- [ ] **Step 6: Read Floot publishing guide, publish to a Floot subdomain, then verify the published app and backend logs**

- [ ] **Step 7: Report live URL, GitHub commit/branch status, test results, and how to ask ChatGPT to read a shared draft**
