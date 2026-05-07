/**
 * generate_slides.js — PPTX Slide Generator
 *
 * Builds an Arabic RTL PowerPoint presentation from modular data files.
 * Each data_*.js file exports an array of slide objects.
 *
 * Slide types: title, toc, transition, content, summary, end
 *
 * Usage: node Output/generate_slides.js
 * Prerequisites: npm install pptxgenjs
 */
"use strict";
const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

// ── Design System (customize for your institution) ────────────
const C = {
  pri: "1B3A5C",    // Primary — dark navy
  sec: "2E7D32",    // Secondary — green
  acc: "C62828",    // Accent — red
  bg: "FFFFFF",     // Background
  text: "333333",   // Body text
  sidebar: "E8EEF4",// Sidebar background
  active: "1B3A5C", // Active sidebar item
  muted: "666666",  // Muted text
  white: "FFFFFF",
  light: "F5F5F5",
  gold: "C9A84C"    // Gold accent
};
const F = "Sakkal Majalla"; // Font — change to match your template
const W = 10, H = 5.625;    // 16:9 dimensions
const IMGS = path.join(__dirname, "images", "extracted") + path.sep;
// ──────────────────────────────────────────────────────────────

// ── Sections for TOC and transitions (customize) ─────────────
const SECTIONS = [
  "المقدمة",
  "الفصل الأول: [عنوان الفصل]",
  "الفصل الثاني: [عنوان الفصل]",
  "الفصل الثالث: [عنوان الفصل]",
  "الخلاصة والتوصيات"
];

// Sidebar outlines per chapter (customize)
const OUTLINES = {
  1: ["المبحث 1: [...]", "المبحث 2: [...]", "المبحث 3: [...]"],
  2: ["المبحث 1: [...]", "المبحث 2: [...]", "المبحث 3: [...]"],
  3: ["المبحث 1: [...]", "المبحث 2: [...]", "المبحث 3: [...]"]
};
// ──────────────────────────────────────────────────────────────

function darkBg(s) { s.background = { color: C.pri }; }

function addSidebar(s, ch, activeIdx) {
  if (!OUTLINES[ch]) return;
  s.addShape("rect", { x: 6.2, y: 0, w: 3.8, h: H, fill: { color: C.sidebar }, line: { color: C.sidebar } });
  s.addShape("rect", { x: 6.2, y: 0, w: 3.8, h: 0.08, fill: { color: C.pri }, line: { color: C.pri } });
  OUTLINES[ch].forEach((txt, i) => {
    const on = i === activeIdx;
    s.addText(txt, {
      x: 6.3, y: 0.25 + i * 0.72, w: 3.6, h: 0.6,
      rtlMode: true, align: "right", fontSize: on ? 14 : 12, bold: on,
      color: on ? C.active : C.muted, fontFace: F, margin: [0, 4, 0, 4]
    });
    if (on) s.addShape("rect", { x: 6.2, y: 0.25 + i * 0.72, w: 0.08, h: 0.6, fill: { color: C.acc }, line: { color: C.acc } });
  });
}

function addSectionNum(s, num) {
  s.addShape("rect", { x: 6.2, y: H - 0.5, w: 3.8, h: 0.5, fill: { color: C.pri }, line: { color: C.pri } });
  s.addText(String(num).padStart(2, "0"), { x: 6.2, y: H - 0.5, w: 3.8, h: 0.5, align: "center", valign: "middle", fontSize: 18, bold: true, color: C.white, fontFace: F });
}

function addTitleBar(s, title) {
  s.addShape("rect", { x: 0, y: 0, w: 6.1, h: 0.8, fill: { color: C.pri }, line: { color: C.pri } });
  s.addText(title, { x: 0.1, y: 0, w: 5.9, h: 0.8, rtlMode: true, align: "center", valign: "middle", fontSize: 24, bold: true, color: C.white, fontFace: F });
}

function addBullets(s, bullets, imgPath) {
  const contentH = imgPath ? 2.7 : H - 0.9;
  const items = bullets.map((b, i) => ({
    text: b, options: { rtlMode: true, bullet: true, breakLine: i < bullets.length - 1, fontSize: 16, color: C.text, fontFace: F }
  }));
  s.addText(items, { x: 0.3, y: 0.9, w: 5.6, h: contentH, rtlMode: true, align: "right", valign: "top", fontFace: F, margin: [4, 6, 4, 6] });
  if (imgPath) {
    s.addImage({ path: IMGS + imgPath, x: 0.3, y: H - 1.8, w: 5.6, h: 1.7, sizing: { type: "contain", w: 5.6, h: 1.7 } });
  }
}

