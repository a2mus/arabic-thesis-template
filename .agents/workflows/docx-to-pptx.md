---
description: Convert the approved Arabic Word document (.docx) into a PowerPoint presentation (.pptx) with slides, images, speaker notes, and full RTL Arabic support using PptxGenJS.
---

# Docx → Pptx Conversion Workflow

Convert the approved `report_<topic>.docx` into a **40-60 slide** Arabic presentation with full speaker notes, images, and RTL support.

**Start only after the user has approved the Word document.**

## Prerequisites

- `Output/report_<topic>.docx` — approved Word document
- `Output/images/` — report images
- `Styles/` — reference `.pptx` files
- Node.js + `npm install pptxgenjs`

---

## Phase 1: Read & Map Content

1. Extract from the approved docx: chapter titles, مباحث, مطالب, key findings, conclusions, recommendations, images.
2. Build a hierarchical outline. Each مطلب becomes 1-4 slides (one idea per slide).
3. Read `Styles/*.pptx` to extract color palette, fonts, and layout patterns.

---

## Phase 2: Slide Structure (40-60 slides)

```
الشريحة 1 ─ العنوان المؤسسي
الشريحة 2 ─ المحتوى (جدول الأعمال)
الشريحة 3 ─ انتقالية ← المقدمة مظللة
الشريحة 4 ─ المقدمة (محتوى + رقم 01)
الشريحة 5 ─ انتقالية ← الفصل الأول مظلل
الشرائح 6-N ─ محتوى الفصل الأول (شريط جانبي + محتوى)
  ... [تكرار لكل فصل: انتقالية ← شرائح بشريط جانبي]
شريحة انتقالية ← الخلاصة مظللة
شريحة الخلاصة والملخص
شريحة النهاية ─ "نهاية المحاضرة" + "الأسئلة ؟"
```

**لا توجد شريحة مراجع — العرض ينتهي بالخلاصة ثم شريحة النهاية.**

---

## Phase 3: Speaker Notes — MANDATORY FOR ALL SLIDES

**كل شريحة بدون استثناء يجب أن تحتوي على ملاحظات المتحدث.**

### القالب العام لملاحظات المتحدث:

```
[ماذا أقول]:
- الجملة الافتتاحية المقترحة لتقديم هذه الشريحة
- الشرح المفصّل لكل نقطة معروضة على الشريحة

[أرقام وإحصائيات]:
- كل الأرقام والبيانات ذات الصلة مع مصادرها

[لماذا هذا مهم (فما مغزى ذلك؟)]:
- الأثر الاستراتيجي أو العملياتي

[أسئلة محتملة وإجاباتها]:
- س: سؤال متوقع من الجمهور
- ج: إجابة مقترحة مختصرة

[الانتقال]:
- جملة للانتقال إلى الشريحة التالية
```

### قواعد ملاحظات المتحدث:

1. **بالعربية الفصحى** — رسمية لكن مفهومة
2. **كل نقطة في الشريحة لها شرح مفصّل** في الملاحظات (3-4 جمل على الأقل)
3. **لا تكرر نص الشريحة حرفياً** — الملاحظات تشرح وتوسّع
4. **أضف أرقاماً وإحصائيات** من التقرير الأصلي
5. **أضف أمثلة عملية** ذات صلة
6. **اختم كل ملاحظة بجملة انتقالية** للشريحة التالية
7. **حضّر أسئلة متوقعة** خاصة لشرائح المحتوى الحساسة
8. **200-400 كلمة** لكل ملاحظة شريحة محتوى

---

## Phase 4: Generate Presentation (PptxGenJS)

### Modular Script Architecture (CRITICAL FOR LLM LIMITS)
Since 40-60 slides with 200-400 words of Arabic notes per slide will easily exceed LLM output token limits, you **MUST** split the generation logic into modular files:
1. **Data Modules:** Create multiple JS files (e.g., `data_intro_ch1.js`, `data_ch2.js`, `data_conclusion.js`) that export an array of slide objects.
2. **Generator Script:** Create a single `generate_slides.js` that defines the slide-building functions, imports all the data modules, and loops through them to generate the `.pptx`.

### RTL — MANDATORY on every addText():
- `rtlMode: true` + `align: "right"` (except centered titles: `align: "center"`)

### Images
- Reuse from `Output/images/extracted/` (if extracted from docx) or `Output/images/`.
- **CRITICAL:** Always run `list_dir` on the images directory to get the *exact* file names and extensions (e.g., `.jpeg` vs `.png`) before writing the slide data. Mismatched names will crash the script.

---

## Phase 5: Quality Checks

### Content & Structure
- [ ] 40-60 slides minimum, one idea per slide
- [ ] Transition slide before each chapter, sidebar on every content slide
- [ ] Section numbers on content slides (01, 02, 03...)
- [ ] No references slide

### Speaker Notes
- [ ] **Every single slide** has speaker notes
- [ ] Notes follow the template: ماذا أقول / أرقام / لماذا مهم / أسئلة / انتقال
- [ ] Content slide notes are 200-400 words each
- [ ] End slide notes include 3-5 prepared Q&A pairs
- [ ] All notes in formal Arabic

### RTL & Formatting
- [ ] `rtlMode: true` on every `addText()` and every bullet
- [ ] Arabic punctuation (، ؛ ؟)

---

## Phase 6: Deliver

1. Save `slides_<topic>.pptx` in `Output/`
2. Create `log_<topic>.md` with: sources, terminology, images, limitations
3. Summary to user: slide count, sections, images, issues
4. Ask: هل ترغب في مراجعة العرض التقديمي؟

---

## Behavioral Rules

- **Report first:** Never create before report is approved
- **Arabic only:** All content and notes in Arabic
- **RTL non-negotiable:** `rtlMode: true` everywhere
- **One idea per slide:** Never compress, target 40-60 slides
- **Persistent sidebar:** Every content slide shows chapter outline
- **Speaker notes everywhere:** Presenter must be able to present using only the notes
- **No references slide:** End with summary + Q&A
- **Terminology from sources:** Use Data/ terms only
- **Quality before delivery:** Run all checks first
