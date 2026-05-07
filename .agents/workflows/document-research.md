---
description: Interactive Arabic document research and generation workflow — takes a problematic, engages interactively with the user to build a plan, reads source materials from Data/, fills gaps with web research, and generates مبحث-by-مبحث detailed markdown files in the Output/ folder for thesis-level volume.
---

# Interactive Document Research & Generation Workflow

This workflow produces a structured Arabic research document from source materials and a user-provided problematic. It generates **مبحث-by-مبحث** (section-by-section) markdown files in the `Output/` folder, producing thesis-level volume with detailed content.

---

## Prerequisites

- **`Data/`** folder must contain source materials (PDFs, DOCXs, PPTXs, etc.)
- **`Styles/`** folder must contain reference documents for formatting guidance
- The workspace root is the project folder containing `Data/` and `Styles/`

---

## Phase 1: Problematic Intake

1. Ask the user to provide the full text of the problematic (الإشكالية).
2. Read the problematic carefully and identify:
   - The main subject/topic
   - The scope (temporal, geographic, thematic)
   - The implied analytical question(s)
   - Keywords and domain area

---

## Phase 2: Clarifying Questions

Ask 2-3 targeted clarifying questions to sharpen understanding of the problematic. **Every question must provide multiple-choice options PLUS a custom input option.**

**Question 1 — Scope & Focus:**
> ما هو المحور الرئيسي الذي تريد التركيز عليه في هذا البحث؟
- Options based on the problematic
- Custom: "أدخل محوراً مخصصاً"

**Question 2 — Depth & Perspective:**
> ما مستوى التفصيل المطلوب وما الزاوية التحليلية؟
- Options: دراسة شاملة ومعمقة / دراسة موجزة وتركيبية / تحليل مقارن / دراسة تطبيقية
- Custom: "حدد مستوى آخر"

**Question 3 — Target Audience (if not obvious):**
> من هو الجمهور المستهدف لهذا المستند؟
- Options: قيادة عسكرية عليا / إطارات تقنية / طلبة وباحثون / جمهور عام
- Custom: "حدد جمهوراً آخر"

Adapt questions to the specific problematic. The goal is to sharpen the document's direction before any research begins.

---

## Phase 3: Source Material Ingestion

Read every file in `Data/` before planning:

1. **For each file in `Data/`:**
   - PDFs: use a PDF reading tool/skill to extract text
   - DOCXs: use pandoc or direct reading to extract text
   - PPTXs: use markitdown or similar to extract slide content
   - Other formats: read as appropriate

2. **Build an internal knowledge map:**
   - Key topics and subtopics covered in each file
   - Important terminology used (المصطلحات)
   - Key facts, figures, statistics, and arguments
   - Images, charts, maps, and diagrams available in source files
   - Gaps: topics mentioned but not deeply covered

3. **Build a STRICT terminology map from the source materials:**
   - Extract **ALL** specialized Arabic terms from `Data/` files — this is the ONLY authorized vocabulary
   - Note technical terms in other languages and their Arabic equivalents **exactly as used in the sources**
   - **CRITICAL: Prioritize terminology used by the user's domain and institution**
   - If a term is not found in source materials, **DO NOT use it** — flag it for user review instead
   - Never paraphrase or substitute source terminology with synonyms

---

## Phase 4: Style Extraction

Read the reference documents in `Styles/`:

1. **Read `Styles/`** — this is the primary structural template:
   - Note the document structure: cover page → dedication → table of contents → terminology list → introduction → chapters → conclusion → recommendations → references → appendices
   - Note heading hierarchy (H1/H2/H3), paragraph formatting, font choices, page layout
   - Note the chapter separator pages (فاصل) pattern
   - Note citation style and reference formatting

2. **Read any PDFs and PPTXs in `Styles/`** for additional formatting cues:
   - Tone (formal/analytical), section organization, visual elements
   - Color palette, font choices, header/footer patterns

3. **Create an internal style profile** to replicate in the output.

---

## Phase 5: Document Plan Proposal

Present a proposed document outline to the user:

**Proposed structure (adapt to the specific problematic):**
```
المقدمة العامة
  - تقديم الموضوع
  - الإشكالية
  - أهمية الدراسة
  - أهداف البحث
  - منهجية البحث

الفصل الأول: [عنوان مبني على المحور الأول]
  - المبحث الأول: ...
  - المبحث الثاني: ...
  - المبحث الثالث: ...

الفصل الثاني: [عنوان مبني على المحور الثاني]
  - المبحث الأول: ...
  - المبحث الثاني: ...
  - المبحث الثالث: ...

الفصل الثالث: [عنوان مبني على المحور الثالث]
  - المبحث الأول: ...
  - المبحث الثاني: ...
  - المبحث الثالث: ...

الخلاصة العامة
التوصيات
المراجع
الملاحق
```

