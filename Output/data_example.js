/**
 * data_example.js — Example slide data module for generate_slides.js
 *
 * Each data file exports an array of slide objects.
 * The generator script (Output/generate_slides.js) imports these
 * and builds the PPTX from them.
 *
 * Usage: Create data_intro_ch1.js, data_ch2.js, etc. following this pattern.
 */

// Slide types: "title", "toc", "transition", "content", "summary", "end"

module.exports = [
  // Example: Title slide
  {
    type: "title",
    institution: "[Institution Hierarchy Line 1]\n[Line 2]\n[Line 3]",
    title: "[Thesis Title in Arabic]",
    subtitle: "[Subtitle or Case Study]",
    presenter: "[Rank and Name]",
    notes: "[ماذا أقول]:\n- السلام عليكم...\n- تقديم النفس\n\n[الانتقال]:\n- سنتناول هذا الموضوع من خلال المحاور التالية..."
  },

  // Example: TOC slide
  {
    type: "toc",
    notes: "[ماذا أقول]:\n- سنتناول الموضوع من خلال المحاور التالية...\n\n[الانتقال]:\n- نبدأ بالمقدمة..."
  },

  // Example: Transition slide (active = index in SECTIONS array)
  {
    type: "transition",
    active: 0,
    notes: "[ماذا أقول]:\n- ننتقل الآن إلى المقدمة...\n\n[الانتقال]:\n- نبدأ بتقديم الإطار العام..."
  },

  // Example: Content slide with sidebar
  {
    type: "content",
    title: "[Slide Title in Arabic]",
    ch: 1,           // Chapter number (for sidebar)
    outlineIdx: 0,   // Active مبحث index in the sidebar
    bullets: [
      "النقطة الأولى: شرح مختصر",
      "النقطة الثانية: تفصيل إضافي",
      "النقطة الثالثة: مثال تطبيقي"
    ],
    img: "image_file.png",   // Optional: filename in Output/images/extracted/
    notes: "[ماذا أقول]:\n- الجملة الافتتاحية...\n- شرح النقطة الأولى...\n\n[أرقام]:\n- 85% من...\n\n[لماذا مهم]:\n- الأثر على...\n\n[أسئلة]:\n- س: ... ج: ...\n\n[الانتقال]:\n- ننتقل الآن إلى..."
  },

  // Example: End slide
  {
    type: "end",
    notes: "[ماذا أقول]:\n- شكراً لحسن الإصغاء...\n\n[أسئلة متوقعة]:\n- س1: ... ج: ...\n- س2: ... ج: ...\n- س3: ... ج: ..."
  }
];