async function buildSlide(pres, sd, num) {
  if (sd.type === "title") {
    const s = pres.addSlide();
    darkBg(s);
    s.addText(sd.institution || "[Institution Hierarchy]", {
      x: 0.3, y: 0.3, w: 9.4, h: 1.0, rtlMode: true, align: "center", fontSize: 14, color: C.white, fontFace: F, bold: true
    });
    s.addShape("rect", { x: 1.5, y: 1.6, w: 7, h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });
    s.addText(sd.title, { x: 0.3, y: 1.8, w: 9.4, h: 0.8, rtlMode: true, align: "center", fontSize: 36, bold: true, color: C.white, fontFace: F });
    s.addText(sd.subtitle || "", { x: 0.3, y: 2.6, w: 9.4, h: 0.8, rtlMode: true, align: "center", fontSize: 28, bold: true, color: C.gold, fontFace: F });
    s.addShape("rect", { x: 1.5, y: 3.5, w: 7, h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });
    s.addText(sd.presenter || "", { x: 0.3, y: 4.0, w: 9.4, h: 0.5, rtlMode: true, align: "center", fontSize: 20, color: C.white, fontFace: F });
    s.addNotes(sd.notes || "");
  }
  else if (sd.type === "toc") {
    const s = pres.addSlide();
    s.background = { color: C.light };
    s.addShape("rect", { x: 0, y: 0, w: W, h: 0.8, fill: { color: C.pri }, line: { color: C.pri } });
    s.addText("المحتوى", { x: 0, y: 0, w: W, h: 0.8, rtlMode: true, align: "center", valign: "middle", fontSize: 32, bold: true, color: C.white, fontFace: F });
    SECTIONS.forEach((sec, i) => {
      const y = 1.2 + i * 0.8;
      s.addShape("rect", { x: 1.5, y, w: 0.8, h: 0.6, fill: { color: C.pri }, line: { color: C.pri } });
      s.addText(String(i + 1).padStart(2, "0"), { x: 1.5, y, w: 0.8, h: 0.6, align: "center", valign: "middle", fontSize: 20, bold: true, color: C.white, fontFace: F });
      s.addText(sec, { x: 2.5, y, w: 6.0, h: 0.6, rtlMode: true, align: "right", valign: "middle", fontSize: 22, bold: true, color: C.text, fontFace: F });
    });
    s.addNotes(sd.notes || "");
  }
  else if (sd.type === "transition") {
    const s = pres.addSlide();
    darkBg(s);
    s.addShape("rect", { x: 0, y: 0, w: 0.2, h: H, fill: { color: C.gold }, line: { color: C.gold } });
    SECTIONS.forEach((sec, i) => {
      const on = i === sd.active;
      const y = 0.8 + i * 0.8;
      s.addText(sec, { x: 0.5, y, w: 9.0, h: 0.8, rtlMode: true, align: "right", valign: "middle", fontSize: on ? 32 : 20, bold: on, color: on ? C.gold : "8899AA", fontFace: F });
    });
    s.addNotes(sd.notes || "");
  }
  else if (sd.type === "content") {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, sd.title);
    if (sd.ch) addSidebar(s, sd.ch, sd.outlineIdx);
    addBullets(s, sd.bullets, sd.img);
    addSectionNum(s, num);
    s.addNotes(sd.notes || "");
  }
  else if (sd.type === "summary") {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, sd.title);
    addBullets(s, sd.bullets, sd.img);
    addSectionNum(s, num);
    s.addNotes(sd.notes || "");
  }
  else if (sd.type === "end") {
    const s = pres.addSlide();
    darkBg(s);
    s.addText("نهاية المحاضرة", { x: 0, y: 1.5, w: W, h: 1.0, rtlMode: true, align: "center", fontSize: 54, bold: true, color: C.white, fontFace: F });
    s.addText("الأسئلة ؟", { x: 0, y: 2.5, w: W, h: 1.2, rtlMode: true, align: "center", fontSize: 72, bold: true, color: C.gold, fontFace: F });
    s.addNotes(sd.notes || "");
  }
}

async function main() {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_16x9";
  pres.author = "[Author]";
  pres.title = "[Presentation Title]";

  // ── Load data modules ──────────────────────────────────────
  // Create your data files (data_intro_ch1.js, data_ch2.js, etc.)
  // Each must export an array of slide objects.
  // Example:
  //   const d1 = require("./data_intro_ch1.js");
  //   const d2 = require("./data_ch2.js");
  //   const allSlides = [...d1, ...d2];
  //
  // For now, load all data_*.js files automatically:
  const dataFiles = fs.readdirSync(__dirname)
    .filter(f => f.startsWith('data_') && f.endsWith('.js'))
    .sort();

  let allSlides = [];
  for (const df of dataFiles) {
    const mod = require(path.join(__dirname, df));
    allSlides = allSlides.concat(mod);
  }

  if (allSlides.length === 0) {
    console.error("No slide data files found. Create data_*.js files in Output/.");
    process.exit(1);
  }

  let num = 1;
  for (const sd of allSlides) {
    await buildSlide(pres, sd, num);
    num++;
  }

  const out = path.join(__dirname, "slides.pptx");
  await pres.writeFile({ fileName: out });
  console.log("Done: " + out + " (" + allSlides.length + " slides)");
}

main().catch(e => { console.error("Error:", e.message); process.exit(1); });