**Ask the user (multiple-choice + custom):**
> هل الهيكل المقترح يتوافق مع توقعاتك؟
- Options: الموافقة على الخطة كما هي / إضافة فصول أو مباحث / حذف فصول أو مباحث / إعادة هيكلة كاملة / أدخل تعديلاً مخصصاً

**Iterate** until the user approves the plan. Only proceed after explicit approval.

---

## Phase 6: Deep Research

After plan approval, conduct thorough research:

### 6a: Deep Reading of Source Materials
- Re-read `Data/` files focusing on the approved plan's sections
- For each chapter/section in the plan, identify:
  - Which `Data/` files cover this topic
  - What content can be directly used or adapted
  - What gaps remain

### 6b: Web Research for Gaps
- For each gap identified, conduct web research
- Prioritize institutional and academic sources
- **Source priority:** Data/ files > Official/institutional sources > Academic sources > News/media sources

### 6c: Research Log
- Maintain a research log tracking:
  - Sources consulted (with URLs and reliability ratings)
  - Key findings per section
  - Terminology decisions
  - Gaps that could not be filled
  - Contradictions between sources

---

## Phase 7: مبحث-by-مبحث Generation (Section-by-Section)

Generate each **مبحث** (section) as a **separate** markdown file in the `Output/` folder.

### Output Structure
```
Output/
├── 00_مقدمة.md
├── 01_00_مدخل_الفصل_الأول.md
├── 01_01_المبحث_الأول.md
├── 01_02_المبحث_الثاني.md
├── 01_03_المبحث_الثالث.md
├── 02_00_مدخل_الفصل_الثاني.md
├── 02_01_المبحث_الأول.md
├── ...
├── 04_الخلاصة.md
├── 05_التوصيات.md
├── 06_المراجع.md
└── research_log.md
```

### Writing Rules

1. **Language:** Exclusively Arabic (العربية).
2. **STRICT Terminology:** Use **ONLY** terms found in source materials (`Data/` files). **DO NOT** paraphrase, substitute, or invent terms. If a term is not in the sources, **flag it** in `research_log.md`.
3. **Arabic punctuation:** Use ، (Arabic comma) and ؛ (Arabic semicolon) and ؟ (Arabic question mark).
4. **Tone:** Formal, precise, academic.
5. **Structure per مبحث file:** مبحث title (H2) → تمهيد (150-250 words) → مطالب (H3, min 3) → فروع (H4, min 2 per مطلب) → خلاصة المبحث (150-250 words).
6. **VOLUME REQUIREMENTS:** Each مبحث: **min 2000-3000 words**. Each مطلب: **min 500-800 words**. Each فرع: **min 200-400 words**.
7. **Content depth:** definition → historical context → technical explanation → practical application → local context.
8. **Image placeholders:** `![وصف الصورة](image: source_file_or_search_query)` — at least 1-2 per مبحث.

### Generation Process

For each **مبحث** (NOT each chapter):
1. Deep re-read all relevant `Data/` files
2. Terminology check
3. Create a detailed internal outline
4. Write at length in flowing academic Arabic prose
5. Volume check (min 2000-3000 words)
6. Terminology audit
7. Save as numbered markdown file

---

## Behavioral Rules

- **Arabic only:** All output content must be exclusively in Arabic
- **Source materials first:** `Data/` content is the highest-priority and ONLY authorized vocabulary source
- **STRICT terminology:** Use EXCLUSIVELY terms from `Data/` files. NEVER invent, paraphrase, or substitute terms
- **Interactive at every decision point:** Always provide multiple-choice options + custom input
- **Plan before acting:** Get user approval on the document plan before any content generation
- **Flag uncertainty:** Uncertain claims go in the research log, not presented as facts
- **No fabrication:** Do not fabricate statistics, quotes, or data points
- **مبحث-by-مبحث:** Generate ONE مبحث at a time as a separate file
- **Volume enforcement:** Each مبحث MUST meet the 2000-3000 word minimum
- **Narrative prose:** Write in full academic paragraphs, not bullet-point lists
- **Terminology audit:** After writing each مبحث, re-read it to verify all terms match source document vocabulary
