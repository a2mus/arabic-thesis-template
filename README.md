# Arabic Thesis Template 📄🎤

A complete, AI-assisted pipeline for generating **Arabic RTL academic documents** (`.docx`) and **presentations** (`.pptx`) from source materials — designed for institutional theses and formal military/academic reports.

## What This Template Does

```
Data/ (source PDFs, DOCXs, PPTXs)
  ↓  /document-research — AI-assisted research & writing
Output/*.md (structured Arabic markdown chapters)
  ↓  /markdown-to-docx — automated DOCX generation
Output/report.docx (formatted Arabic Word document)
  ↓  /docx-to-pptx — automated PPTX generation
Output/slides.pptx (40-60 slide Arabic presentation with speaker notes)
```

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/a2mus/arabic-thesis-template.git
cd arabic-thesis-template
npm install
```

### 2. Add Your Materials
- Place source documents (PDFs, DOCXs, PPTXs) in `Data/`
- Place formatting templates in `Styles/` (Word template files for reference)

### 3. Extract Source Content
```bash
python extract_sources.py       # Extract text from all Data/ files
python .agents/scripts/extract_images.py  # Extract images from DOCXs/PPTXs
```

### 4. Use AI Agent Workflows
These workflows are designed for AI coding assistants (Gemini, Claude, etc.):

| Workflow | Command | Purpose |
|----------|---------|---------|
| Research & Write | `/document-research` | Interactive Arabic thesis generation from sources |
| Markdown → DOCX | `/markdown-to-docx` | Convert Output/*.md to formatted Word document |
| DOCX → PPTX | `/docx-to-pptx` | Convert approved report to 40-60 slide presentation |

### 5. Build Outputs
```bash
node build_docx.js              # Generate Word document from Output/*.md
node Output/generate_slides.js  # Generate PPTX from Output/data_*.js
```

## Project Structure

```
├── .agents/
│   ├── workflows/                  # AI agent workflow instructions
│   │   ├── document-research.md    # Research → markdown chapters
│   │   ├── markdown-to-docx.md     # Markdown → Word document
│   │   ├── docx-to-pptx.md        # Word → PowerPoint slides
│   │   └── configure-skills.md     # Skill configuration helper
│   └── scripts/
│       ├── extract_images.py       # Extract images from DOCX/PPTX files
│       └── generate_docx.js        # Agent-callable DOCX generator
├── Data/                           # Source materials (PDFs, DOCXs, PPTXs)
├── Output/                         # Generated content
│   ├── images/                     # Extracted and sourced images
│   ├── generate_slides.js          # PPTX generator script
│   └── data_example.js             # Example slide data module
├── Styles/                         # Formatting template files
├── build_docx.js                   # Markdown → DOCX builder
├── extract_sources.py              # Text extraction from source files
├── read_styles.py                  # Style inspector utility
└── package.json
```

## Key Features

### RTL Arabic Support
- Every text element uses `bidirectional: true` and `rightToLeft: true`
- Arabic punctuation (، ؛ ؟) enforced throughout
- Sakkal Majalla font by default (configurable)

### Modular Slide Generation
Large presentations are split into **data modules** (`data_intro_ch1.js`, `data_ch2.js`, etc.) to avoid LLM token limits. The generator script auto-discovers and assembles them.

### Comprehensive Speaker Notes
Every slide includes structured speaker notes following a 5-section template:
- ماذا أقول (What to say)
- أرقام وإحصائيات (Figures & statistics)
- لماذا مهم (Why it matters)
- أسئلة محتملة (Potential Q&A)
- الانتقال (Transition to next slide)

### Strict Terminology Control
The research workflow enforces using **only** terms found in source materials — never inventing or paraphrasing specialized vocabulary.

## Customization

### Colors & Fonts
Edit the `C` (colors) and `F` (font) constants in:
- `build_docx.js` — for the Word document
- `Output/generate_slides.js` — for the presentation

### Institution & Cover Page
Update the cover page sections in:
- `build_docx.js` → `buildDocx()` function
- `Output/generate_slides.js` → title slide section
- `Output/data_example.js` → `institution` field

### Slide Design
The presentation uses a content slide layout with:
- Title bar (full-width, dark navy)
- Right sidebar (chapter outline with active section highlighting)
- Content area (bullets + optional image)
- Section number badge

Customize in `Output/generate_slides.js` by editing `addSidebar()`, `addTitleBar()`, and `addBullets()`.

## Dependencies

| Package | Purpose |
|---------|---------|
| `docx` | Word document generation |
| `markdown-it` | Markdown parsing |
| `marked` | Alternative markdown parser |
| `pptxgenjs` | PowerPoint generation |

Python utilities require: `pdfplumber`, `python-docx`, `python-pptx` (auto-installed on first use).

## License

MIT
